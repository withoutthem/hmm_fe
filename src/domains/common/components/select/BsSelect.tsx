import { Button, styled, Typography } from '@mui/material';
import useUIStore, { BottomSheetType } from '@domains/common/ui/store/ui.store';
import { DownIcon } from '@shared/icons/DownIcon';

const BsSelect = (props: { value: string; type: BottomSheetType }) => {
  const bottomSheetType = useUIStore((s) => s.bottomSheetType);
  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);

  const onOpen = () => {
    setBottomSheetOpen(props.type);
  };

  return (
    <BsSelectContainer onClick={onOpen} selected={bottomSheetType !== null}>
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
  boxShadow: selected ? 'inset 0 0 0 1px #1C2681' : 'none',
  padding: '0 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  height: '72px',

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
