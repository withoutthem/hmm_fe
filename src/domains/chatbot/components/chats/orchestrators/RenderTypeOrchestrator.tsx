import { RenderType, Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import ChatbotFallbackBubble from '@domains/chatbot/components/chats/renderers/bubbles/ChatbotFallbackBubble';
import UserMessageBubble from '@domains/chatbot/components/chats/renderers/bubbles/UserMessageBubble';
import LoadingBubble from '@domains/chatbot/components/chats/renderers/bubbles/LoadingBubble';
import ChatbotItemWrapper from '@domains/chatbot/components/chats/renderers/wrappers/ChatbotItemWrapper';
import type { JSX } from 'react';
import MessageTypeOrchestrator from '@domains/chatbot/components/chats/orchestrators/MessageTypeOrchestrator';

// 렌더링에 필요한 필수 props
interface RenderTypeOrchestratorProps {
  talkMessage: TalkMessage;
  index: number;
  messagesLength: number;
  lastDiffHeight: number | null;
}

/**
 * RenderTypeOrchestrator
 * - RenderType/보낸이 기준으로 적절한 버블을 고르고, 마지막 챗봇 메시지는 min-height를 적용하기 위해 래퍼로 감싼다.
 * - NORMAL은 MessageTypeOrchestrator에 위임해 세부 타입(마크다운/카드/JSON 등)을 렌더한다.
 */
const RenderTypeOrchestrator = (props: RenderTypeOrchestratorProps) => {
  const { talkMessage, index, messagesLength, lastDiffHeight } = props;
  const isLast = index === messagesLength - 1; // 마지막 메시지 여부

  // USER일 때 사용자 버블을 렌더하는 함수.
  if (talkMessage.sender === Sender.USER) {
    return <UserMessageBubble message={talkMessage} index={index} />;
  }

  // CHATBOT일 때 버블을 선택해서 렌더하는 함수.
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

  // min-height 적용을 위해 래퍼로 감싸는 함수.
  return (
    <ChatbotItemWrapper isLastMessage={isLast} lastDiffHeight={lastDiffHeight}>
      {node}
    </ChatbotItemWrapper>
  );
};

export default RenderTypeOrchestrator;
