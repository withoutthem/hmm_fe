import { RenderType, Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import ChatbotFallbackBubble from '@domains/chatbot/components/chats/renderers/bubbles/ChatbotFallbackBubble';
import UserMessageBubble from '@domains/chatbot/components/chats/renderers/bubbles/UserMessageBubble';
import LoadingBubble from '@domains/chatbot/components/chats/renderers/bubbles/LoadingBubble';
import ChatbotItemWrapper from '@domains/chatbot/components/chats/renderers/wrappers/ChatbotItemWrapper';
import type { JSX } from 'react';
import MessageTypeOrchestrator from '@domains/chatbot/components/chats/orchestrators/MessageTypeOrchestrator';

interface RenderTypeOrchestratorProps {
  talkMessage: TalkMessage;
  index: number;
  messagesLength: number;
  lastDiffHeight: number | null;
}

/**
 * RenderTypeOrchestrator
 * ------------------------
 * 1. RenderType (LOADING, FALLBACK, NORMAL)
 * 2. Sender(USER/CHATBOT)
 * 3. NORMAL → NodeTypeOrchestrator
 */
const RenderTypeOrchestrator = (props: RenderTypeOrchestratorProps) => {
  const { talkMessage, index, messagesLength, lastDiffHeight } = props;
  const isLast = index === messagesLength - 1;

  // USER 메시지
  if (talkMessage.sender === Sender.USER) {
    return <UserMessageBubble message={talkMessage} index={index} />;
  }

  // CHATBOT 메시지
  let node: JSX.Element | null;

  switch (talkMessage.renderType) {
    case RenderType.LOADING:
      node = <LoadingBubble />;
      break;

    case RenderType.FALLBACK:
      node = <ChatbotFallbackBubble index={index} />;
      break;

    case RenderType.NORMAL:
    default:
      node = <MessageTypeOrchestrator talkMessage={talkMessage} />;
  }

  return (
    <ChatbotItemWrapper isLastMessage={isLast} lastDiffHeight={lastDiffHeight}>
      {node}
    </ChatbotItemWrapper>
  );
};

export default RenderTypeOrchestrator;
