// src/i18n/index.ts
import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import koJson from './locales/ko/common.json';
import enJson from './locales/en/common.json';
import jaJson from './locales/ja/common.json';
import zhJson from './locales/zh/common.json';

export type I18nLocale = 'ko-KR' | 'zh-CN' | 'en-US' | 'ja-JP';
type Namespace = Readonly<Record<string, string>>;

// JSON을 정적 임포트 → 타입 안전 래핑
const ko = koJson as unknown as Namespace;
const en = enJson as unknown as Namespace;
const ja = jaJson as unknown as Namespace;
const zh = zhJson as unknown as Namespace;

const resources: Resource = {
  'ko-KR': { common: ko },
  'zh-CN': { common: zh },
  'en-US': { common: en },
  'ja-JP': { common: ja },
};

let initialized = false;

/** setupI18n
 * - 최초 1회 i18next 초기화.
 * - 지원하지 않는 로캘이 들어오더라도 fallbackLng('en-US')로 안전하게 동작.
 */
export const setupI18n = async (initial: I18nLocale): Promise<typeof i18n> => {
  if (initialized) return i18n;

  await i18n.use(initReactI18next).init({
    resources,
    lng: initial, // 초기 언어
    fallbackLng: 'en-US', // 비지원 시 영어 인터페이스
    ns: ['common'], // 네임스페이스
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    // 읽기 쉬운 디버그 옵션 (필요시 주석 해제)
    // debug: process.env.NODE_ENV !== 'production',
  });

  initialized = true;
  return i18n;
};

/** setI18nLanguage
 * - 런타임 언어 변경 유틸.
 * - UI 지원 로캘만 받도록 타입을 I18nLocale로 제한합니다.
 */
export const setI18nLanguage = async (locale: I18nLocale): Promise<void> => {
  await i18n.changeLanguage(locale);
};
