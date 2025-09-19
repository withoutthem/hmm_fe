// src/shared/locale/resolve.ts
export const SUPPORTED = ['ko-KR', 'zh-CN', 'en-US', 'ja-JP'] as const;
export type SupportedLocale = (typeof SUPPORTED)[number];

export const normalizeToSupported = (input?: string): SupportedLocale => {
  const v = (input ?? '').trim().toLowerCase();
  if (!v) return 'en-US';

  // 완전 일치 우선
  const hit = SUPPORTED.find((s) => s.toLowerCase() === v);
  if (hit) return hit;

  // 언어 코드만 들어온 경우 베이스 매핑
  const base = v.split('-')[0];
  switch (base) {
    case 'ko':
      return 'ko-KR';
    case 'zh':
      return 'zh-CN'; // 기본 중국어는 간체(중국)
    case 'ja':
      return 'ja-JP';
    default:
      return 'en-US';
  }
};

// ---------- 타입 가드 ----------
const isString = (v: unknown): v is string => typeof v === 'string';
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isString);

// ---------- 브라우저 로캘 안전 추출 ----------
export const getBrowserLocale = (): SupportedLocale => {
  let cand: string | undefined;

  if (typeof navigator !== 'undefined') {
    const navUnknown: unknown = navigator;

    // languages[0]
    const langs = (navUnknown as { languages?: unknown }).languages;
    if (!cand && isStringArray(langs) && langs.length > 0) {
      cand = langs[0];
    }

    // language
    const language = (navUnknown as { language?: unknown }).language;
    if (!cand && isString(language)) {
      cand = language;
    }

    // userLanguage (IE/레거시)
    const userLanguage = (navUnknown as { userLanguage?: unknown }).userLanguage;
    if (!cand && isString(userLanguage)) {
      cand = userLanguage;
    }

    // browserLanguage (IE/레거시)
    const browserLanguage = (navUnknown as { browserLanguage?: unknown }).browserLanguage;
    if (!cand && isString(browserLanguage)) {
      cand = browserLanguage;
    }
  }

  // cand가 없거나 이상하면 normalize에서 안전 처리
  return normalizeToSupported(cand);
};
