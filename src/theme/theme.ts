// src/styles/theme.ts
import { createTheme } from '@mui/material/styles';
import type { CSSProperties } from 'react';
import DownIcon from '@assets/img/icon/ic_down.svg';
import ClearIcon from '@assets/img/icon/ic_clear.svg';

declare module '@mui/material/styles' {
  interface Palette {
    border: {
      primary: string;
      secondary: string;
      focused: string;
    };
    backgroundCustom: {
      primary: string;
      secondary: string;
      scrim: string;
    };
  }

  interface PaletteOptions {
    border?: {
      primary: string;
      secondary: string;
      focused: string;
    };
    backgroundCustom?: {
      primary: string;
      secondary: string;
      scrim: string;
    };
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    display1Bold: CSSProperties;
    display1: CSSProperties;
    display2Bold: CSSProperties;
    display2: CSSProperties;
    title1Bold: CSSProperties;
    title1: CSSProperties;
    title2Bold: CSSProperties;
    title2: CSSProperties;
    subtitle1Bold: CSSProperties;
    subtitle1: CSSProperties;
    subtitle1Light: CSSProperties;
    subtitle2Bold: CSSProperties;
    subtitle2: CSSProperties;
    subtitle2Light: CSSProperties;
    subtitle3Bold: CSSProperties;
    subtitle3: CSSProperties;
    subtitle3Light: CSSProperties;
    body1Bold: CSSProperties;
    body1: CSSProperties;
    body1Light: CSSProperties;
    body2Bold: CSSProperties;
    body2: CSSProperties;
    body2Light: CSSProperties;
    body3Bold: CSSProperties;
    body3: CSSProperties;
    body3Light: CSSProperties;
    caption1Bold: CSSProperties;
    caption1: CSSProperties;
    caption1Light: CSSProperties;
    caption2Bold: CSSProperties;
    caption2: CSSProperties;
    caption2Light: CSSProperties;
  }

  interface TypographyVariantsOptions {
    display1Bold?: CSSProperties;
    display1?: CSSProperties;
    display2Bold?: CSSProperties;
    display2?: CSSProperties;
    title1Bold?: CSSProperties;
    title1?: CSSProperties;
    title2Bold?: CSSProperties;
    title2?: CSSProperties;
    subtitle1Bold?: CSSProperties;
    subtitle1?: CSSProperties;
    subtitle1Light?: CSSProperties;
    subtitle2Bold?: CSSProperties;
    subtitle2?: CSSProperties;
    subtitle2Light?: CSSProperties;
    subtitle3Bold?: CSSProperties;
    subtitle3?: CSSProperties;
    subtitle3Light?: CSSProperties;
    body1Bold?: CSSProperties;
    body1?: CSSProperties;
    body1Light?: CSSProperties;
    body2Bold?: CSSProperties;
    body2?: CSSProperties;
    body2Light?: CSSProperties;
    body3Bold?: CSSProperties;
    body3?: CSSProperties;
    body3Light?: CSSProperties;
    caption1Bold?: CSSProperties;
    caption1?: CSSProperties;
    caption1Light?: CSSProperties;
    caption2Bold?: CSSProperties;
    caption2?: CSSProperties;
    caption2Light?: CSSProperties;
  }
}

// 2. TypographyPropsVariantOverrides 확장
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1Bold: true;
    h2Bold: true;
    h3Bold: true;
    h4Bold: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    borderS: true;
    borderM: true;
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsVariantOverrides {
    symmetry: true;
    asymmetry: true;
    column: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    // 색상 관련
    secondary: true;
    tertiary: true;
    quaternary: true;
    disabled: true;

    // Display
    display1Bold: true;
    display1: true;
    display2Bold: true;
    display2: true;

    // Title
    title1Bold: true;
    title1: true;
    title2Bold: true;
    title2: true;

    // Subtitle
    subtitle1Bold: true;
    subtitle1: true;
    subtitle1Light: true;
    subtitle2Bold: true;
    subtitle2: true;
    subtitle2Light: true;
    subtitle3Bold: true;
    subtitle3: true;
    subtitle3Light: true;

    // Body
    body1Bold: true;
    body1: true;
    body1Light: true;
    body2Bold: true;
    body2: true;
    body2Light: true;
    body3Bold: true;
    body3: true;
    body3Light: true;

    // Caption
    caption1Bold: true;
    caption1: true;
    caption1Light: true;
    caption2Bold: true;
    caption2: true;
    caption2Light: true;
  }
}

