import { Button, Drawer, styled, Typography } from '@mui/material';
import { SelectBottomSheetType } from '@domains/common/ui/store/ui.store';
import { DownIcon } from '@shared/icons/DownIcon';
import LanguageBottomSheet from '@domains/chatbot/components/select/components/LanguageBottomSheet';
import { useState } from 'react';

interface BsSelectProps {
  value: string;
  type: SelectBottomSheetType;
  disabled?: boolean;
}

const BsSelect = (props: BsSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BsSelectContainer onClick={onOpen} selected={isOpen} disabled={props.disabled ?? false}>
        <BsSelectLabel sx={{ flex: '1' }} variant={'subtitle2Light'} selected={isOpen}>
          {props.value}
        </BsSelectLabel>
        <DownIcon />
      </BsSelectContainer>

      <SelectBottomSheet anchor="bottom" open={isOpen} onClose={onClose}>
        {props.type === SelectBottomSheetType.LANGUAGE && <LanguageBottomSheet onClose={onClose} />}
      </SelectBottomSheet>
    </>
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

  '& .MuiTypography-root': { color: theme.palette.grey[800] },

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

const SelectBottomSheet = styled(Drawer)({
  zIndex: '2000',

  '& .MuiPaper-root': {
    width: '100%',
    minHeight: '80vh',
    maxHeight: '80vh',
    height: '80vh',
    borderRadius: '24px 24px 0 0',
  },
});
