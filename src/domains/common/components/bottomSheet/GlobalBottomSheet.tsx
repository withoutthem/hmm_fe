import { Drawer, styled } from '@mui/material';
import useUIStore, { BottomSheetType } from '@domains/common/ui/store/ui.store';
import LanguageBottomSheet from '@domains/common/components/bottomSheet/components/LanguageBottomSheet';

const GlobalBottomSheet = () => {
  const isBottomSheetOpen = useUIStore((s) => s.isBottomSheetOpen);
  const bottomSheetType = useUIStore((s) => s.bottomSheetType);
  const closeBottomSheet = useUIStore((s) => s.closeBottomSheet);

  return (
    <StBottomSheet anchor="bottom" open={isBottomSheetOpen} onClose={closeBottomSheet}>
      {bottomSheetType === BottomSheetType.LANGUAGE && <LanguageBottomSheet />}
    </StBottomSheet>
  );
};

export default GlobalBottomSheet;

const StBottomSheet = styled(Drawer)({
  zIndex: '1400',

  '& .MuiPaper-root': {
    width: '100%',
    minHeight: '80vh',
    maxHeight: '80vh',
    borderRadius: '24px 24px 0 0',
  },
});
