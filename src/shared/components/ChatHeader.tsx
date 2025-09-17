import { Box, type BoxProps, IconButton, styled } from '@mui/material';
import { MenuIcon } from '@shared/icons/MenuIcon';
import { AlignCenter } from '@shared/ui/layoutUtilComponents';
import LogoImg from '@assets/img/logo.svg';
import useUiStore from '@domains/common/ui/store/ui.store';

const ChatHeader = () => {
  const setIsSidebarOpen = useUiStore((s) => s.setIsSidebarOpen);

  return (
    <StyledChatHeader component={'header'}>
      <HeaderIconButton onClick={() => setIsSidebarOpen(true)}>
        <MenuIcon />
      </HeaderIconButton>

      <Logo>
        <Box component={'img'} src={LogoImg} alt={'hmm_logo'} />
      </Logo>

      <AlignCenter>
        <HeaderIconButton>
          <MenuIcon />
        </HeaderIconButton>
        <HeaderIconButton>
          <MenuIcon />
        </HeaderIconButton>
      </AlignCenter>
    </StyledChatHeader>
  );
};

export default ChatHeader;

const StyledChatHeader = styled(AlignCenter)<BoxProps>({
  width: '100%',
  height: '48px',
  background: '#fff',
  position: 'relative',
  padding: '0 8px',
  justifyContent: 'space-between',
});

const HeaderIconButton = styled(IconButton)({
  width: '48px',
  height: '48px',
});

const Logo = styled(Box)({
  width: '48px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  '& img': {
    width: '100%',
    objectFit: 'none',
  },
});
