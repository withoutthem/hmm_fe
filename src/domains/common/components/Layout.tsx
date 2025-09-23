import Box from '@mui/material/Box';
import ChatHeader from '@domains/common/components/header/ChatHeader';
import Composer from '@domains/common/components/composer/Composer';
import { type BoxProps, styled } from '@mui/material';
import GlobalDialog from '@domains/chatbot/components/dialog/GlobalDialog';
import SideBar from '@domains/common/components/sideBar/SideBar';
import GlobalMenu from '@domains/common/components/menu/GlobalMenu';
import type { ReactNode } from 'react';
import GlobalBottomSheet from '@domains/chatbot/components/bottomSheet/GlobalBottomSheet';
import GlobalToast from '@domains/chatbot/components/toast/GlobalToast';
import GlobalModal from '@domains/chatbot/components/modal/GlobalModal';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <StLayout className={'layout'}>
      <ChatHeader />
      <StMain component="main">{children}</StMain>
      <Composer />
      <GlobalDialog />
      <SideBar />
      <GlobalMenu />
      <GlobalBottomSheet />
      <GlobalToast />
      <GlobalModal />
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

const StMain = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  flex: 1,
  background: theme.palette.secondary.main,
  overflow: 'hidden',
  padding: '16px',
}));
