import { Box, styled, ButtonGroup, Button, Typography } from '@mui/material';
import useUIStore from '@domains/common/ui/store/ui.store';

const TestAlert = () => {
  const setModalClose = useUIStore((state) => state.setModalClose);

  return (
    <AlertBox onClick={(e) => e.stopPropagation()}>
      <AlertContentWrap>
        <AlertContent>
          <Typography variant={'subtitle2Bold'}>제목을 입력하세요</Typography>
        </AlertContent>
      </AlertContentWrap>
      <AlertButtonGroup variant={'symmetry'}>
        <Button variant={'primary'} onClick={setModalClose}>
          버튼
        </Button>
      </AlertButtonGroup>
    </AlertBox>
  );
};

export default TestAlert;

const AlertBox = styled(Box)(({ theme }) => ({
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

const AlertContentWrap = styled(Box)({
  padding: '20px 20px 16px 20px',
});

const AlertContent = styled(Box)({
  minHeight: '36px',
});

const AlertButtonGroup = styled(ButtonGroup)({
  padding: '0 16px 16px 16px',
});
