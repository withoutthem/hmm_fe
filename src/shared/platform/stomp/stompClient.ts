import {
  Client,
  type IFrame,
  type IMessage,
  type StompHeaders,
  type StompSubscription,
} from '@stomp/stompjs'
import SockJS from 'sockjs-client' // 타입 제공됨 (@types/sockjs-client 필요 시 아래 d.ts 참고)
import { STOMP_ENV, getRuntimeAccessToken } from './env'
import type { StompConfig, StompEventMap, StompEventName, StompListener, StompState } from './types'

/** 내부 유틸 */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function getWindowOrigin(): string | undefined {
  return typeof window !== 'undefined' && window.location ? window.location.origin : undefined
}

type SubEntry<T = unknown> = {
  subscription: StompSubscription
  callbacks: Set<(msg: T) => void>
  refCount: number
}

type ListenerMap = {
  open: Set<StompListener<'open'>>
  connecting: Set<StompListener<'connecting'>>
  close: Set<StompListener<'close'>>
  error: Set<StompListener<'error'>>
  reconnecting: Set<StompListener<'reconnecting'>>
  message: Set<StompListener<'message'>>
}

/**
 * 엔터프라이즈용 STOMP 클라이언트
 * - 단일 연결 보호(중복 activate 방지)
 * - 지수 백오프 + 지터
 * - 토큰 헤더/쿼리스트링 지원
 * - WebSocket → SockJS 자동 폴백
 * - destination 단위 멀티콜백 공유 구독 + 정확한 해지(id 기반)
 */
export class StompClient {
  private client!: Client
  private state: StompState = 'idle'
  private readonly listeners: ListenerMap = {
    open: new Set(),
    connecting: new Set(),
    close: new Set(),
    error: new Set(),
    reconnecting: new Set(),
    message: new Set(),
  }

  private readonly subs = new Map<string, SubEntry>()
  private activating = false
  private started = false

  // 백오프 파라미터
  private backoffMs = STOMP_ENV.STOMP_RETRY_MIN_MS
  private readonly minMs = STOMP_ENV.STOMP_RETRY_MIN_MS
  private readonly maxMs = STOMP_ENV.STOMP_RETRY_MAX_MS

  // 실행 중 transport 전환 플래그(WS 실패 → SockJS 1회 전환)
  private triedSockJsFallback = false

  private readonly cfg: {
    brokerURL: string
    sockJsUrl: string
    requestTimeoutMs: number
    tokenProvider: () => string | undefined | Promise<string | undefined>
    withTokenQuery: boolean
    log: (level: 'debug' | 'warn' | 'error', ...args: unknown[]) => void
    transport: 'auto' | 'ws' | 'sockjs'
    heartbeatIncoming: number
    heartbeatOutgoing: number
  }

  constructor(cfg: StompConfig = {}) {
    this.cfg = {
      brokerURL: cfg.brokerURL ?? STOMP_ENV.STOMP_BROKER_URL,
      sockJsUrl: STOMP_ENV.STOMP_SOCKJS_URL, // http(s) 기반
      requestTimeoutMs: STOMP_ENV.STOMP_REQUEST_TIMEOUT_MS,
      tokenProvider: cfg.tokenProvider ?? getRuntimeAccessToken,
      withTokenQuery: STOMP_ENV.STOMP_WS_WITH_TOKEN_QUERY,
      log: cfg.log ?? (() => {}),
      transport: STOMP_ENV.STOMP_TRANSPORT,
      heartbeatIncoming: cfg.heartbeatIncoming ?? STOMP_ENV.STOMP_HEARTBEAT_INCOMING,
      heartbeatOutgoing: cfg.heartbeatOutgoing ?? STOMP_ENV.STOMP_HEARTBEAT_OUTGOING,
    }

    this.buildClient(/*preferSockJs*/ this.cfg.transport === 'sockjs')
  }

  /** 현재 설정으로 stompjs Client 구성 */
  private buildClient(preferSockJs = false) {
    const useSockJs =
      preferSockJs ||
      this.cfg.transport === 'sockjs' ||
      (this.cfg.transport === 'auto' && !this.isWebSocketAvailable())

    // brokerURL 또는 webSocketFactory 둘 중 하나만 설정
    const baseOptions = {
      reconnectDelay: 0, // 커스텀 백오프로 제어 (stompjs 기본 reconnect 사용 안 함)
      heartbeatIncoming: this.cfg.heartbeatIncoming,
      heartbeatOutgoing: this.cfg.heartbeatOutgoing,
      debug: (str: string) => this.cfg.log('debug', str),
      beforeConnect: this.beforeConnect,
      onConnect: this.onConnect,
      onDisconnect: this.onDisconnect,
      onStompError: this.onStompError,
      onWebSocketError: this.onWebSocketError,
    } as const

    if (useSockJs) {
      const url = this.decorateUrlWithTokenIfNeeded(this.cfg.sockJsUrl)
      this.client = new Client({
        ...baseOptions,
        webSocketFactory: () => new SockJS(url),
      })
      this.cfg.log('debug', '[STOMP] using SockJS', url)
    } else {
      const url = this.decorateUrlWithTokenIfNeeded(this.cfg.brokerURL)
      this.client = new Client({
        ...baseOptions,
        brokerURL: url,
      })
      this.cfg.log('debug', '[STOMP] using WebSocket', url)
    }
  }

  private isWebSocketAvailable(): boolean {
    try {
      return typeof WebSocket === 'function'
    } catch {
      return false
    }
  }

