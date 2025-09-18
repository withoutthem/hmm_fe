// src/app/providers/ApplicationProvider.tsx
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import baseTheme from '@theme/theme';
import { QueryProvider } from '@shared/platform/query';
import { StompProvider } from '@app/providers/StompProvider';

import { koKR, enUS, jaJP, zhCN } from '@mui/material/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import useUserStore from '@domains/user/store/user.store';
import { setupI18n } from '@/i18n';
import i18n from 'i18next';

interface ApplicationProvidersProps {
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

const applyDayjsLocale = (locale: string) => {
  const lang = locale.split('-')[0];
  const dj = locale === 'zh-CN' ? 'zh-cn' : lang;
  dayjs.locale(dj);
};

const ApplicationProvider = ({ children }: ApplicationProvidersProps) => {
  const globalLocale = useUserStore((s) => s.globalLocale);
  const initializedRef = useRef(false);
  const [i18nReady, setI18nReady] = useState(false); // 게이트

  // 최초 1회: i18n 초기화 + dayjs 로캘
  useEffect(() => {
    let mounted = true;
    void (async () => {
      if (!initializedRef.current) {
        await setupI18n(globalLocale);
        if (!mounted) return;
        applyDayjsLocale(globalLocale);
        initializedRef.current = true;
        setI18nReady(true); // 준비 완료
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 언어 변경 시 동기화
  useEffect(() => {
    if (!initializedRef.current) return;
    void i18n.changeLanguage(globalLocale);
    applyDayjsLocale(globalLocale);
  }, [globalLocale]);

  // MUI 로캘팩 합성
  const themed = useMemo(() => {
    const pack = pickMuiLocalePack(globalLocale);
    return createTheme(baseTheme, pack);
  }, [globalLocale]);

  return (
    <QueryProvider>
      <StompProvider>
        <ThemeProvider theme={themed}>{i18nReady ? children : null}</ThemeProvider>
      </StompProvider>
    </QueryProvider>
  );
};

export default ApplicationProvider;
