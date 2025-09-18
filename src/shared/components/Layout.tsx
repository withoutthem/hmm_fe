import React from 'react';
import Box from '@mui/material/Box';
import ChatHeader from '@shared/components/ChatHeader';
import Composer from '@shared/components/Composer';
import { type BoxProps, Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CenterBox } from '@shared/ui/layoutUtilComponents';
import useUserStore from '@domains/user/store/user.store';
import type { SupportedLocale } from '@shared/locale/resolve';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  //TEST
  const [t, i18n, ready] = useTranslation();

  //TEST
  const globalLocale = useUserStore((s) => s.globalLocale);
  const setGlobalLocale = useUserStore((s) => s.setGlobalLocale);

  //TEST
  const changeLanguage = (lng: SupportedLocale) => {
    setGlobalLocale(lng);
  };

  return (
    <StLayout className={'layout'}>
      <ChatHeader />
      <StMain component="main">{children}</StMain>
      <Composer />

      <TestTranslateBox>
        <Box>
          {i18n.language} - {ready ? 'ready' : 'not ready'}
        </Box>
        <Button
          sx={{ color: '#fff' }}
          onClick={() => {
            //한중영일 무한 순환
            changeLanguage(
              globalLocale === 'en-US'
                ? 'ko-KR'
                : globalLocale === 'ko-KR'
                  ? 'ja-JP'
                  : globalLocale === 'ja-JP'
                    ? 'zh-CN'
                    : 'en-US'
            );
          }}
        >
          언어 변경하기
        </Button>
        번역값 : {t('test')}
      </TestTranslateBox>
    </StLayout>
  );
};

export default Layout;

const StLayout = styled(Box)<BoxProps>({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const StMain = styled(Box)<BoxProps>({
  width: '100%',
  flex: 1,
  background: '#fff',
  overflow: 'hidden',
  padding: '16px',
});

const TestTranslateBox = styled(CenterBox)({
  position: 'fixed',
  bottom: 100,
  right: 40,
  zIndex: 9999,
  background: 'blue',
  color: '#fff',
});
