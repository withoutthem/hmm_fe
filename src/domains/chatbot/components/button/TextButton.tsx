import { Button, styled, Typography } from '@mui/material';

interface TextButtonProps {
  label: string;
  accent?: boolean;
}

const TextButton = (props: TextButtonProps) => {
  return (
    <StTextButton accent={props.accent ?? false}>
      <TextButtonLabel accent={props.accent ?? false} variant={'body2Bold'}>
        {props.label}
      </TextButtonLabel>
    </StTextButton>
  );
};

export default TextButton;

const StTextButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'accent',
})<{ accent: boolean }>(({ theme, accent }) => ({
  padding: 0,
  height: 'auto',
  minWidth: 0,
  width: 'fit-content',
  borderRadius: 0,
  position: 'relative',

  '&:after': {
    content: '""',
    width: '100%',
    height: '1px',
    background: accent ? theme.palette.primary.light : theme.palette.grey[700],
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
}));

const TextButtonLabel = styled(Typography, { shouldForwardProp: (prop) => prop !== 'accent' })<{
  accent: boolean;
}>(({ theme, accent }) => ({
  color: accent ? theme.palette.primary.light : theme.palette.grey[700],
}));
