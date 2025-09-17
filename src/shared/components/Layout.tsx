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
    <StyledLayout className={'layout'}>
      <ChatHeader />
      <StyledMain component="main">{children}</StyledMain>
      <Composer />
    </StyledLayout>
  );
};

export default Layout;

const StyledLayout = styled(Box)<BoxProps>({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const StyledMain = styled(Box)<BoxProps>({
  width: '100%',
  flex: 1,
  background: '#fff',
  overflow: 'hidden',
  padding: '16px',
});
