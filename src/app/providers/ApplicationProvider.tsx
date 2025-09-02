import { ThemeProvider } from '@mui/material/styles'
import theme from '@theme/theme'
import { type ReactNode } from 'react'
import { QueryProvider } from '@shared/platform/query'
import { WsProvider } from '@app/providers/WsProvider'

interface ApplicationProvidersProps {
  children: ReactNode
}

const ApplicationProvider = ({ children }: ApplicationProvidersProps) => {
  return (
    <QueryProvider>
      <WsProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </WsProvider>
    </QueryProvider>
  )
}

export default ApplicationProvider
