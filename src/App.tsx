import { useState } from 'react'
import { Box, Button, CssBaseline, styled } from '@mui/material'
import ApplicationProvider from './app/providers/ApplicationProvider'
import ChatPage from '@pages/test/ChatPage'
import HighlighterTestPage from '@pages/test/HighlighterTestPage'

function App() {
  const [isTest, setIsTest] = useState(true)
  const [isError, setIsError] = useState(false)

  if (isError) {
    throw new Error('렌더링 중에 발생한 에러! (ErrorBoundary에서 잡힘)')
  }

  return (
    <ApplicationProvider>
      <CssBaseline />

      <TextBox>
        <Button sx={{ background: 'red' }} variant={'primary'} onClick={() => setIsTest((e) => !e)}>
          {isTest ? '생성형챗봇으로가기' : 'Test챗봇으로가기'}
        </Button>
        <Button sx={{ background: 'blue' }} variant={'primary'} onClick={() => setIsError(true)}>
          에러 발생 테스트
        </Button>
      </TextBox>

      {isTest ? <HighlighterTestPage /> : <ChatPage />}
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
