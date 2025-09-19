import { ChatbotBubbleWrap } from '@shared/ui/layoutUtilComponents';

interface ChatbotMessageBubbleProps {
  tokens: string;
}

const ChatbotMessageBubble = ({ tokens }: ChatbotMessageBubbleProps) => {
  return (
    <ChatbotBubbleWrap>
      <div dangerouslySetInnerHTML={{ __html: tokens }} />
    </ChatbotBubbleWrap>
  );
};

export default ChatbotMessageBubble;
