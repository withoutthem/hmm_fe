import MarkDownAnimator from '@pages/test/MarkDownAnimator'
import { ChatbotBubbleWrap } from '@pages/test/ChatPage'
import LoadingBubble from '@pages/test/components/LoadingBubble'
import DelayedRender from '@pages/test/components/DelayedRender'

const ChatbotMessageBubble = ({ tokens }: { tokens: string[] }) => (
  <ChatbotBubbleWrap>
    <DelayedRender delayMs={3000} placeholder={<LoadingBubble />}>
      <MarkDownAnimator tokens={tokens} speed={20} />
    </DelayedRender>
  </ChatbotBubbleWrap>
)

export default ChatbotMessageBubble
