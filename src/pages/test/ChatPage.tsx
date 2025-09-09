import { Button, styled, Box, CircularProgress } from '@mui/material'
import Layout from '@shared/components/Layout'
import { WS_TEST_01, WS_TEST_02 } from '@domains/common/components/testData'
import PublishFloating, { PublushButton } from '@pages/test/PublishFloating'
import { AlignCenter, FlexBox } from '@shared/ui/layoutUtilComponents'
import MarkDownAnimator from '@pages/test/MarkDownAnimator'
import useUIStore, {
  type ChatbotFallback,
  type ChatbotMessage,
  type UserMessage,
} from '@domains/common/ui/store/ui.store'
import { useEffect, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import ChatbotMessageBubble from '@pages/test/components/ChatMessageBubble'
import ChatbotFallbackBubble from '@pages/test/components/ChatbotFallbackBubble'
import UserMessageBubble from '@pages/test/components/UserMessageBubble'

const ChatPage = () => {
  const messages = useUIStore((s) => s.messages)
  const setMessages = useUIStore((s) => s.setMessages)

  // 테스트용 푸시 토큰 핸들러
  const onTestPushTokens = (tokens: string[]) => {
    setMessages([...messages, { sender: 'chatbot', type: 'message', tokens }])
  }

  // 퍼블리셔 컴포넌트 확인 핸들러
  const onPublisherCheck = () => {
    const el = document.getElementById('publish')
    if (el) {
      el.style.display = 'flex'
    }
  }

  const onFallbackTest = () => {
    setMessages([...messages, { sender: 'chatbot', type: 'fallback' }])
  }

  return (
    <>
      <Layout>
        {/*<TestPage />*/}
        {/*<WebSocketTestPage />*/}
        {/*<MotionTestPage />*/}
        <PublushButton onClick={onPublisherCheck}>Publish</PublushButton>

        {/* 테스트 버튼들 */}
        <TestFlexBox>
          <Button variant="primary" onClick={() => onTestPushTokens(WS_TEST_01)}>
            WS_TEST_01
          </Button>
          <Button variant="primary" onClick={() => onTestPushTokens(WS_TEST_02)}>
            WS_TEST_02
          </Button>
          <Button variant="primary" onClick={onFallbackTest}>
            Fallback Test
          </Button>
        </TestFlexBox>

        {/* 메세지 렌더링 */}
        <MessagesContainer>
          <Virtuoso
            data={messages}
            overscan={0} // 렌더링 범위
            itemContent={(index, m) => {
              if (m.sender === 'chatbot' && m.type === 'message') {
                return <ChatbotMessageBubble tokens={m.tokens} />
              }
              if (m.sender === 'chatbot' && m.type === 'fallback') {
                return <ChatbotFallbackBubble />
              }
              if (m.sender === 'user') {
                return <UserMessageBubble m={m} index={index} />
              }
              return null
            }}
          />
        </MessagesContainer>
      </Layout>
      <PublishFloating />
    </>
  )
}

export default ChatPage

const TestFlexBox = styled(FlexBox)({
  position: 'fixed',
  top: '2px',
  left: '10px',
  gap: '8px',
})

const MessagesContainer = styled(Box)({
  width: '100%',
  height: '100%',

  '& div[data-testid="virtuoso-scroller"]': {
    flex: '1',
    gap: '8px',
    scrollbarWidth: 'thin',
  },
})

export const ChatbotBubbleWrap = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
})
