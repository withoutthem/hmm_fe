// src/styles/theme.ts
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    border: {
      primary: string
      secondary: string
      focused: string
    }
    backgroundCustom: {
      primary: string
      secondary: string
      scrim: string
    }
  }

  interface PaletteOptions {
    border?: {
      primary: string
      secondary: string
      focused: string
    }
    backgroundCustom?: {
      primary: string
      secondary: string
      scrim: string
    }
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    display1Bold: React.CSSProperties
    display1: React.CSSProperties
    display2Bold: React.CSSProperties
    display2: React.CSSProperties
    title1Bold: React.CSSProperties
    title1: React.CSSProperties
    title2Bold: React.CSSProperties
    title2: React.CSSProperties
    subtitle1Bold: React.CSSProperties
    subtitle1: React.CSSProperties
    subtitle1Light: React.CSSProperties
    subtitle2Bold: React.CSSProperties
    subtitle2: React.CSSProperties
    subtitle2Light: React.CSSProperties
    subtitle3Bold: React.CSSProperties
    subtitle3: React.CSSProperties
    subtitle3Light: React.CSSProperties
    body1Bold: React.CSSProperties
    body1: React.CSSProperties
    body1Light: React.CSSProperties
    body2Bold: React.CSSProperties
    body2: React.CSSProperties
    body2Light: React.CSSProperties
    body3Bold: React.CSSProperties
    body3: React.CSSProperties
    body3Light: React.CSSProperties
    caption1Bold: React.CSSProperties
    caption1: React.CSSProperties
    caption1Light: React.CSSProperties
    caption2Bold: React.CSSProperties
    caption2: React.CSSProperties
    caption2Light: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    display1Bold?: React.CSSProperties
    display1?: React.CSSProperties
    display2Bold?: React.CSSProperties
    display2?: React.CSSProperties
    title1Bold?: React.CSSProperties
    title1?: React.CSSProperties
    title2Bold?: React.CSSProperties
    title2?: React.CSSProperties
    subtitle1Bold?: React.CSSProperties
    subtitle1?: React.CSSProperties
    subtitle1Light?: React.CSSProperties
    subtitle2Bold?: React.CSSProperties
    subtitle2?: React.CSSProperties
    subtitle2Light?: React.CSSProperties
    subtitle3Bold?: React.CSSProperties
    subtitle3?: React.CSSProperties
    subtitle3Light?: React.CSSProperties
    body1Bold?: React.CSSProperties
    body1?: React.CSSProperties
    body1Light?: React.CSSProperties
    body2Bold?: React.CSSProperties
    body2?: React.CSSProperties
    body2Light?: React.CSSProperties
    body3Bold?: React.CSSProperties
    body3?: React.CSSProperties
    body3Light?: React.CSSProperties
    caption1Bold?: React.CSSProperties
    caption1?: React.CSSProperties
    caption1Light?: React.CSSProperties
    caption2Bold?: React.CSSProperties
    caption2?: React.CSSProperties
    caption2Light?: React.CSSProperties
  }
}

// 2. TypographyPropsVariantOverrides 확장
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1Bold: true
    h2Bold: true
    h3Bold: true
    h4Bold: true
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

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    secondary: true
    tertiary: true
    quaternary: true
    disabled: true
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
      main: '#ffffff', // 모노톤 컬러1
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
    allVariants: { lineHeight: 1.5 },

    display1Bold: { fontSize: '29px', fontWeight: 700 },
    display1: { fontSize: '29px', fontWeight: 600 },
    display2Bold: { fontSize: '24px', fontWeight: 700 },
    display2: { fontSize: '24px', fontWeight: 600 },

    title1Bold: { fontSize: '22px', fontWeight: 700 },
    title1: { fontSize: '22px', fontWeight: 600 },
    title2Bold: { fontSize: '20px', fontWeight: 700 },
    title2: { fontSize: '20px', fontWeight: 600 },

    subtitle1Bold: { fontSize: '18px', fontWeight: 700 },
    subtitle1: { fontSize: '18px', fontWeight: 600 },
    subtitle1Light: { fontSize: '18px', fontWeight: 500 },
    subtitle2Bold: { fontSize: '17px', fontWeight: 700 },
    subtitle2: { fontSize: '17px', fontWeight: 600 },
    subtitle2Light: { fontSize: '17px', fontWeight: 500 },
    subtitle3Bold: { fontSize: '16px', fontWeight: 700 },
    subtitle3: { fontSize: '16px', fontWeight: 600 },
    subtitle3Light: { fontSize: '16px', fontWeight: 500 },

    body1Bold: { fontSize: '15px', fontWeight: 700 },
    body1: { fontSize: '15px', fontWeight: 600 },
    body1Light: { fontSize: '15px', fontWeight: 500 },
    body2Bold: { fontSize: '14px', fontWeight: 700 },
    body2: { fontSize: '14px', fontWeight: 600 },
    body2Light: { fontSize: '14px', fontWeight: 500 },
    body3Bold: { fontSize: '13px', fontWeight: 700 },
    body3: { fontSize: '13px', fontWeight: 600 },
    body3Light: { fontSize: '13px', fontWeight: 500 },

    caption1Bold: { fontSize: '12px', fontWeight: 700 },
    caption1: { fontSize: '12px', fontWeight: 600 },
    caption1Light: { fontSize: '12px', fontWeight: 500 },
    caption2Bold: { fontSize: '11px', fontWeight: 700 },
    caption2: { fontSize: '11px', fontWeight: 600 },
    caption2Light: { fontSize: '11px', fontWeight: 500 },
    // button: {
    //   textTransform: 'none',
    // },
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

    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#343A40',
        },
      },
      variants: [
        {
          props: { variant: 'secondary' },
          style: {
            color: '#495057',
          },
        },
        {
          props: { variant: 'tertiary' },
          style: {
            color: '#6D747B',
          },
        },
        {
          props: { variant: 'quaternary' },
          style: {
            color: '#878F96',
          },
        },
        {
          props: { variant: 'disabled' },
          style: {
            color: '#B2BBC3',
          },
        },
      ],
    },
  },
})

export default theme
