import { Input, styled, InputAdornment, IconButton } from '@mui/material';
import { ClearIcon } from '@shared/icons/ClearIcon';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, ControllerRenderProps, Path } from 'react-hook-form';
import { useState } from 'react';

type BasicInputProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  type?: string;
  error?: boolean;
  disabled?: boolean;
};

const BasicInput = <T extends FieldValues>(props: BasicInputProps<T>) => {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <StInput
          error={props.error ?? false}
          disabled={props.disabled ?? false}
          {...field}
          placeholder={props.placeholder ?? '입력하세요'}
          type={props.type ?? 'text'}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
            field.onBlur?.();
          }}
          endAdornment={
            field.value &&
            focused && (
              <StInputAdornment position="end">
                <ClearIconButton
                  tabIndex={-1} // 포커스 뺏기지 않게
                  onMouseDown={(e) => e.preventDefault()} // 포커스 유지
                  onClick={() => field.onChange('')}
                >
                  <ClearIcon />
                </ClearIconButton>
              </StInputAdornment>
            )
          }
        />
      )}
    />
  );
};

export default BasicInput;

const StInput = styled(Input)(({ theme }) => ({
  border: '1px solid',
  padding: '0 20px',
  borderRadius: '8px',
  borderColor: theme.palette.grey[200],
  height: '72px',

  '&:before, &:after': { display: 'none' },
  '& .MuiInputBase-input': {
    padding: 0,
    textOverflow: 'ellipsis',
    color: theme.palette.grey[800],
    fontSize: '17px',
    fontWeight: 500,
  },
  '& .MuiInputBase-input:placeholder': { color: theme.palette.grey[600] },

  '&.Mui-focused': {
    borderColor: theme.palette.primary.light,
    boxShadow: `inset 0 0 0 1px ${theme.palette.primary.light}`,

    '& .MuiInputAdornment-root': { display: 'flex' },
  },
  '&.Mui-error': {
    backgroundColor: '#FCEEEE',
    borderColor: '#FF0000',
  },
  '&.Mui-disabled': {
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[200],
  },
}));

const StInputAdornment = styled(InputAdornment)({
  marginLeft: '0',
});

const ClearIconButton = styled(IconButton)({
  width: '20px',
  height: '20px',
  padding: 0,
});
