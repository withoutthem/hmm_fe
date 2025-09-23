import { type ReactNode, useEffect, useRef } from 'react';
import { normalizeToSupported, resolvePreferredLocales } from '@shared/locale/resolve';
import { setupI18n, setI18nLanguage } from '@/i18n';
import useUserStore from '@domains/user/store/user.store';

/* -----------------------------------------------------------------------------
 * UserInfoProvider
 * - postMessage로 받은 사용자/언어 → store(원본), i18n(UI: 정규화) 반영
 * - 초기 언어: 1) HMM(short wait) > 2) 브라우저 > 3) en-US
 * --------------------------------------------------------------------------- */

interface UserInfoProviderProps {
  children: ReactNode;
  allowedOrigin?: string;
  debug?: boolean;
}

// 단일 문자열만 사용
const DEFAULT_ALLOWED_ORIGIN = String(import.meta.env.VITE_ALLOWED_ORIGIN ?? '*').trim();

/* ---------------------- 안전 타입 유틸 & 가드 ---------------------- */

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isStr = (v: unknown): v is string => typeof v === 'string';

const readString = (obj: unknown, key: string): string | null => {
  if (!isObj(obj)) return null;
  const val = (obj as Record<string, unknown>)[key];
  return typeof val === 'string' ? val : null;
};

const readObject = (obj: unknown, key: string): Record<string, unknown> | null => {
  if (!isObj(obj)) return null;
  const val = (obj as Record<string, unknown>)[key];
  return isObj(val) ? (val as Record<string, unknown>) : null;
};

const isHmmEnvelope = (d: unknown): d is { source: 'HMM'; type: string; payload: unknown } =>
  isObj(d) &&
  (d as Record<string, unknown>).source === 'HMM' &&
  isStr((d as Record<string, unknown>).type);

const extractPayloadLocale = (payload: unknown): string | null => readString(payload, 'locale');

const extractUserInfo = (payload: unknown) => {
  const p = isObj(payload) ? (payload as Record<string, unknown>) : {};
  return {
    userName: isStr(p.userName) ? p.userName : '',
    email: isStr(p.email) ? p.email : '',
    countryCode: isStr(p.countryCode) ? p.countryCode : '',
    id: isStr(p.id) ? p.id : '',
    tokenValue: readString(p.token, 'value'),
  };
};

/* ---------------------- 초기 HMM 로캘 잠깐 대기 ---------------------- */

const waitForInitialHmmLocale = (
  allowedOrigin: string,
  timeoutMs = 1200,
  debug = false
): Promise<string | null> =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);

    let settled = false;
    const allow = (origin: string) => allowedOrigin === '*' || allowedOrigin === origin;

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
  allowedOrigin = DEFAULT_ALLOWED_ORIGIN,
  debug = false,
}: UserInfoProviderProps) => {
  const setGlobalLocale = useUserStore((s) => s.setGlobalLocale);
  const setUser = useUserStore((s) => s.setUser);
  const tokenRef = useRef<string | null>(null);

  // 초기 언어: HMM > 브라우저 > en-US
  useEffect(() => {
    let mounted = true;

    (async () => {
      const hmmLocale = await waitForInitialHmmLocale(allowedOrigin, 1200, debug);
      const { uiLocale, rawPreferred } = resolvePreferredLocales(hmmLocale);

      await setupI18n(uiLocale);
      if (!mounted) return;

      setGlobalLocale(rawPreferred ?? uiLocale);
      void setI18nLanguage(uiLocale);

      if (debug) console.log('[UserInfoProvider] init →', { hmmLocale, uiLocale, rawPreferred });
    })().catch((e) => debug && console.warn('[UserInfoProvider] init failed:', e));

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 지속 수신: 유저정보 / 언어 변경
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const allow = (origin: string) => allowedOrigin === '*' || allowedOrigin === origin;

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
          setGlobalLocale(raw); // 통신용 원본
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
          if (tokenValue) tokenRef.current = tokenValue; // 토큰 변경 시 덮어쓰기
          return;
        }
      } catch (e) {
        if (debug) console.warn('[UserInfoProvider] message handling error:', e);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [allowedOrigin, setGlobalLocale, setUser, debug]);

  return <>{children}</>;
};

export default UserInfoProvider;
