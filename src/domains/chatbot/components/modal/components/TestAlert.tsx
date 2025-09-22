import { Button, Typography } from '@mui/material';
import useUIStore from '@domains/common/ui/store/ui.store';
import {
  ModalBox,
  ModalButtonGroup,
  ModalContent,
  ModalContentWrap,
} from '@domains/chatbot/components/modal/components/StyledModal';

const TestAlert = () => {
  const setModalClose = useUIStore((state) => state.setModalClose);

  return (
    <ModalBox onClick={(e) => e.stopPropagation()}>
      <ModalContentWrap>
        <ModalContent>
          <Typography variant={'subtitle2Bold'}>제목을 입력하세요</Typography>
        </ModalContent>
      </ModalContentWrap>
      <ModalButtonGroup variant={'symmetry'}>
        <Button variant={'primary'} onClick={setModalClose}>
          버튼
        </Button>
      </ModalButtonGroup>
    </ModalBox>
  );
};

export default TestAlert;
