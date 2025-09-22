import { Button, Typography } from '@mui/material';
import useUIStore from '@domains/common/ui/store/ui.store';
import {
  ModalBox,
  ModalButtonGroup,
  ModalContent,
  ModalContentWrap,
  ModalText,
} from '@domains/chatbot/components/modal/components/StyledModal';

const TestHeaderConfirm = () => {
  const setModalClose = useUIStore((state) => state.setModalClose);

  const onConfirm = () => {
    console.log('확인버튼누름');
  };

  return (
    <ModalBox onClick={(e) => e.stopPropagation()}>
      <ModalContentWrap>
        <ModalContent>
          <Typography variant={'subtitle2Bold'}>제목을 입력하세요</Typography>
          <ModalText variant={'body1Light'}>다이얼로그 내용을 입력하세요</ModalText>
        </ModalContent>
      </ModalContentWrap>
      {/*variant={'column'} 가능*/}
      <ModalButtonGroup variant={'symmetry'}>
        <Button variant={'secondary'} onClick={setModalClose}>
          버튼
        </Button>
        <Button variant={'primary'} onClick={onConfirm}>
          버튼
        </Button>
      </ModalButtonGroup>
    </ModalBox>
  );
};

export default TestHeaderConfirm;
