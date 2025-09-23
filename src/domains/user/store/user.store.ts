// src/domains/user/store/user.store.ts
import { create } from 'zustand';
import { getBrowserLocaleRaw } from '@shared/locale/resolve';

interface UserState {
  // States
  userName: string | null;
  userEmail: string | null;
  userCountryCode: string | null;
  globalLocale: string;

  // Actions
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setUserCountryCode: (countryCode: string) => void;
  setUser: (user: {
    name: string;
    email: string;
    countryCode: string;
    globalLocale: string;
  }) => void;
  setGlobalLocale: (locale: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  // 초기 상태
  userName: null,
  userEmail: null,
  userCountryCode: null,

  // 통신용: 브라우저 원본이 있으면 그걸, 없으면 'en-US'
  globalLocale: getBrowserLocaleRaw() ?? 'en-US',

  // Actions
  setUserName: (name) => set({ userName: name }),
  setUserEmail: (email) => set({ userEmail: email }),
  setUserCountryCode: (countryCode) => set({ userCountryCode: countryCode }),
  setUser: ({ name, email, countryCode, globalLocale }) =>
    set({
      userName: name,
      userEmail: email,
      userCountryCode: countryCode,
      globalLocale,
    }),

  setGlobalLocale: (locale) => set({ globalLocale: (locale ?? '').trim() }),
}));

export default useUserStore;
