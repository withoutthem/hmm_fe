// src/i18n/index.ts
import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import koJson from './locales/ko/common.json';
import enJson from './locales/en/common.json';
import jaJson from './locales/ja/common.json';
import zhJson from './locales/zh/common.json';

export type I18nLocale = 'ko-KR' | 'zh-CN' | 'en-US' | 'ja-JP';

type Namespace = Readonly<Record<string, string>>;

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

export const setupI18n = async (initial: I18nLocale): Promise<typeof i18n> => {
  if (initialized) return i18n;

  await i18n.use(initReactI18next).init({
    resources,
    lng: initial,
    fallbackLng: 'en-US',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  initialized = true;
  return i18n;
};

export default i18n;
