import { Snackbar, styled, Typography, Slide } from '@mui/material';
import type { SlideProps } from '@mui/material/Slide';
import useUIStore from '@domains/common/ui/store/ui.store';
import { Success } from '@shared/icons/Success';
import { Warning } from '@shared/icons/Warning';
import { Error } from '@shared/icons/Error';
import { AlignCenter } from '@shared/ui/layoutUtilComponents';

function TransitionUp(props: Readonly<SlideProps>) {
  return (
    <Slide {...props} direction="up">
      {props.children}
    </Slide>
  );
}

const GlobalToast = () => {
  const isToastOpen = useUIStore((s) => s.isToastOpen);
  const setToastClose: () => void = useUIStore((s) => s.setToastClose);
  const toastType = useUIStore((s) => s.toastType);
  const toastMessage = useUIStore((s) => s.toastMessage);

  return (
    <StSnackbar
      key={toastMessage}
      open={!!isToastOpen}
      autoHideDuration={3000}
      onClose={setToastClose}
      slots={{ transition: TransitionUp }}
      message={
        <ToastMessageBox>
          {toastType === 'success' && <Success />}
          {toastType === 'error' && <Error />}
          {toastType === 'warning' && <Warning />}
          <ToastMessageTypo variant={'body1Light'}>{toastMessage}</ToastMessageTypo>
        </ToastMessageBox>
      }
    />
  );
};

export default GlobalToast;

const StSnackbar = styled(Snackbar)(({ theme }) => ({
  width: 'calc(100% - 40px)',
  left: '50% !important',
  transform: 'translateX(-50%) !important',
  maxWidth: '335px',

  '& .MuiPaper-root': {
    background: theme.palette.grey[700],
    borderRadius: '12px',
    padding: '11px 16px',
    height: '64px',
  },

  '& .MuiSnackbarContent-message': { padding: '0' },
}));

const ToastMessageBox = styled(AlignCenter)({
  gap: '8px',
});

const ToastMessageTypo = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  flex: '1',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
}));
