import { Box, ButtonGroup, styled, Typography } from '@mui/material';

export const ModalBox = styled(Box)(({ theme }) => ({
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

export const ModalContentWrap = styled(Box)({
  padding: '20px 20px 16px 20px',
});

export const ModalContent = styled(Box)({
  minHeight: '36px',
  display: 'flex',
  flexDirection: 'column',
});

export const ModalButtonGroup = styled(ButtonGroup)({
  padding: '0 16px 16px 16px',
});

export const ModalText = styled(Typography)({
  marginTop: '12px',
  marginBottom: '8px',
});
