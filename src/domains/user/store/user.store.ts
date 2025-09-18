// src/domains/common/ui/ui.store.ts
import { create } from 'zustand';
import {
  getBrowserLocale,
  normalizeToSupported,
  type SupportedLocale,
} from '@shared/locale/resolve';

interface UserState {
  userName: string | null;
  userEmail: string | null;
  userCountryCode: string | null;
  userLangCode: string | null;
  globalLocale: SupportedLocale;

  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setUserCountryCode: (countryCode: string) => void;
  setUserLangCode: (langCode: string) => void;
  setUser: (user: { name: string; email: string; countryCode: string; langCode: string }) => void;
  setGlobalLocale: (locale: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  // 초기 상태
  userName: null,
  userEmail: null,
  userCountryCode: null,
  userLangCode: null,

  // 초기 전역 로캘은 브라우저 감지값
  globalLocale: getBrowserLocale(),

  // Actions
  setUserName: (name) => set({ userName: name }),
  setUserEmail: (email) => set({ userEmail: email }),
  setUserCountryCode: (countryCode) => set({ userCountryCode: countryCode }),
  setUserLangCode: (langCode) => set({ userLangCode: langCode }),
  setUser: ({ name, email, countryCode, langCode }) =>
    set({
      userName: name,
      userEmail: email,
      userCountryCode: countryCode,
      userLangCode: langCode,
    }),

  // 글로벌 로캘 교체(문자열 입력도 normalize)
  setGlobalLocale: (locale) => set({ globalLocale: normalizeToSupported(locale) }),
}));

export default useUserStore;
