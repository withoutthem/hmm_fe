import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { type SyntheticEvent, useState } from 'react';
import BsSelect from '@domains/chatbot/components/select/BsSelect';
import useUIStore, {
  BottomSheetType,
  ModalType,
  SelectBottomSheetType,
} from '@domains/common/ui/store/ui.store';
import useUserStore from '@domains/user/store/user.store';
import BasicInput from '@domains/chatbot/components/input/BasicInput';
import { useForm } from 'react-hook-form';
import ActionButton from '@domains/chatbot/components/button/ActionButton';
import ListButton from '@domains/chatbot/components/button/ListButton';
import TextButton from '@domains/chatbot/components/button/TextButton';
import CheckboxButton, {
  ChecoboxButtonGroup,
} from '@domains/chatbot/components/checkbox/CheckboxButton';
import { ClipBackground } from '@domains/chatbot/components/text/ClipBackground';
import BsDatePickerButton from '@domains/chatbot/components/datepicker/BsDatePickerButton';
import StDatePicker from '@domains/chatbot/components/datepicker/StDatePicker';

const PublishFloating = () => {
  const options = ['가나다', '나다라', '마바사', '아자'];
  const [tabValue, setTabValue] = useState(0);
  const globalLocale = useUserStore((s) => s.globalLocale);
  const { control } = useForm();
  const setToastOpen = useUIStore((s) => s.setToastOpen);
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);

  const onTabValueChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onToastClick = (type?: 'success' | 'error' | 'warning' | undefined) => {
    if (type) {
      setToastOpen(
        '토스트 메세지가 길어지면 길이는 자연스럽게 내려올건데 2줄이 넘으면 ... 처리를 해야합니다 텍스트의 최대는 두 줄 까지만 사용합니다.',
        type
      );
    } else if (type === undefined) {
      setToastOpen('토스트 메시지입니다');
    }
  };

  const onModalClick = (modalContentType: ModalType | null) => {
    setModalOpen?.(modalContentType);
  };

  const onBottomSheetOpen = () => {
    setBottomSheetOpen(BottomSheetType.QUOTATION);
  };

  return (
    <StPublishFloating id={'publish'}>
      <PublushButton
        onClick={() => {
          const el = document.getElementById('publish');
          if (el) {
            el.style.display = 'none';
          }
        }}
      >
        X
      </PublushButton>

      <StPublishContainer>
        <TestBubble>
          <Typography variant={'subtitle2Bold'}>ButtonGroup + Button</Typography>
          <ButtonGroup variant={'symmetry'}>
            <Button variant={'secondary'} disabled>
              다음
            </Button>
            <Button variant={'primary'} disabled>
              확인
            </Button>
          </ButtonGroup>

          <TestCodeBox>
            {`
            <ButtonGroup variant={'symmetry'}>
              <Button variant={'secondary'} disabled>
                다음
              </Button>
              <Button variant={'primary'} disabled>
                확인
              </Button>
            </ButtonGroup>
            `}
          </TestCodeBox>

          <ButtonGroup variant={'asymmetry'}>
            <Button variant={'secondary'}>다음</Button>
            <Button variant={'primary'}>확인</Button>
          </ButtonGroup>

          <TestCodeBox>
            {`
            <ButtonGroup variant={'asymmetry'}>
              <Button variant={'secondary'}>다음</Button>
              <Button variant={'primary'}>확인</Button>
            </ButtonGroup>
            `}
          </TestCodeBox>

          <ButtonGroup variant={'column'}>
            <Button variant={'primary'}>Button</Button>
            <Button variant={'secondary'}>Button</Button>
          </ButtonGroup>

          <TestCodeBox>
            {`
            <ButtonGroup variant={'column'}>
              <Button variant={'primary'}>Button</Button>
              <Button variant={'secondary'}>Button</Button>
            </ButtonGroup>
            `}
          </TestCodeBox>

          <ButtonGroup variant={'symmetry'}>
            <Button variant={'borderS'}>버튼</Button>
            <Button variant={'borderS'} disabled>
              버튼
            </Button>
          </ButtonGroup>
          <ButtonGroup variant={'symmetry'}>
            <Button variant={'borderM'}>버튼</Button>
            <Button variant={'borderM'} disabled>
              버튼
            </Button>
          </ButtonGroup>
          <TestCodeBox>
            {`
            <ButtonGroup variant={'symmetry'}>
              <Button variant={'borderS'}>버튼</Button>
              <Button variant={'borderS'} disabled>
                버튼
              </Button>
            </ButtonGroup>
            <ButtonGroup variant={'symmetry'}>
              <Button variant={'borderM'}>버튼</Button>
              <Button variant={'borderM'} disabled>
                버튼
              </Button>
            </ButtonGroup>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>Autocomplete</Typography>
          <Autocomplete
            disablePortal
            id="autocomplete-example"
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                // placeholder={'언어를 알려주세요.'}
                label="Choose an option"
                size="small"
                fullWidth
                InputLabelProps={{ className: '' }}
              />
            )}
          />
          <Autocomplete
            disablePortal
            id="autocomplete-example"
            options={options}
            disabled
            renderInput={(params) => (
              <TextField
                {...params}
                // placeholder={'언어를 알려주세요.'}
                label="Choose an option"
                size="small"
                fullWidth
                InputLabelProps={{ className: '' }}
              />
            )}
          />
          <TestCodeBox>
            {`
            <Autocomplete
            disablePortal
            id="autocomplete-example"
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose an option"
                size="small"
                fullWidth
                InputLabelProps={{ className: '' }}
              />
            )}
          />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>ClipBackground</Typography>

          <ClipBackground>변하는 글씨 만들기</ClipBackground>
          <TestCodeBox>
            {`
            <ClipBackground>변하는 글씨 만들기</ClipBackground>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>Tabs + Tab</Typography>

          <Tabs value={tabValue} onChange={onTabValueChange}>
            <Tab value={0} label={'첫번째'} />
            <Tab value={1} label={'두번째'} />
            <Tab value={2} label={'세번째'} />
          </Tabs>
          <TestCodeBox>
            {`
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab value={0} label={'첫번째'} />
              <Tab value={1} label={'두번째'} />
              <Tab value={2} label={'세번째'} />
            </Tabs>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>BsSelect</Typography>

          <BsSelect value={globalLocale} type={SelectBottomSheetType.LANGUAGE} />
          <BsSelect value={globalLocale} type={SelectBottomSheetType.LANGUAGE} disabled />
          <TestCodeBox>
            {`
            <BsSelect value={globalLocale} type={SelectBottomSheetType.LANGUAGE} />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>BasicInput</Typography>

          <BasicInput
            control={control}
            name={'email'}
            placeholder={'이메일을 입력해 주세요.'}
            type={'email'}
          />
          <BasicInput
            control={control}
            name={'email'}
            placeholder={'이메일을 입력해 주세요.'}
            type={'email'}
            error
          />
          <BasicInput
            control={control}
            name={'email'}
            placeholder={'이메일을 입력해 주세요.'}
            type={'email'}
            disabled
          />
          <TestCodeBox>
            {`
            <BasicInput
              control={control}
              name={'email'}
              placeholder={'이메일을 입력해 주세요.'}
              type={'email'}
            />
            <BasicInput
              control={control}
              name={'email'}
              placeholder={'이메일을 입력해 주세요.'}
              type={'email'}
              error
            />
            <BasicInput
              control={control}
              name={'email'}
              placeholder={'이메일을 입력해 주세요.'}
              type={'email'}
              disabled
            />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>ActionButton</Typography>

          <ActionButton label={'헬로'} />
          <ActionButton label={'헬로'} disabled />

          <TestCodeBox>
            {`
            <ActionButton label={'헬로'} />
            <ActionButton label={'헬로'} disabled />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>ListButton</Typography>

          <ListButton label={'헬로'} />
          <ListButton label={'헬로'} disabled />
          <TestCodeBox>
            {`
            <ListButton label={'헬로'} />
            <ListButton label={'헬로'} disabled />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>TextButton</Typography>

          <TextButton label={'내 정보 기억하기'} />
          <TextButton label={'내 정보 기억하기'} accent />
          <TestCodeBox>
            {`
            <TextButton label={'내 정보 기억하기'} />
            <TextButton label={'내 정보 기억하기'} accent />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>ChecoboxButtonGroup + CheckboxButton</Typography>

          <ChecoboxButtonGroup>
            <CheckboxButton label={'메뉴명'} />
            <CheckboxButton label={'메뉴명'} disabled />
            <CheckboxButton label={'메뉴명'} />
            <CheckboxButton label={'메뉴명'} />
          </ChecoboxButtonGroup>
          <TestCodeBox>
            {`
            <ChecoboxButtonGroup>
              <CheckboxButton label={'메뉴명'} />
              <CheckboxButton label={'메뉴명'} disabled />
              <CheckboxButton label={'메뉴명'} />
              <CheckboxButton label={'메뉴명'} />
            </ChecoboxButtonGroup>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>Toast</Typography>

          <Button onClick={() => onToastClick()} variant={'primary'}>
            누르면 길이 긴 토스트
          </Button>
          <Button onClick={() => onToastClick('error')} variant={'primary'}>
            error 토스트
          </Button>
          <Button onClick={() => onToastClick('success')} variant={'primary'}>
            success 토스트
          </Button>
          <Button onClick={() => onToastClick('warning')} variant={'primary'}>
            warning 토스트
          </Button>
          <TestCodeBox>
            {`
            <Button onClick={() => onToastClick()} variant={'primary'}>
              누르면 길이 긴 토스트
            </Button>
            <Button onClick={() => onToastClick('error')} variant={'primary'}>
              error 토스트
            </Button>
            <Button onClick={() => onToastClick('success')} variant={'primary'}>
              success 토스트
            </Button>
            <Button onClick={() => onToastClick('warning')} variant={'primary'}>
              warning 토스트
            </Button>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>Modal</Typography>

          <Button onClick={() => onModalClick(ModalType.TESTALERT)} variant={'primary'}>
            Alert 열기(TESTALERT)
          </Button>
          <Button onClick={() => onModalClick(ModalType.TESTCONFIRM)} variant={'primary'}>
            Confirm 열기(TESTCONFIRM)
          </Button>
          <Button onClick={() => onModalClick(ModalType.TESTHEADERCONFIRM)} variant={'primary'}>
            Header Confirm 열기(TESTHEADERCONFIRM)
          </Button>

          <TestCodeBox>
            {`
            <Button onClick={() => onModalClick(ModalType.TESTALERT)} variant={'primary'}>
              Alert 열기(TESTALERT)
            </Button>
            <Button onClick={() => onModalClick(ModalType.TESTCONFIRM)} variant={'primary'}>
              Confirm 열기(TESTCONFIRM)
            </Button>
            <Button onClick={() => onModalClick(ModalType.TESTHEADERCONFIRM)} variant={'primary'}>
              Header Confirm 열기(TESTHEADERCONFIRM)
            </Button>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>StDatePickerButton</Typography>

          <BsDatePickerButton />

          <TestCodeBox>
            {`
            <BsDatePickerButton />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>StDatePicker</Typography>

          <StDatePicker />

          <TestCodeBox>
            {`
            <StDatePicker />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Typography variant={'subtitle2Bold'}>GlobalBottomSheet</Typography>

          <Button variant={'primary'} onClick={onBottomSheetOpen}>
            BottomSheet 열기
          </Button>
        </TestBubble>

        <TestBubble>
          <div style={{ height: '500px' }} />
        </TestBubble>
      </StPublishContainer>
    </StPublishFloating>
  );
};

export default PublishFloating;

export const PublushButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  top: '10px',
  right: '10px',
  background: theme.palette.primary.dark, // theme 바로 사용
  padding: '5px 10px',
  height: 'auto',
  color: '#fff',
  zIndex: 1000,
}));

const StPublishFloating = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  overflowY: 'auto',
  background: '#fff',
  display: 'none',
  zIndex: 999,
});

const StPublishContainer = styled(Box)({
  width: '100%',
  height: '100%',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const TestBubble = styled(Box)({
  background: '#fff',
  borderRadius: '12px',
  border: '1px solid',
  padding: '16px',
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const TestCodeBox = styled('pre')({
  borderRadius: '8px',
  border: '1px dashed',
  padding: '8px',
  background: '#f8f9fa',
  fontFamily: 'monospace',
  fontSize: '13px',
  lineHeight: 1.4,
  margin: 0,
  whiteSpace: 'pre-wrap', // 줄바꿈 반영
});
