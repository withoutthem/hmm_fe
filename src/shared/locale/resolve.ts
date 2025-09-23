/** UI가 직접 지원하는 로캘 (한/중/영/일) */
export const SUPPORTED = ['ko-KR', 'zh-CN', 'en-US', 'ja-JP'] as const;
export type SupportedLocale = (typeof SUPPORTED)[number];

/** 내부 전용: 소문자 비교용 캐시 */
const SUPPORTED_LOWER = SUPPORTED.map((s) => s.toLowerCase());

/** 문자열 타입 가드 */
const isString = (v: unknown): v is string => typeof v === 'string';
/** string[] 타입 가드 */
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isString);

/** normalizeToSupported */
export const normalizeToSupported = (input?: string | null): SupportedLocale => {
  const v = (input ?? '').trim().toLowerCase();
  if (!v) return 'en-US';

  const ix = SUPPORTED_LOWER.indexOf(v);
  if (ix >= 0) return SUPPORTED[ix] as SupportedLocale;

  const base = v.split('-')[0];
  switch (base) {
    case 'ko':
      return 'ko-KR';
    case 'zh':
      return 'zh-CN';
    case 'ja':
      return 'ja-JP';
    default:
      return 'en-US';
  }
};

/** 브라우저 선호언어 원본 */
export const getBrowserLocaleRaw = (): string | undefined => {
  if (typeof navigator === 'undefined') return undefined;
  const n: unknown = navigator;

  const langs = (n as { languages?: unknown }).languages;
  if (isStringArray(langs) && langs[0]) return langs[0];

  const language = (n as { language?: unknown }).language;
  if (isString(language)) return language;

  const userLanguage = (n as { userLanguage?: unknown }).userLanguage;
  if (isString(userLanguage)) return userLanguage;

  const browserLanguage = (n as { browserLanguage?: unknown }).browserLanguage;
  if (isString(browserLanguage)) return browserLanguage;

  return undefined;
};

/** 정규화된 브라우저 로캘 */
// export const getBrowserLocale = (): SupportedLocale => {
//   const raw = getBrowserLocaleRaw();
//   return normalizeToSupported(raw);
// };

/** 정책 우선순위 해석 */
export const resolvePreferredLocales = (
  hmmLocale?: string | null
): {
  uiLocale: SupportedLocale;
  rawPreferred: string | null;
  source: 'hmm' | 'browser' | 'fallback';
} => {
  if (isString(hmmLocale) && hmmLocale.trim()) {
    return { uiLocale: normalizeToSupported(hmmLocale), rawPreferred: hmmLocale, source: 'hmm' };
  }
  const raw = getBrowserLocaleRaw();
  if (raw) {
    return { uiLocale: normalizeToSupported(raw), rawPreferred: raw, source: 'browser' };
  }
  return { uiLocale: 'en-US', rawPreferred: null, source: 'fallback' };
};
