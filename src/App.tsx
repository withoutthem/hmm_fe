import { Button, CssBaseline, styled } from '@mui/material'
import ApplicationProvider from './app/providers/ApplicationProvider'
import { useState } from 'react'
import ChatPage from '@pages/test/ChatPage'
import TestPage from '@pages/test/TestPage'
import TestPageV2 from '@pages/test/TestPageV2'

function App() {
  const [isTest, setIsTest] = useState(true)

  return (
    <ApplicationProvider>
      <CssBaseline />

      <TestButton variant={'primary'} onClick={() => setIsTest((e) => !e)}>
        {isTest ? '생성형챗봇으로가기' : 'Test챗봇으로가기'}
      </TestButton>

      {isTest ? (
        // <TestPage/>
        <TestPageV2 />
      ) : (
        <ChatPage />
      )}
    </ApplicationProvider>
  )
}

export default App

const TestButton = styled(Button)({
  position: 'fixed',
  top: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'red',
})
