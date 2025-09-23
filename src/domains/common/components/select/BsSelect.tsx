import { Button, styled, Typography } from '@mui/material';
import useUIStore, { BottomSheetType } from '@domains/common/ui/store/ui.store';
import { DownIcon } from '@shared/icons/DownIcon';

interface BsSelectProps {
  value: string;
  type: BottomSheetType;
  disabled?: boolean;
}

const BsSelect = (props: BsSelectProps) => {
  const bottomSheetType = useUIStore((s) => s.bottomSheetType);
  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);

  const onOpen = () => {
    setBottomSheetOpen(props.type);
  };

  return (
    <BsSelectContainer
      onClick={onOpen}
      selected={bottomSheetType !== null}
      disabled={props.disabled ?? false}
    >
      <BsSelectLabel
        sx={{ flex: '1' }}
        variant={'subtitle2Light'}
        selected={bottomSheetType !== null}
      >
        {props.value}
      </BsSelectLabel>
      <DownIcon />
    </BsSelectContainer>
  );
};

export default BsSelect;

const BsSelectContainer = styled(Button)<{ selected: boolean }>(({ theme, selected }) => ({
  border: '1px solid',
  borderColor: selected ? theme.palette.primary.light : theme.palette.grey[200],
  boxShadow: selected ? `inset 0 0 0 1px ${theme.palette.primary.light}` : 'none',
  padding: '12px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  height: '68px',

  '&:disabled': {
    background: theme.palette.grey[200],
    borderColor: theme.palette.grey[400],

    '& .MuiTypography-root': {
      color: theme.palette.grey[400],
    },
  },
}));

const BsSelectLabel = styled(Typography)<{ selected: boolean }>(({ theme, selected }) => ({
  color: selected ? theme.palette.grey[800] : theme.palette.grey[500],
  textAlign: 'left',
}));
