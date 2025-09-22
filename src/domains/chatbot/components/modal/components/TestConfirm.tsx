import { Box, styled, ButtonGroup, Button, Typography } from '@mui/material';
import useUIStore from '@domains/common/ui/store/ui.store';

const TestConfirm = () => {
  const setModalClose = useUIStore((state) => state.setModalClose);

  const onConfirm = () => {
    console.log('확인버튼누름');
  };

  return (
    <ConfirmBox onClick={(e) => e.stopPropagation()}>
      <ConfirmContentWrap>
        <ConfirmContent>
          <Typography variant={'subtitle2Bold'}>제목을 입력하세요</Typography>
        </ConfirmContent>
      </ConfirmContentWrap>
      {/*variant={'column'} 가능*/}
      <ConfirmButtonGroup variant={'symmetry'}>
        <Button variant={'secondary'} onClick={setModalClose}>
          버튼
        </Button>
        <Button variant={'primary'} onClick={onConfirm}>
          버튼
        </Button>
      </ConfirmButtonGroup>
    </ConfirmBox>
  );
};

export default TestConfirm;

const ConfirmBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '12px',
  background: theme.palette.secondary.main,
  display: 'flex',
  flexDirection: 'column',
  minWidth: '295px',
}));

const ConfirmContentWrap = styled(Box)({
  padding: '20px 20px 16px 20px',
});

const ConfirmContent = styled(Box)({
  minHeight: '36px',
  display: 'flex',
  flexDirection: 'column',
});

const ConfirmButtonGroup = styled(ButtonGroup)({
  padding: '0 16px 16px 16px',
});
