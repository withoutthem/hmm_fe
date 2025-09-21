import { RenderType, Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import ChatbotFallbackBubble from '@domains/chatbot/components/chats/renderers/bubbles/ChatbotFallbackBubble';
import UserMessageBubble from '@domains/chatbot/components/chats/renderers/bubbles/UserMessageBubble';
import type { JSX } from 'react';
import LoadingBubble from '@domains/chatbot/components/chats/renderers/bubbles/LoadingBubble';
import ChatbotItemWrapper from '@domains/chatbot/components/chats/renderers/wrappers/ChatbotItemWrapper';
import MessageTypeOrchestrator from '@domains/chatbot/components/chats/orchestrators/MessageTypeOrchestrator';

interface RenderTypeOrchestratorProps {
  talkMessage: TalkMessage;
  index: number;
  messagesLength: number;
  lastDiffHeight: number | null;
  atBottom: boolean;
}

/**
 * RenderTypeOrchestrator
 * ------------------------
 * 1. RenderType (LOADING, FALLBACK, NORMAL) 단계 처리
 * 2. Sender(USER/CHATBOT)에 따른 분기
 * 3. CHATBOT 메시지는 ChatbotItemWrapper로 감싸 UX 제어
 */
const RenderTypeOrchestrator = (props: RenderTypeOrchestratorProps) => {
  const isLast = props.index === props.messagesLength - 1;

  // USER 메시지는 단순 처리
  if (props.talkMessage.sender === Sender.USER) {
    return <UserMessageBubble message={props.talkMessage} index={props.index} />;
  }

  // CHATBOT 메시지
  let node: JSX.Element | null;

  switch (props.talkMessage.renderType) {
    case RenderType.LOADING:
      node = <LoadingBubble />;
      break;

    case RenderType.FALLBACK:
      node = <ChatbotFallbackBubble index={props.index} />;
      break;

    case RenderType.NORMAL:
    default:
      node = <MessageTypeOrchestrator talkMessage={props.talkMessage} />;
  }

  return (
    <ChatbotItemWrapper
      isLastMessage={isLast}
      lastDiffHeight={props.lastDiffHeight}
      atBottom={props.atBottom}
    >
      {node}
    </ChatbotItemWrapper>
  );
};

export default RenderTypeOrchestrator;
