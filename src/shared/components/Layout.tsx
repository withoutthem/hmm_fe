import React from 'react';
import Box from '@mui/material/Box';
import ChatHeader from '@shared/components/ChatHeader';
import Composer from '@shared/components/Composer';
import { type BoxProps, styled } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <StLayout className={'layout'}>
      <ChatHeader />
      <StMain component="main">{children}</StMain>
      <Composer />
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
