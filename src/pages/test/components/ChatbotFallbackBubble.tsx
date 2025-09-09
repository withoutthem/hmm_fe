import { Box, styled } from '@mui/material'
import { ChatbotBubbleWrap } from '@pages/test/ChatPage'
import LoadingBubble from '@pages/test/components/LoadingBubble'
import DelayedRender from '@pages/test/components/DelayedRender'

const ChatbotFallbackBubble = () => (
  <ChatbotBubbleWrap>
    <DelayedRender delayMs={3000} placeholder={<LoadingBubble />}>
      <FallbackBubbleCon>🤖 Fallback 응답입니다.</FallbackBubbleCon>
    </DelayedRender>
  </ChatbotBubbleWrap>
)

export default ChatbotFallbackBubble

const FallbackBubbleCon = styled(Box)({
  background: '#fff',
  borderRadius: 8,
  padding: '8px 12px',
})
