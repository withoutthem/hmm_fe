import { CloseIcon } from '@shared/icons/CloseIcon';
import {
  BottomSheetContainer,
  CloseButton,
  Header,
  HeaderContainer,
  BottonSheetContent,
} from '@domains/chatbot/components/select/components/LanguageBottomSheet';
import useUIStore from '@domains/common/ui/store/ui.store';

const Quotation = () => {
  const closeBottomSheet = useUIStore((s) => s.closeBottomSheet);

  return (
    <BottomSheetContainer>
      <HeaderContainer>
        <Header variant={'title2Bold'}>Quotation</Header>
        <CloseButton onClick={closeBottomSheet}>
          <CloseIcon />
        </CloseButton>
      </HeaderContainer>
      <BottonSheetContent></BottonSheetContent>
    </BottomSheetContainer>
  );
};

export default Quotation;
