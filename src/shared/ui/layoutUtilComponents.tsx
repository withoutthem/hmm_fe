import { Box, type BoxProps, styled } from '@mui/material';
import type { StyledComponent } from '@emotion/styled';

export const AlignCenter: StyledComponent<BoxProps> = styled(Box)({
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
