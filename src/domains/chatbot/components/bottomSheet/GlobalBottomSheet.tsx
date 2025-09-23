import { Drawer, styled } from '@mui/material';
import useUIStore, { BottomSheetType } from '@domains/common/ui/store/ui.store';
import Quotation from '@domains/chatbot/components/bottomSheet/components/Quotation';

const GlobalBottomSheet = () => {
  const isBottomSheetOpen = useUIStore((s) => s.isBottomSheetOpen);
  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);
  const bottomSheetType = useUIStore((s) => s.bottomSheetType);

  return (
    <StBottomSheet
      anchor="bottom"
      open={isBottomSheetOpen}
      onClose={() => setBottomSheetOpen(null)}
    >
      {bottomSheetType === BottomSheetType.QUOTATION && <Quotation />}
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
    height: '80vh',
    borderRadius: '24px 24px 0 0',
  },
});
