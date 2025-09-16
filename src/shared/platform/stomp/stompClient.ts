// src/shared/platform/stomp/stompClient.ts
import {
  Client,
  type IFrame,
  type IMessage,
  type StompHeaders,
  type StompSubscription,
} from '@stomp/stompjs';
import { STOMP_ENV, getRuntimeAccessToken } from './env';
import type {
  StompConfig,
  StompEventMap,
  StompEventName,
  StompListener,
  StompState,
} from './types';

/** 내부 유틸 */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getWindowOrigin(): string | undefined {
  return typeof window !== 'undefined' && window.location ? window.location.origin : undefined;
}

type SubEntry<T = unknown> = {
  subscription: StompSubscription | null;
  callbacks: Set<(msg: T) => void>;
  refCount: number;
};

type ListenerMap = {
  open: Set<StompListener<'open'>>;
  connecting: Set<StompListener<'connecting'>>;
  close: Set<StompListener<'close'>>;
  error: Set<StompListener<'error'>>;
  reconnecting: Set<StompListener<'reconnecting'>>;
  message: Set<StompListener<'message'>>;
};

/**
 * 엔터프라이즈용 STOMP 클라이언트 (SockJS 제거판)
 * - 단일 연결 보호(중복 activate 방지)
 * - 지수 백오프 + 지터
 * - 토큰 헤더/쿼리스트링 지원
 * - 지연 구독(lazy subscribe) + 재연결 시 자동 재구독
 * - destination 단위 멀티콜백 공유 구독 + 정확한 해지(refCount)
 */
export class StompClient {
  private client!: Client;
  private state: StompState = 'idle';
  private readonly listeners: ListenerMap = {
    open: new Set(),
    connecting: new Set(),
    close: new Set(),
    error: new Set(),
    reconnecting: new Set(),
    message: new Set(),
  };

  private readonly subs = new Map<string, SubEntry>();
  private activating = false;
  private started = false;

  // 백오프 파라미터
  private backoffMs = STOMP_ENV.STOMP_RETRY_MIN_MS;
  private readonly minMs = STOMP_ENV.STOMP_RETRY_MIN_MS;
  private readonly maxMs = STOMP_ENV.STOMP_RETRY_MAX_MS;

  private readonly cfg: {
    brokerURL: string;
    requestTimeoutMs: number;
    tokenProvider: () => string | undefined | Promise<string | undefined>;
    withTokenQuery: boolean;
    log: (level: 'debug' | 'warn' | 'error', ...args: unknown[]) => void;
    heartbeatIncoming: number;
    heartbeatOutgoing: number;
  };

  constructor(cfg: StompConfig = {}) {
    this.cfg = {
      brokerURL: cfg.brokerURL ?? STOMP_ENV.STOMP_BROKER_URL,
      requestTimeoutMs: STOMP_ENV.STOMP_REQUEST_TIMEOUT_MS,
      tokenProvider: cfg.tokenProvider ?? getRuntimeAccessToken,
      withTokenQuery: STOMP_ENV.STOMP_WS_WITH_TOKEN_QUERY,
      log: cfg.log ?? (() => {}),
      heartbeatIncoming: cfg.heartbeatIncoming ?? STOMP_ENV.STOMP_HEARTBEAT_INCOMING,
      heartbeatOutgoing: cfg.heartbeatOutgoing ?? STOMP_ENV.STOMP_HEARTBEAT_OUTGOING,
    };

    this.buildClient();
  }

  /** 현재 설정으로 stompjs Client 구성 */
  private buildClient() {
    const url = this.decorateUrlWithTokenIfNeeded(this.cfg.brokerURL);

    this.client = new Client({
      reconnectDelay: 0, // 커스텀 백오프로 제어 (stompjs 기본 reconnect 사용 안 함)
      heartbeatIncoming: this.cfg.heartbeatIncoming,
      heartbeatOutgoing: this.cfg.heartbeatOutgoing,
      debug: (str: string) => this.cfg.log('debug', str),
      beforeConnect: this.beforeConnect,
      onConnect: this.onConnect,
      onDisconnect: this.onDisconnect,
      onStompError: this.onStompError,
      onWebSocketError: this.onWebSocketError,
      brokerURL: url,
    });
  }

  private isWebSocketAvailable(): boolean {
    try {
      return typeof WebSocket === 'function';
    } catch {
      return false;
    }
  }

  /** 필요 시 쿼리스트링으로 토큰 부착 */
  private decorateUrlWithTokenIfNeeded(url: string): string {
    if (!this.cfg.withTokenQuery) return url;
    try {
      const u = new URL(url, getWindowOrigin());
      const tokenMaybe = STOMP_ENV.RUNTIME_ACCESS_TOKEN ?? undefined;
      if (tokenMaybe) u.searchParams.set('access_token', tokenMaybe);
      return u.toString();
    } catch {
      return url;
    }
  }

  /* ---------- 이벤트 on/off ---------- */
  on<K extends StompEventName>(k: K, fn: StompListener<K>): () => void {
    (this.listeners[k] as Set<StompListener<K>>).add(fn);
    return () => this.off(k, fn);
  }
  off<K extends StompEventName>(k: K, fn: StompListener<K>): void {
    (this.listeners[k] as Set<StompListener<K>>).delete(fn);
  }
  private emit<K extends StompEventName>(k: K, ...args: StompEventMap[K]): void {
    const set = this.listeners[k] as Set<StompListener<K>>;
    for (const fn of set) {
      try {
        fn(...args);
      } catch (e) {
        this.cfg.log('error', 'listener error', e);
      }
    }
  }

