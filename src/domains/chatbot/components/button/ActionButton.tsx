import { Button, Typography, styled } from '@mui/material';
import { Chevron } from '@shared/icons/Chevron';
import type { MouseEvent } from 'react';

interface ActionButtonProps {
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ActionButton = (props: ActionButtonProps) => {
  return (
    <StActionButton onClick={props.onClick} disabled={props.disabled ?? false}>
      <ActionButtonLabel variant={'body2'}>{props.label}</ActionButtonLabel>
      <Chevron />
    </StActionButton>
  );
};

export default ActionButton;

const StActionButton = styled(Button)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.grey[300],
  background: theme.palette.secondary.main,
  borderRadius: '8px',
  padding: '10px 20px',

  '&:active': { borderColor: theme.palette.primary.light },
  '&:disabled': {
    borderColor: theme.palette.grey[100],
    backgroundColor: theme.palette.secondary.main,

    '& > .MuiTypography-root': { color: theme.palette.grey[400] },
    '& > svg > path': { fill: theme.palette.grey[400] },
  },
}));

const ActionButtonLabel = styled(Typography)({
  flex: '1',
  textAlign: 'left',
});
