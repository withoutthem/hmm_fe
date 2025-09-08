import { useState } from 'react'
import { Box, Button, CssBaseline, styled } from '@mui/material'
import ApplicationProvider from './app/providers/ApplicationProvider'
import ChatPage from '@pages/test/ChatPage'
import HighlighterTestPage from '@pages/test/HighlighterTestPage'
import TestPageV2 from '@pages/test/TestPageV2'

const testPageMapper = {
  test: <ChatPage />,
  test2: <TestPageV2 />,
  highlighter: <HighlighterTestPage />,
}

function App() {
  const [isError, setIsError] = useState(false)
  const [page, setPage] = useState<'test' | 'test2' | 'highlighter'>('test')
  if (isError) {
    throw new Error('렌더링 중에 발생한 에러! (ErrorBoundary에서 잡힘)')
  }

  const switchPage = () => {
    setPage((p) => (p === 'test' ? 'test2' : p === 'test2' ? 'highlighter' : 'test'))
  }

  return (
    <ApplicationProvider>
      <CssBaseline />

      <TextBox>
        <Button onClick={switchPage}>페이지 전환</Button>

        <Button onClick={() => setIsError(true)}>에러 발생</Button>
      </TextBox>

      {testPageMapper[page]}
    </ApplicationProvider>
  )
}

export default App

const TextBox = styled(Box)({
  position: 'fixed',
  top: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
})
