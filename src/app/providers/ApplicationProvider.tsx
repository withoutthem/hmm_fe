// src/app/providers/ApplicationProvider.tsx
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import baseTheme from '@theme/theme';
import { QueryProvider } from '@shared/platform/query';
import { StompProvider } from '@app/providers/StompProvider';
import { connectOnce } from '@shared/platform/stomp';
import { koKR, enUS, jaJP, zhCN } from '@mui/material/locale';
import useUserStore from '@domains/user/store/user.store';
import { normalizeToSupported } from '@shared/locale/resolve';
import UserInfoProvider from './UserInfoProvider';
import { setI18nLanguage } from '@/i18n';
import i18n from 'i18next'; // ⬅️ i18n 상태 확인용

interface Props {
  children: ReactNode;
}

const pickMuiLocalePack = (locale: string) => {
  switch (locale) {
    case 'ko-KR':
      return koKR;
    case 'ja-JP':
      return jaJP;
    case 'zh-CN':
      return zhCN;
    default:
      return enUS;
  }
};

const ApplicationProvider = ({ children }: Props) => {
  const globalLocale = useUserStore((s) => s.globalLocale);

  // STOMP 연결
  useEffect(() => {
    void connectOnce();
  }, []);

  // UI 로캘은 지원 언어로 정규화
  const uiLocale = useMemo(() => normalizeToSupported(globalLocale), [globalLocale]);

  // ✅ i18n 초기화 완료될 때까지 렌더 지연 (SideBar의 useTranslation 보호)
  const [i18nReady, setI18nReady] = useState<boolean>(i18n.isInitialized);
  useEffect(() => {
    if (i18n.isInitialized) return setI18nReady(true);
    const onInit = () => setI18nReady(true);
    i18n.on('initialized', onInit);
    return () => {
      i18n.off('initialized', onInit);
    };
  }, []);

  // ✅ i18n이 초기화된 이후에만 언어 변경 호출
  useEffect(() => {
    if (!i18n.isInitialized) return;
    void setI18nLanguage(uiLocale);
  }, [uiLocale]);

  const themed = useMemo(() => createTheme(baseTheme, pickMuiLocalePack(uiLocale)), [uiLocale]);

  return (
    <QueryProvider>
      <StompProvider>
        <UserInfoProvider>
          <ThemeProvider theme={themed}>{i18nReady ? children : null}</ThemeProvider>
        </UserInfoProvider>
      </StompProvider>
    </QueryProvider>
  );
};

export default ApplicationProvider;
