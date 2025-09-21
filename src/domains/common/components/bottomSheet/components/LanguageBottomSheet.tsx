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
import SelectCheckIcon from '@assets/img/icon/ic_select_check.svg';
import useUserStore from '@domains/user/store/user.store';
import useUIStore from '@domains/common/ui/store/ui.store';

const LanguageBottomSheet = () => {
  const globalLocale = useUserStore((s) => s.globalLocale);
  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);
  const setGlobalLocale = useUserStore((s) => s.setGlobalLocale);

  return (
    <BottomSheetContainer>
      <HeaderContainer>
        <Header variant={'title2Bold'}>사용할 언어 선택</Header>
        <CloseButton onClick={() => setBottomSheetOpen(null)}>
          <CloseIcon />
        </CloseButton>
      </HeaderContainer>
      <BottonSheetContent>
        <StRadioGroup value={globalLocale} onChange={(e) => setGlobalLocale(e.target.value)}>
          <RadioFormLabel value="ko-KR" control={<Radio />} label="한국어" />
          <RadioFormLabel value="en-US" control={<Radio />} label="영어" />
          <RadioFormLabel value="cn" control={<Radio />} label="중국어" />
          <RadioFormLabel value="de" control={<Radio />} label="일본어" />
          <RadioFormLabel value="zh" control={<Radio />} label="힌디어" />
          <RadioFormLabel value="hi" control={<Radio />} label="스페인어" />
          <RadioFormLabel value="es" control={<Radio />} label="프랑스어" />
          <RadioFormLabel value="fr" control={<Radio />} label="포르투갈어" />
          <RadioFormLabel value="pt" control={<Radio />} label="러시아어" />
          <RadioFormLabel value="ru" control={<Radio />} label="인도네시아어" />
          <RadioFormLabel value="id" control={<Radio />} label="독일어" />
          <RadioFormLabel value="ja" control={<Radio />} label="베트남어" />
          <RadioFormLabel value="vi" control={<Radio />} label="튀르키예어" />
          <RadioFormLabel value="tr" control={<Radio />} label="이탈리아어" />
          <RadioFormLabel value="it" control={<Radio />} label="태국어" />
          <RadioFormLabel value="th" control={<Radio />} label="네덜란드어" />
          <RadioFormLabel value="nl" control={<Radio />} label="말레이시아어" />
        </StRadioGroup>
      </BottonSheetContent>
    </BottomSheetContainer>
  );
};

export default LanguageBottomSheet;

const BottomSheetContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  flex: '1',
});

const HeaderContainer = styled(FlexBox)({
  padding: '30px 20px 0 20px',
});

const Header = styled(Typography)({
  flex: '1',
});

const CloseButton = styled(IconButton)({
  padding: 0,
  width: '28px',
  height: '28px',
});

const BottonSheetContent = styled(Box)({
  flex: '1',
  padding: '16px 0',
  overflowY: 'hidden',
});

const StRadioGroup = styled(RadioGroup)({
  height: '100%',
  width: '100%',
  flexWrap: 'nowrap',
  overflowY: 'auto',
});

const RadioFormLabel = styled(FormControlLabel)({
  margin: '0',
  padding: '16px 20px',

  '& .MuiButtonBase-root': { display: 'none' },
  '& .MuiButtonBase-root.Mui-checked': {
    '& + .MuiTypography-root:after': {
      content: '""',
      width: '24px',
      height: '24px',
      background: `url("${SelectCheckIcon}") no-repeat center/contain`,
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      right: '0',
      transform: 'translateY(-50%)',
    },
  },
  '& .MuiTypography-root': {
    width: '100%',
    paddingRight: '24px',
    fontWeight: '600',
    position: 'relative',
    padding: '2px 0',
    fontSize: '16px',
  },
});
