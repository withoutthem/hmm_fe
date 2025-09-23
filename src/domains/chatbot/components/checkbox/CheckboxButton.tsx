import { FormControlLabel, Checkbox, styled, Box } from '@mui/material';

interface CheckboxButtonProps {
  label: string;
  disabled?: boolean;
}

const CheckboxButton = (props: CheckboxButtonProps) => {
  return (
    <StCheckboxButton
      control={<Checkbox disabled={props.disabled ?? false} />}
      label={props.label}
    />
  );
};

export default CheckboxButton;

const StCheckboxButton = styled(FormControlLabel)(({ theme }) => ({
  background: theme.palette.grey[50],
  margin: '0',
  padding: '4px 8px',
  minHeight: '46px',
  borderRadius: '8px',
  minWidth: '52px',
  border: `1px solid ${theme.palette.grey[50]}`,
  color: theme.palette.grey[800],
  fontSize: '14px',
  lineHeight: '1.4',
  fontWeight: '500',
  justifyContent: 'center',

  '&:has(.Mui-checked)': {
    borderColor: theme.palette.primary.light,
    boxShadow: `inset 0 0 0 1px ${theme.palette.primary.light}`,
  },

  '& .MuiCheckbox-root': { display: 'none' },
}));

export const ChecoboxButtonGroup = styled(Box)({
  display: 'grid',
  gap: '8px',
  gridTemplateColumns: '1fr 1fr',
});
