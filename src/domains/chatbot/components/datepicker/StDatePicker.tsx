import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Box, styled } from '@mui/material';
import DatePickerIcon from '@assets/img/icon/ic_datepicker.svg';

const StDatePicker = () => {
  const [value, setValue] = useState<Dayjs | null>(null);

  return (
    <DatePickerWrap>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="날짜 선택"
          format="YYYY-MM-DD"
          value={value !== null ? dayjs(value) : null}
          onChange={(newValue) => setValue(newValue)}
        />
      </LocalizationProvider>
    </DatePickerWrap>
  );
};

export default StDatePicker;

const DatePickerWrap = styled(Box)(({ theme }) => ({
  display: 'flex',

  '& .MuiFormControl-root': { flex: '1', height: '68px' },

  '& .MuiFormLabel-root': { display: 'none' },

  '& fieldset': { top: '-2px', height: '68px', borderRadius: '8px', borderColor: '#DEE2E6' },

  '& legend': { display: 'none' },

  '& .MuiPickersInputBase-root': { padding: '12px 20px', height: '68px' },

  '& .MuiPickersSectionList-root': {
    opacity: 1,
    padding: '0',
    marginBottom: '2px',
  },

  '& .MuiPickersSectionList-sectionContent.MuiPickersInputBase-sectionContent': {
    color: '#6D747B',
    fontFamily: `"Pretendard", -apple-system, "Segoe UI", Roboto, sans-serif !important`,
  },
  '& .MuiPickersSectionList-sectionContent.MuiPickersInputBase-sectionContent[aria-valuenow]': {
    color: '#343A40',
  },

  '& .MuiPickersInputBase-root.Mui-focused fieldset': { borderColor: '#1C2681 !important' },

  '& .MuiInputAdornment-root': {
    margin: '0 0 2px',
    maxHeight: '20px',
    width: '20px',
  },
  '& .MuiIconButton-edgeEnd': {
    padding: '0',
    width: '20px',
    height: '20px',
    borderRadius: '0',
    background: `url("${DatePickerIcon}") no-repeat center/contain`,
    backgroundSize: '20px 20px',

    '& > svg': { display: 'none' },
  },
}));
