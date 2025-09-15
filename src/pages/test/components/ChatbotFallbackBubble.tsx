import { Box, styled } from '@mui/material'
import { ChatbotBubbleWrap } from '@pages/test/ChatPage'
import { useOnceAnimation } from '@domains/common/hooks/useOnceAnimation'
import { popIn } from '@domains/common/hooks/animations'

interface ChatbotFallbackBubbleProps {
  index: number
}

const ChatbotFallbackBubble = ({ index }: ChatbotFallbackBubbleProps) => {
  const animated = useOnceAnimation(index)

  return (
    <ChatbotBubbleWrap>
      <FallbackBubbleCon className={animated ? 'pop-in' : ''}>
        🤖 Fallback 응답입니다.
      </FallbackBubbleCon>
    </ChatbotBubbleWrap>
  )
}

export default ChatbotFallbackBubble

const FallbackBubbleCon = styled(Box)({
  background: '#fff',
  borderRadius: 8,
  padding: '8px 12px',
  transformOrigin: 'top left',

  '&.pop-in': {
    animation: `${popIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both`,
  },
})
