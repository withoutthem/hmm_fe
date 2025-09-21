import { Menu, MenuItem, styled, Typography } from '@mui/material';
import { ResetIcon } from '@shared/icons/ResetIcon';
import { ChatIcon } from '@shared/icons/ChatIcon';
import { HistoryIcon } from '@shared/icons/HistoryIcon';
import { FAQIcon } from '@shared/icons/FAQIcon';
import useUIStore, { BottomSheetType } from '@domains/common/ui/store/ui.store';
import useDialogStore, { DialogType } from '@domains/common/ui/store/dialog.store';

const GlobalMenu = () => {
  const isMenuOpen = useUIStore((s) => s.isMenuOpen);
  const setIsMenuOpen = useUIStore((s) => s.setIsMenuOpen);
  const openDialog = useDialogStore((s) => s.openDialog);
  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);

  const onClose = () => {
    setIsMenuOpen(null);
  };

  const onHistoryClick = () => {
    openDialog(DialogType.HISTORY);
    onClose();
  };

  const onPublisherCheck = () => {
    const el = document.getElementById('publish');
    if (el) el.style.display = 'flex';
    onClose();
  };

  const onOpenBottomSheet = () => {
    onClose();
    setBottomSheetOpen(BottomSheetType.LANGUAGE);
  };

  return (
    <StMenu anchorEl={isMenuOpen} open={Boolean(isMenuOpen)} onClose={onClose}>
      <StMenuItem onClick={onClose}>
        <ResetIcon />
        <Typography variant={'subtitle3Light'}>처음으로</Typography>
      </StMenuItem>
      <StMenuItem onClick={onClose}>
        <ChatIcon />
        <Typography variant={'subtitle3Light'}>상담사연결 (라이브챗)</Typography>
      </StMenuItem>
      <StMenuItem onClick={onHistoryClick}>
        <HistoryIcon />
        <Typography variant={'subtitle3Light'}>상담이력</Typography>
      </StMenuItem>
      <StMenuItem onClick={onClose}>
        <FAQIcon />
        <Typography variant={'subtitle3Light'}>FAQ 바로가기</Typography>
      </StMenuItem>
      <StMenuItem onClick={onPublisherCheck}>
        <FAQIcon />
        <Typography variant={'subtitle3Light'}>퍼블리싱테스트보기</Typography>
      </StMenuItem>
      <StMenuItem onClick={onOpenBottomSheet}>bottomSheet.LANGUAGE</StMenuItem>
    </StMenu>
  );
};

export default GlobalMenu;

const StMenu = styled(Menu)({
  '& .MuiPaper-root': {
    transform: 'translate(0px, -60px) !important',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0px 0px 0.5px rgba(0, 0, 0, 0.25), 0px 16px 60px rgba(0, 0, 0, 0.3)',

    '& ul': { padding: '8px 0' },
  },
});

const StMenuItem = styled(MenuItem)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  gap: '8px',
});
