import {
  Box,
  RadioGroup,
  FormControlLabel,
  IconButton,
  styled,
  Radio,
  Typography,
} from '@mui/material';
import { FlexBox } from '@shared/ui/layoutUtilComponents';
import { CloseIcon } from '@shared/icons/CloseIcon';
import { useState } from 'react';

const LanguageBottomSheet = () => {
  const [selectedValue, setSelectedValue] = useState('ko');

  return (
    <BottomSheetContainer>
      <HeaderContainer>
        <Header variant={'title2Bold'}>타이틀을 입력하세요</Header>
        <CloseButton>
          <CloseIcon />
        </CloseButton>
      </HeaderContainer>
      <BottonSheetContent>
        <RadioGroup value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
          <FormControlLabel
            sx={{ background: 'yellow' }}
            value="ko"
            control={<Radio />}
            label="한국어"
          />
          <FormControlLabel value="en" control={<Radio />} label="English" />
          <FormControlLabel value="jp" control={<Radio />} label="日本語" />
        </RadioGroup>
      </BottonSheetContent>
    </BottomSheetContainer>
  );
};

export default LanguageBottomSheet;

const BottomSheetContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  flex: '1',
  background: 'yellow',
});

const HeaderContainer = styled(FlexBox)({
  padding: '30px 20px 0 20px',
  background: 'red',
});

const Header = styled(Typography)({
  flex: '1',
});

const CloseButton = styled(IconButton)({
  padding: 0,
  background: 'orange',
});

const BottonSheetContent = styled(Box)({
  flex: '1',
  padding: '16px 0',
  background: 'blue',
});
