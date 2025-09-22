import { Button, styled, Typography } from '@mui/material';
import type { MouseEvent } from 'react';

interface ListButtonProps {
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ListButton = (props: ListButtonProps) => {
  return (
    <StListButton onClick={props.onClick} disabled={props.disabled ?? false}>
      <ListButtonLabel variant={'body2'}>{props.label}</ListButtonLabel>
    </StListButton>
  );
};

export default ListButton;

const StListButton = styled(Button)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.grey[50],
  background: theme.palette.grey[50],
  borderRadius: '8px',
  padding: '10px 20px',

  '&:active': {
    borderColor: theme.palette.primary.light,
    boxShadow: `inset 0 0 0 1px ${theme.palette.primary.light}`,
  },
  '&:disabled': {
    backgroundColor: theme.palette.grey[200],

    '& > .MuiTypography-root': { color: theme.palette.grey[400] },
  },
}));

const ListButtonLabel = styled(Typography)({
  flex: '1',
  textAlign: 'left',
});
