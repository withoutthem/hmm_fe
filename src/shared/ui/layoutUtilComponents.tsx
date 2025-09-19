import { Box, styled } from '@mui/material';

export const AlignCenter = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

export const CenterBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const FlexBox = styled(Box)({
  display: 'flex',
});

export const ColumnBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});
