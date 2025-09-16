import MarkDownAnimator from '@pages/test/MarkDownAnimator'
import { ChatbotBubbleWrap } from '@pages/test/ChatPage'

interface ChatbotMessageBubbleProps {
  tokens: string[]
  index: number
}

const ChatbotMessageBubble = ({ tokens, index }: ChatbotMessageBubbleProps) => {
  return (
    <ChatbotBubbleWrap>
      {/*<MarkDownAnimator tokens={tokens} speed={20} index={index} />*/}
      <div dangerouslySetInnerHTML={{ __html: tokens }} />
    </ChatbotBubbleWrap>
  )
}

export default ChatbotMessageBubble
