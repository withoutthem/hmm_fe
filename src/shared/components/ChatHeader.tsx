import { type BoxProps, IconButton, styled } from '@mui/material';
import { MenuIcon } from '@shared/icons/MenuIcon';
import { AlignCenter } from '@shared/ui/layoutUtilComponents';
import useUiStore from '@domains/common/ui/store/ui.store';
import { LogoIcon } from '@shared/icons/LogoIcon';
import { CloseIcon } from '@shared/icons/CloseIcon';
import { MinimizeIcon } from '@shared/icons/MinimizeIcon';

const ChatHeader = () => {
  const setIsSidebarOpen = useUiStore((s) => s.setIsSidebarOpen);

  return (
    <StyledChatHeader component={'header'}>
      <HeaderIconButton onClick={() => setIsSidebarOpen(true)}>
        <MenuIcon />
      </HeaderIconButton>

      <Logo>
        <LogoIcon />
      </Logo>

      <AlignCenter>
        <HeaderIconButton>
          <MinimizeIcon />
        </HeaderIconButton>
        <HeaderIconButton>
          <CloseIcon />
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

const Logo = styled(AlignCenter)({
  width: '48px',
  height: '48px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});