  /** 필요 시 쿼리스트링으로 토큰 부착 */
  private decorateUrlWithTokenIfNeeded(url: string): string {
    if (!this.cfg.withTokenQuery) return url
    try {
      const u = new URL(url, getWindowOrigin())
      const tokenMaybe = STOMP_ENV.RUNTIME_ACCESS_TOKEN ?? undefined
      if (tokenMaybe) u.searchParams.set('access_token', tokenMaybe)
      return u.toString()
    } catch {
      return url
    }
  }

  /* ---------- 이벤트 on/off ---------- */
  on<K extends StompEventName>(k: K, fn: StompListener<K>): () => void {
    ;(this.listeners[k] as Set<StompListener<K>>).add(fn)
    return () => this.off(k, fn)
  }
  off<K extends StompEventName>(k: K, fn: StompListener<K>): void {
    ;(this.listeners[k] as Set<StompListener<K>>).delete(fn)
  }
  private emit<K extends StompEventName>(k: K, ...args: StompEventMap[K]): void {
    const set = this.listeners[k] as Set<StompListener<K>>
    for (const fn of set) {
      try {
        fn(...args)
      } catch (e) {
        this.cfg.log('error', 'listener error', e)
      }
    }
  }

  /* ---------- 상태 ---------- */
  /** 외부에서 상태 조회할 수 있도록 public 유지 */
  public getState(): StompState {
    return this.state
  }
  public isActive(): boolean {
    return !!this.client?.active
  }

  /* ---------- 연결/해제 ---------- */
  public connect(): void {
    if (this.activating || this.client.active) return
    this.activating = true
    this.started = true
    this.state = 'connecting'
    this.emit('connecting')
    this.client.activate()
    this.activating = false
  }

  public async disconnect(): Promise<void> {
    this.started = false
    this.state = 'closing'
    try {
      await this.client.deactivate()
    } finally {
      this.state = 'closed'
    }
  }

  /* ---------- 내부 콜백 ---------- */

  private readonly beforeConnect = async () => {
    // 토큰 헤더 부착(쿼리스트링 방식과 병행 가능)
    try {
      const token = await this.cfg.tokenProvider()
      if (token) {
        this.client.connectHeaders = this.client.connectHeaders ?? ({} as StompHeaders)
        this.client.connectHeaders.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      this.cfg.log('error', 'token provider failed', e)
    }
  }

  private readonly onConnect = (frame: IFrame) => {
    // 연결 성공 → 백오프 리셋
    this.backoffMs = this.minMs
    this.state = 'open'
    this.emit('open', frame)
  }

  private readonly onDisconnect = () => {
    this.state = 'closed'
    this.emit('close')
    // 수동 종료가 아니라 started=true라면 재시도
    if (this.started) {
      void this.scheduleReconnect()
    }
  }

  private readonly onStompError = (frame: IFrame) => {
    this.cfg.log('error', 'STOMP error', frame.headers['message'], frame.body)
    this.emit('error', frame)
  }

  private readonly onWebSocketError = async () => {
    this.emit('reconnecting')

    // WS 실패 시, auto 모드이면서 아직 SockJS를 시도하지 않았다면 1회 폴백 전환
    if (this.cfg.transport === 'auto' && !this.triedSockJsFallback) {
      this.triedSockJsFallback = true
      this.cfg.log('warn', '[STOMP] WebSocket error → fallback to SockJS once')
      try {
        await this.client.deactivate()
      } catch {
        // ignore
      }
      this.buildClient(true /*preferSockJs*/)
      if (this.started) this.connect()
      return
    }

    // 일반 백오프 재시도
    void this.scheduleReconnect()
  }

  private async scheduleReconnect() {
    // 지수 백오프 + 지터(0~250ms)
    this.backoffMs = Math.min(
      this.maxMs,
      Math.floor(this.backoffMs * 1.7) + Math.floor(Math.random() * 250)
    )
    const wait = this.backoffMs
    this.cfg.log('warn', `[STOMP] reconnect in ${wait}ms`)
    await sleep(wait)
    if (!this.started) return
    try {
      this.state = 'connecting'
      this.emit('connecting')
      this.client.activate()
    } catch (e) {
      this.cfg.log('error', 'reconnect failed', e)
      // 실패해도 다음 onWebSocketError → scheduleReconnect로 순환
    }
  }

  /* ---------- 발행/구독 ---------- */

  public publish(destination: string, body?: unknown, headers: StompHeaders = {}): void {
    const payload = body === undefined ? '' : JSON.stringify(body)
    this.client.publish({ destination, body: payload, headers })
  }

  public subscribe<T = unknown>(destination: string, callback: (message: T) => void): () => void {
    let entry = this.subs.get(destination) as SubEntry<T> | undefined
    if (!entry) {
      const callbacks = new Set<(msg: T) => void>()
      const subscription = this.client.subscribe(destination, (msg: IMessage) => {
        try {
          const parsed = (msg.body ? JSON.parse(msg.body) : undefined) as T
          callbacks.forEach((fn) => fn(parsed))
          // 전역 message 이벤트도 브로드캐스트(옵션)
          this.emit('message', msg)
        } catch (e) {
          this.cfg.log('error', `Failed to parse STOMP message body for ${destination}`, e)
        }
      })
      entry = { subscription, callbacks, refCount: 0 }
      this.subs.set(destination, entry as SubEntry)
    }

    entry.callbacks.add(callback)
    entry.refCount++

    let unsubscribed = false
    return () => {
      if (unsubscribed) return
      unsubscribed = true
      const e = this.subs.get(destination) as SubEntry<T> | undefined
      if (!e) return
      e.callbacks.delete(callback)
      e.refCount--
      if (e.refCount <= 0) {
        try {
          e.subscription.unsubscribe()
        } finally {
          this.subs.delete(destination)
        }
      }
    }
  }
}