const theme = createTheme({
  // 1. 색상, 타이포그래피 등 디자인 토큰 정의
  palette: {
    primary: {
      main: '#20265B', //HMM 브랜드 컬러1
      light: '#1C2681', //HMM 브랜드 컬러2
      dark: '#EE312F', //HMM 브랜드 컬러3
      contrastText: '#232B33', //HMM 브랜드 컬러4
    },
    //Mono Tone &
    secondary: {
      main: '#FFFFFF', // 모노톤 컬러1
      dark: '#000000', // 모노톤 컬러2
      light: '#49519A', // 시멘틱 컬러3
      contrastText: '#777DB3', // 시멘틱 컬러4
    },
    backgroundCustom: {
      primary: '#FFFFFF', // Background Primary + Elevated
      secondary: '#F1F3F5',
      scrim: '#0000008C',
    },
    // ✅ border 전용
    border: {
      primary: '#DEE2E6',
      secondary: '#F1F3F5',
      focused: '#495057',
    },

    grey: {
      50: '#F8F9FA', // 그레이1
      100: '#F1F3F5', // 그레이2
      200: '#E9ECEF', // 그레이3
      300: '#DEE2E6', // 그레이4
      400: '#B2BBC3', // 그레이5
      500: '#878F96', // 그레이6
      600: '#6D747B', // 그레이7
      700: '#495057', // 그레이8
      800: '#343A40', // 그레이9
      900: '#212528', // 그레이10
    },
  },
  typography: {
    display1Bold: { fontSize: '29px', fontWeight: 700 }, // Bold
    display1: { fontSize: '29px', fontWeight: 600 }, // SemiBold
    display2Bold: { fontSize: '24px', fontWeight: 700 }, // Bold
    display2: { fontSize: '24px', fontWeight: 600 }, // SemiBold

    title1Bold: { fontSize: '22px', fontWeight: 700 }, // Bold
    title1: { fontSize: '22px', fontWeight: 600 }, // SemiBold
    title2Bold: { fontSize: '20px', fontWeight: 700 }, // Bold
    title2: { fontSize: '20px', fontWeight: 600 }, // SemiBold

    subtitle1Bold: { fontSize: '18px', fontWeight: 700 }, // Bold
    subtitle1: { fontSize: '18px', fontWeight: 600 }, // SemiBold
    subtitle1Light: { fontSize: '18px', fontWeight: 500 }, //Medium
    subtitle2Bold: { fontSize: '17px', fontWeight: 700 }, // Bold
    subtitle2: { fontSize: '17px', fontWeight: 600 }, // SemiBold
    subtitle2Light: { fontSize: '17px', fontWeight: 500 }, //Medium
    subtitle3Bold: { fontSize: '16px', fontWeight: 700 }, // Bold
    subtitle3: { fontSize: '16px', fontWeight: 600 }, // SemiBold
    subtitle3Light: { fontSize: '16px', fontWeight: 500 }, //Medium

    body1Bold: { fontSize: '15px', fontWeight: 600 }, // SemiBold
    body1: { fontSize: '15px', fontWeight: 500 }, //Medium
    body1Light: { fontSize: '15px', fontWeight: 400 }, //Regular
    body2Bold: { fontSize: '14px', fontWeight: 600 }, // SemiBold
    body2: { fontSize: '14px', fontWeight: 500 }, //Medium
    body2Light: { fontSize: '14px', fontWeight: 400 }, //Regular
    body3Bold: { fontSize: '13px', fontWeight: 600 }, // SemiBold
    body3: { fontSize: '13px', fontWeight: 500 }, //Medium
    body3Light: { fontSize: '13px', fontWeight: 400 }, //Regular

    caption1Bold: { fontSize: '12px', fontWeight: 600 }, // SemiBold
    caption1: { fontSize: '12px', fontWeight: 500 }, //Medium
    caption1Light: { fontSize: '12px', fontWeight: 400 }, //Regular
    caption2Bold: { fontSize: '11px', fontWeight: 600 }, // SemiBold
    caption2: { fontSize: '11px', fontWeight: 500 }, //Medium
    caption2Light: { fontSize: '11px', fontWeight: 400 }, //Regular
    // button: {
    //   textTransform: 'none',
    // },
  },

  // 2. 컴포넌트 기본 동작 및 스타일 오버라이드
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          fontFamily: `"Pretendard", -apple-system, "Segoe UI", Roboto, sans-serif`,
          boxSizing: 'border-box',
          margin: '0px',
          padding: '0px',
        },
        p: {
          margin: '0px',
          padding: '0px',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '13.5px',
          height: '48px',
          fontSize: '15px',
          lineHeight: '1.4',
          fontWeight: 600,
          minWidth: '58px',
        },
      },
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            backgroundColor: '#1C2681',
            color: '#FFFFFF',
            '&&:active ': { backgroundColor: 'linear-gradient(#00000040, #00000040), #1C2681' },
            '&:disabled': { color: '#797D9D' },
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            backgroundColor: '#E9ECEF',
            color: '#495057',
            '&:active ': { backgroundColor: 'linear-gradient(#0000001A, #0000001A), #E9ECEF' },
            '&:disabled': { color: '#B2BBC3' },
          },
        },
        {
          props: { variant: 'borderS' },
          style: {
            backgroundColor: '#FFFFFF',
            border: '1px solid #DEE2E6',
            color: '#343A40',
            minWidth: '76px',
            height: 'auto',
            padding: '9.5px 20px',
            '&:active ': { backgroundColor: '#F1F3F5', borderColor: '#DEE2E6' },
            '&:disabled': { background: '#E9ECEF', borderColor: '#DEE2E6', color: '#B2BBC3' },
          },
        },
        {
          props: { variant: 'borderM' },
          style: {
            backgroundColor: '#FFFFFF',
            border: '1px solid #DEE2E6',
            height: 'auto',
            color: '#343A40',
            minWidth: '89px',
            padding: '12px 22px',
            fontSize: '17px',
            '&:active ': { backgroundColor: '#F1F3F5', borderColor: '#DEE2E6' },
            '&:disabled': { background: '#E9ECEF', borderColor: '#DEE2E6', color: '#B2BBC3' },
          },
        },
      ],
    },

    MuiButtonGroup: {
      styleOverrides: {
        root: {
          display: 'flex',
          width: '100%',
          borderRadius: 0,

          '& button.MuiButtonGroup-firstButton, & button.MuiButtonGroup-lastButton': {
            borderRadius: '12px',
          },
        },
      },
      variants: [
        {
          props: { variant: 'symmetry' },
          style: {
            gap: '9px',

            '& button': {
              flex: 1,
            },
          },
        },
        {
          props: { variant: 'asymmetry' },
          style: {
            gap: '8px',

            '& button.MuiButtonGroup-firstButton': { width: '35%' },
            '& button.MuiButtonGroup-lastButton': { width: '65%' },
          },
        },
        {
          props: {
            variant: 'column',
          },
          style: {
            gap: '8px',
            flexDirection: 'column',

            '& button': {
              flex: 1,
            },
          },
        },
      ],
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          width: 'fit-content',
          height: 'auto',
          padding: '4px',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& > div': { padding: '4px', height: '100%' },
          '& textarea': { scrollbarWidth: 'thin' },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#343A40',
          lineHeight: 1.4,
        },
      },
      variants: [
        {
          props: { variant: 'secondary' },
          style: { color: '#495057' },
        },
        {
          props: { variant: 'tertiary' },
          style: { color: '#6D747B' },
        },
        {
          props: { variant: 'quaternary' },
          style: { color: '#878F96' },
        },
        {
          props: { variant: 'disabled' },
          style: { color: '#B2BBC3' },
        },
      ],
    },

    MuiAutocomplete: {
      styleOverrides: {
        root: {
          background: '#fff',
          borderRadius: '8px',
          height: '68px',

          '& fieldset': {
            borderRadius: '8px',
            top: 0,
          },

          '& legend': {
            display: 'none',
          },

          '& .MuiFormLabel-root': {
            display: 'none',
          },

          // '& .MuiInputBase-root.MuiOutlinedInput-root:hover': {
          //   // hover했을때
          //   '& .MuiOutlinedInput-notchedOutline': { borderColor: 'blue' },
          // },

          '&.Mui-focused': { '& .MuiInputBase-input': { color: '#343A40' } },

          '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused': {
            //focus되었을때
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1C2681',
              borderWidth: '1px',
              boxShadow: `inset 0 0 0 1px #1C2681`,
            },
          },

          '& .MuiTextField-root': {
            background: 'transparent',
            borderRadius: '12px',

            '& label.Mui-focused': { display: 'none' },
          },

          '& .MuiInputBase-root.MuiInputBase-sizeSmall': {
            height: '68px',
            padding: '12px 20px',
            color: '#878F96',
          },

          '& .MuiInputBase-root > .MuiInputBase-input.MuiInputBase-inputSizeSmall': {
            padding: '0',
          },

          '& .MuiAutocomplete-endAdornment': { display: 'flex', gap: '4px' },

          '& .MuiAutocomplete-clearIndicator': {
            padding: '0',
            background: `url("${ClearIcon}") center center no-repeat`,
            width: '20px',
            height: '20px',

            '& svg': { display: 'none' },
          },

          '& .MuiAutocomplete-popupIndicator': {
            padding: 0,
            background: `url("${DownIcon}") center center no-repeat`,
            width: '20px',
            height: '20px',

            '& svg': { display: 'none' },
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          width: '100%',
          background: '#fff',

          '& div[role="tablist"]': {
            gap: '4px',

            '& button': {
              flex: '1',
              maxWidth: 'none',
              padding: '20px 8px 6px 8px',
              color: '#878F96',

              '&.Mui-selected': {
                color: '#343A40',
              },
            },
          },

          '& .MuiButtonBase-root.Mui-selected': {
            color: '#343A40',
            fontWeight: 700,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#343A40',
          },
        },
      },
    },

    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
});

export default theme;