  /* ---------- 상태 ---------- */
  public getState(): StompState {
    return this.state;
  }
  public isActive(): boolean {
    return !!this.client?.active;
  }

  /* ---------- 연결/해제 ---------- */
  public connect(): void {
    if (!this.isWebSocketAvailable()) {
      this.cfg.log('error', 'WebSocket not available in this environment');
      return;
    }
    if (this.activating || this.client.active) return;
    this.activating = true;
    this.started = true;
    this.state = 'connecting';
    this.emit('connecting');
    this.client.activate();
    this.activating = false;
  }

  public async disconnect(): Promise<void> {
    this.started = false;
    this.state = 'closing';
    try {
      await this.client.deactivate();
    } finally {
      this.state = 'closed';
    }
  }

  /* ---------- 내부 콜백 ---------- */

  private readonly beforeConnect = async () => {
    // 토큰 헤더 부착(쿼리스트링 방식과 병행 가능)
    try {
      const token = await this.cfg.tokenProvider();
      if (token) {
        this.client.connectHeaders = this.client.connectHeaders ?? ({} as StompHeaders);
        this.client.connectHeaders.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      this.cfg.log('error', 'token provider failed', e);
    }
  };

  private readonly onConnect = (frame: IFrame) => {
    // 연결 성공 → 백오프 리셋
    this.backoffMs = this.minMs;
    this.state = 'open';
    this.emit('open', frame);

    // 지연 구독/재연결 구독 처리
    for (const [destination, entry] of this.subs) {
      entry.subscription ??= this.client.subscribe(destination, (msg: IMessage) => {
        try {
          const parsed = (msg.body ? JSON.parse(msg.body) : undefined) as unknown;
          (entry.callbacks as Set<(m: unknown) => void>).forEach((fn) => fn(parsed));
          this.emit('message', msg);
        } catch (e) {
          this.cfg.log('error', `Failed to parse STOMP message body for ${destination}`, e);
        }
      });
    }
  };

  private readonly onDisconnect = () => {
    this.state = 'closed';
    this.emit('close');

    // 모든 구독을 끊고(핸들은 null로), 재연결 시 다시 subscribe
    for (const e of this.subs.values()) {
      e.subscription = null;
    }

    if (this.started) {
      void this.scheduleReconnect();
    }
  };

  private readonly onStompError = (frame: IFrame) => {
    this.cfg.log('error', 'STOMP error', frame.headers['message'], frame.body);
    this.emit('error', frame);
  };

  private readonly onWebSocketError = () => {
    this.emit('reconnecting');
    void this.scheduleReconnect();
  };

  private async scheduleReconnect() {
    // 지수 백오프 + 지터(0~250ms)
    this.backoffMs = Math.min(
      this.maxMs,
      Math.floor(this.backoffMs * 1.7) + Math.floor(Math.random() * 250)
    );
    const wait = this.backoffMs;
    this.cfg.log('warn', `[STOMP] reconnect in ${wait}ms`);
    await sleep(wait);
    if (!this.started) return;
    try {
      this.state = 'connecting';
      this.emit('connecting');
      this.client.activate();
    } catch (e) {
      this.cfg.log('error', 'reconnect failed', e);
      // 실패해도 다음 onWebSocketError → scheduleReconnect로 순환
    }
  }

  /* ---------- 발행/구독 ---------- */

  public publish(destination: string, body?: unknown, headers: StompHeaders = {}): void {
    if (!this.client.connected) {
      this.cfg.log('warn', `publish dropped (not connected): ${destination}`);
      return;
    }
    const payload = body === undefined ? '' : JSON.stringify(body);
    this.client.publish({ destination, body: payload, headers });
  }

  public subscribe<T = unknown>(destination: string, callback: (message: T) => void): () => void {
    // destination 단위 공유 엔트리
    let entry = this.subs.get(destination) as SubEntry<T> | undefined;
    if (!entry) {
      entry = { subscription: null, callbacks: new Set<(msg: T) => void>(), refCount: 0 };
      this.subs.set(destination, entry as SubEntry);
    }

    // 현재 연결되어 있으면 즉시 서버 구독 보장
    if (this.client.connected && entry.subscription === null) {
      entry.subscription = this.client.subscribe(destination, (msg: IMessage) => {
        try {
          const parsed = (msg.body ? JSON.parse(msg.body) : undefined) as T;
          entry!.callbacks.forEach((fn) => fn(parsed));
          this.emit('message', msg);
        } catch (e) {
          this.cfg.log('error', `Failed to parse STOMP message body for ${destination}`, e);
        }
      });
    }

    // 연결 전이어도 콜백은 등록(지연 구독) + 필요 시 연결 트리거
    entry.callbacks.add(callback);
    entry.refCount++;
    if (!this.client.active) {
      this.connect();
    }

    // 해지 함수
    let unsubscribed = false;
    return () => {
      if (unsubscribed) return;
      unsubscribed = true;
      const e = this.subs.get(destination) as SubEntry<T> | undefined;
      if (!e) return;
      e.callbacks.delete(callback);
      e.refCount--;

      if (e.refCount <= 0) {
        // 실제 서버 구독 해지(연결 상태에 따라)
        try {
          e.subscription?.unsubscribe();
        } catch {
          /* ignore */
        }
        this.subs.delete(destination);
      }
    };
  }
}
