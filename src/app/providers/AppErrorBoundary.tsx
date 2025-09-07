// src/app/providers/AppErrorBoundary.tsx
import type { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface FallbackProps {
  readonly error: Error
  readonly resetErrorBoundary: () => void
}

interface AppErrorBoundaryProps {
  readonly children: ReactNode
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>앱에서 문제가 발생했어요 😢</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>다시 시도</button>
    </div>
  )
}

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={() => {
        window.location.reload()
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
