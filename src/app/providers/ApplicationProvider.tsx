import { ThemeProvider } from '@mui/material/styles'
import theme from '@theme/theme'
import { type ReactNode } from 'react'
import { QueryProvider } from '@shared/platform/query'
import { StompProvider } from '@app/providers/StompProvider'

interface ApplicationProvidersProps {
  children: ReactNode
}

const ApplicationProvider = ({ children }: ApplicationProvidersProps) => {
  return (
    <QueryProvider>
      <StompProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StompProvider>
    </QueryProvider>
  )
}

export default ApplicationProvider
