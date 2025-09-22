import { type BoxProps, IconButton, styled } from '@mui/material';
import { MenuIcon } from '@shared/icons/MenuIcon';
import { AlignCenter } from '@shared/ui/layoutUtilComponents';
import { LogoIcon } from '@shared/icons/LogoIcon';
import useUIStore from '@domains/common/ui/store/ui.store';
import { MinimizeIcon } from '@shared/icons/MinimizeIcon';
import { CloseIcon } from '@shared/icons/CloseIcon';

const ChatHeader = () => {
  const setIsSidebarOpen = useUIStore((s) => s.setIsSidebarOpen);

  const onClose = () => {
    window.parent.postMessage({ type: 'chatbot-close' }, '*');
  };

  return (
    <StHeader component="header">
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
        <HeaderIconButton onClick={onClose}>
          <CloseIcon />
          {/* liveChat일때 끄기 아이콘 */}
          {/*<LiveCloseIcon />*/}
        </HeaderIconButton>
      </AlignCenter>
    </StHeader>
  );
};

export default ChatHeader;

const StHeader = styled(AlignCenter)<BoxProps>(({ theme }) => ({
  width: '100%',
  height: '68px',
  background: theme.palette.secondary.main,
  position: 'relative',
  padding: '20px 8px 0px',
  justifyContent: 'space-between',
}));

const HeaderIconButton = styled(IconButton)({
  width: '48px',
  height: '48px',
  cursor: 'pointer',
});

const Logo = styled(AlignCenter)({
  width: '48px',
  height: '48px',
  position: 'absolute',
  bottom: '0',
  left: '50%',
  transform: 'translateX(-50%)',
});
