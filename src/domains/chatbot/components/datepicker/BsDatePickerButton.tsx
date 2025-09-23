import { Button, Typography, styled, Drawer } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DatePickerIcon } from '@shared/icons/DatePickerIcon';
import { useState } from 'react';
import { CloseIcon } from '@shared/icons/CloseIcon';
import {
  CloseButton,
  Header,
  HeaderContainer,
} from '@domains/chatbot/components/select/components/LanguageBottomSheet';
import { Dayjs } from 'dayjs';

const BsDatePickerButton = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const onOpen = () => {
    setIsDatePickerOpen(true);
  };

  const onClose = () => {
    setIsDatePickerOpen(false);
  };

  return (
    <>
      <DatePickerButton onClick={onOpen}>
        <DatePickerTypo selectedDate={selectedDate ? 'true' : 'false'}>
          {selectedDate ? selectedDate.format('YYYY-MM-DD') : 'YYYY-MM-DD'}
        </DatePickerTypo>
        <DatePickerIcon />
      </DatePickerButton>

      <DatePickerBottomSheet anchor="bottom" open={isDatePickerOpen} onClose={onClose}>
        <HeaderContainer>
          <Header variant={'title2Bold'}>날짜 선택</Header>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </HeaderContainer>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={selectedDate}
            onChange={(newValue) => {
              if (newValue) {
                setSelectedDate(newValue); // 날짜 저장
                onClose(); // 바텀시트 닫기
              }
            }}
          />
        </LocalizationProvider>
      </DatePickerBottomSheet>
    </>
  );
};

export default BsDatePickerButton;

const DatePickerButton = styled(Button)(({ theme }) => ({
  padding: '12px 20px',
  height: '68px',
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: '8px',
  background: theme.palette.secondary.main,
}));

const DatePickerTypo = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'selectedDate',
})<{ selectedDate: string }>(({ theme, selectedDate }) => ({
  flex: '1',
  textAlign: 'left',
  fontFamily: `"Pretendard", -apple-system, "Segoe UI", Roboto, sans-serif`,
  color: selectedDate === 'true' ? theme.palette.grey[800] : theme.palette.grey[600],
}));
const DatePickerBottomSheet = styled(Drawer)({
  zIndex: '2000',

  '& .MuiPaper-root': {
    width: '100%',
    borderRadius: '24px 24px 0 0',
  },

  '& .MuiPickersToolbar-root, & .MuiDialogActions-root': { display: 'none' },
  '& .MuiPickersLayout-contentWrapper': {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  '& .MuiDayCalendar-monthContainer': { position: 'relative' },
  '& .MuiDateCalendar-root': { margin: '0' },
  '& .MuiPickersSlideTransition-root': {
    minHeight: '0px',
    height: 'auto',
    overflow: 'visible',
  },

  // '& .MuiDateCalendar-root': { background: 'pink' },
  //
  // '& .MuiPickersCalendarHeader-root': { background: 'blue' },
  //
  // '.MuiDayCalendar-header': { background: 'orange' },
  //
  // '& .MuiDayCalendar-monthContainer': { background: 'red' },
});
