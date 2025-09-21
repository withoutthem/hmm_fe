import { type BoxProps, IconButton, styled } from '@mui/material';
import { MenuIcon } from '@shared/icons/MenuIcon';
import { AlignCenter } from '@shared/ui/layoutUtilComponents';
import { LogoIcon } from '@shared/icons/LogoIcon';
import useUIStore from '@domains/common/ui/store/ui.store';
import { MinimizeIcon } from '@shared/icons/MinimizeIcon';
import { CloseIcon } from '@shared/icons/CloseIcon';
import { LiveCloseIcon } from '@shared/icons/LiveCloseIcon';

const ChatHeader = () => {
  const setIsSidebarOpen = useUIStore((s) => s.setIsSidebarOpen);

  return (
    <StHeader component={'header'}>
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
          {/* liveChat일때 끄기 아이콘 */}
          {/*<LiveCloseIcon />*/}
        </HeaderIconButton>
      </AlignCenter>
    </StHeader>
  );
};

export default ChatHeader;

const StHeader = styled(AlignCenter)<BoxProps>({
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
