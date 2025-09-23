import { type ReactNode, useEffect, useRef } from 'react';
import { normalizeToSupported, resolvePreferredLocales } from '@shared/locale/resolve';
import { setupI18n, setI18nLanguage } from '@/i18n';
import useUserStore from '@domains/user/store/user.store';

/* -----------------------------------------------------------------------------
 * UserInfoProvider
 * - HMM 기간계 postMessage 수신 → (1) store에 "원본 로캘" 저장, (2) i18n/UI는 지원언어로 정규화
 * - 초기 언어: 1) HMM(postMessage, 짧게 대기) > 2) 브라우저 > 3) en-US
 * --------------------------------------------------------------------------- */

type Props = {
  children: ReactNode;
  allowedOrigins?: readonly string[];
  debug?: boolean;
};

const DEFAULT_ALLOWED_ORIGINS: readonly string[] = ['*']; // TODO: 배포 시 변경

/* ---------------------- 안전 타입 유틸 & 가드 ---------------------- */

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isStr = (v: unknown): v is string => typeof v === 'string';

/** 안전 문자열 읽기 */
const readString = (obj: unknown, key: string): string | null => {
  if (!isObj(obj)) return null;
  const val = (obj as Record<string, unknown>)[key];
  return typeof val === 'string' ? val : null;
};

/** 안전 객체 읽기 */
const readObject = (obj: unknown, key: string): Record<string, unknown> | null => {
  if (!isObj(obj)) return null;
  const val = (obj as Record<string, unknown>)[key];
  return isObj(val) ? (val as Record<string, unknown>) : null;
};

/** HMM 메시지 포맷 (최소 스키마) 확인 */
const isHmmEnvelope = (d: unknown): d is { source: 'HMM'; type: string; payload: unknown } => {
  if (!isObj(d)) return false;
  return (
    (d as Record<string, unknown>).source === 'HMM' && isStr((d as Record<string, unknown>).type)
  );
};

/** payload에서 locale 추출 (없으면 null) */
const extractPayloadLocale = (payload: unknown): string | null => readString(payload, 'locale');

/** payload에서 사용자 필드 추출 (없으면 공백 기본) */
const extractUserInfo = (payload: unknown) => {
  const p = isObj(payload) ? (payload as Record<string, unknown>) : {};
  return {
    userName: isStr(p.userName) ? p.userName : '',
    email: isStr(p.email) ? p.email : '',
    countryCode: isStr(p.countryCode) ? p.countryCode : '',
    id: isStr(p.id) ? p.id : '',
    tokenValue: readString(p.token, 'value'), // 민감정보: 값만 존재여부 확인
  };
};

/* ---------------------- 초기 HMM 로캘 잠깐 대기 ---------------------- */

const waitForInitialHmmLocale = (
  allowedOrigins: readonly string[],
  timeoutMs = 1200,
  debug = false
): Promise<string | null> =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);

    let settled = false;
    const allow = (origin: string) =>
      allowedOrigins.includes('*') || allowedOrigins.includes(origin);
    const done = (val: string | null) => {
      if (settled) return;
      settled = true;
      window.removeEventListener('message', onMsg);
      window.clearTimeout(t);
      resolve(val);
    };

    const onMsg = (ev: MessageEvent) => {
      try {
        if (!allow(ev.origin)) return;
        const data: unknown = ev.data;
        if (!isHmmEnvelope(data)) return;

        const type = readString(data, 'type');
        if (!type) return;
        const payload = readObject(data, 'payload');
        if (!payload) return;

        if (!payload) return;

        // 두 타입 모두 locale이 오면 채택
        if (type === 'HMM_SET_LOCALE' || type === 'HMM_SET_USERINFO') {
          const loc = extractPayloadLocale(payload);
          if (loc) return done(loc);
        }
      } catch (e) {
        if (debug) console.warn('[UserInfoProvider] initial wait error:', e);
      }
    };

    const t = window.setTimeout(() => done(null), timeoutMs);
    window.addEventListener('message', onMsg);
  });

/* ---------------------- 본체 ---------------------- */

const UserInfoProvider = ({
  children,
  allowedOrigins = DEFAULT_ALLOWED_ORIGINS,
  debug = false,
}: Props) => {
  const setGlobalLocale = useUserStore((s) => s.setGlobalLocale); // 원본(통신용) 로캘 저장
  const setUser = useUserStore((s) => s.setUser);
  const tokenRef = useRef<string | null>(null); // 토큰 값(민감) 메모리 보관만

  /** 🔰 초기 언어: HMM > 브라우저 > en-US */
  useEffect(() => {
    let mounted = true;

    (async () => {
      const hmmLocale = await waitForInitialHmmLocale(allowedOrigins, 1200, debug);
      const { uiLocale, rawPreferred } = resolvePreferredLocales(hmmLocale);

      // i18n은 지원 언어로 초기화
      await setupI18n(uiLocale);
      if (!mounted) return;

      // store에는 원본(또는 uiLocale) 보존
      setGlobalLocale(rawPreferred ?? uiLocale);

      // i18n 런타임 적용
      void setI18nLanguage(uiLocale);

      if (debug) console.log('[UserInfoProvider] init →', { hmmLocale, uiLocale, rawPreferred });
    })().catch((e) => debug && console.warn('[UserInfoProvider] init failed:', e));

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 지속 수신: 유저정보 / 언어 변경 */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const allow = (origin: string) =>
      allowedOrigins.includes('*') || allowedOrigins.includes(origin);

    const onMessage = (ev: MessageEvent) => {
      try {
        if (!allow(ev.origin)) return;
        const data: unknown = ev.data;
        if (!isHmmEnvelope(data)) return;

        const type = readString(data, 'type');
        if (!type) return;
        const payload = readObject(data, 'payload');
        if (!payload) return;

        if (type === 'HMM_SET_LOCALE') {
          const raw = extractPayloadLocale(payload);
          if (!raw) return;
          setGlobalLocale(raw); // 통신용 원본 저장
          void setI18nLanguage(normalizeToSupported(raw)); // UI는 정규화
          return;
        }

        if (type === 'HMM_SET_USERINFO') {
          const raw = extractPayloadLocale(payload);
          if (raw) {
            setGlobalLocale(raw);
            void setI18nLanguage(normalizeToSupported(raw));
          }
          const { userName, email, countryCode, tokenValue } = extractUserInfo(payload);
          setUser({ name: userName, email, countryCode, globalLocale: raw ?? '' });
          if (tokenValue) tokenRef.current = tokenValue; // 민감정보 로깅 금지
          return;
        }

        // HMM_PING 등은 필요 시 확장
      } catch (e) {
        if (debug) console.warn('[UserInfoProvider] message handling error:', e);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [allowedOrigins, setGlobalLocale, setUser, debug]);

  return <>{children}</>;
};

export default UserInfoProvider;
