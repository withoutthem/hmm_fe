// src/styles/theme.ts
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    systemColor1: Palette['primary']
    systemColor2: Palette['primary']
    systemColor3: Palette['primary']
  }
  interface PaletteOptions {
    customColor1?: PaletteOptions['primary']
    customColor2?: PaletteOptions['primary']
    customColor3?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true
    secondary: true
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsVariantOverrides {
    symmetry: true
    asymmetry: true
    column: true
  }
}

const theme = createTheme({
  // 1. 색상, 타이포그래피 등 디자인 토큰 정의
  palette: {
    primary: {
      main: '#20265B',
    },
    secondary: {
      main: '#1C2681',
    },
    error: {
      main: '#EE312F',
    },
    warning: {
      main: '#232B33',
    },
    customColor1: {
      main: '#1C2681',
    },
    customColor2: {
      main: '#49519A',
    },
    customColor3: {
      main: '#777DB3',
    },
    grey: {
      50: '#F8F9FA',
      100: '#F1F3F5',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#B2BBC3',
      500: '#878F96',
      600: '#6D747B',
      700: '#495057',
      800: '#343A40',
      900: '#212528',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },

  // 2. 컴포넌트 기본 동작 및 스타일 오버라이드
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          fontFamily: `"Pretendard", "Noto Sans KR" !important`,
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
          borderRadius: 12,
          padding: 16,
          height: '56px',
          fontSize: '17px',
          lineHeight: '140%',
          fontWeight: 600,
        },
      },
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            backgroundColor: '#20265B',
            color: '#fff',
            '&&:active ': {
              backgroundColor: '#181C44',
            },
            '&:disabled': {
              color: '#797D9D',
            },
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            backgroundColor: '#E9ECEF',
            color: '#343A40',
            '&:active ': {
              backgroundColor: '#D2D5D8',
            },
            '&:disabled': {
              color: '#B2BBC3',
            },
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

            '& button.MuiButtonGroup-firstButton': {
              width: '35%',
            },
            '& button.MuiButtonGroup-lastButton': {
              width: '65%',
            },
          },
        },
        {
          props: { variant: 'column' },
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
  },
})

export default theme
