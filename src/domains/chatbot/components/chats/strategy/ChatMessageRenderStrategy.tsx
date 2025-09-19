import { MessageType, Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import ChatbotMessageBubble from '@domains/chatbot/components/chats/bubble/ChatMessageBubble';
import ChatbotFallbackBubble from '@domains/chatbot/components/chats/etc/ChatbotFallbackBubble';
import UserMessageBubble from '@domains/chatbot/components/chats/bubble/UserMessageBubble';
import ChatbotItemWrapper from '@domains/chatbot/components/chats/strategy/ChatbotItemWrapper';
import type { JSX } from 'react';
import { onAdaptiveCardSubmit } from '@domains/common/utils/utils';
import LoadingBubble from '@domains/chatbot/components/chats/etc/LoadingBubble';
import AdaptiveCard from '@domains/chatbot/components/chats/adaptiveCard/AdaptiveCard';
import { adaptiveCardData } from '@domains/chatbot/components/chats/adaptiveCard/adaptiveCardData';

interface ChatMessageItemProps {
  talkMessage: TalkMessage;
  index: number;
  messagesLength: number;
  lastDiffHeight: number | null;
  scrollToBottom: () => void;
}

/** 공통 Renderer 타입 */
type Renderer = (message: TalkMessage, ctx: { index: number }) => JSX.Element | null;

/** CHATBOT 메시지 규칙 배열 */
const chatbotRules: Array<{ when: (message: TalkMessage) => boolean; render: Renderer }> = [
  {
    when: (message) => message?.isLoading ?? false,
    render: () => <LoadingBubble />,
  },
  {
    when: (message) => message.type === MessageType.FALLBACK,
    render: (_, { index }) => <ChatbotFallbackBubble index={index} />,
  },
  {
    when: (message) => message.type === MessageType.MESSAGE,
    render: (message) => <ChatbotMessageBubble tokens={message.streamingToken ?? ''} />,
  },
  {
    when: (message) => message.type === MessageType.ADAPTIVE_CARD,
    render: () => <AdaptiveCard card={adaptiveCardData} onSubmit={onAdaptiveCardSubmit} />,
  },
];

/** sender 별 매핑 */
const renderBySender: Record<Sender, Renderer> = {
  [Sender.USER]: (m, { index }) => <UserMessageBubble m={m} index={index} />,
  [Sender.CHATBOT]: (m, ctx) => {
    const matched = chatbotRules.find((r) => r.when(m));
    return matched ? matched.render(m, ctx) : null;
  },
};

const ChatMessageRenderStrategy = ({
  talkMessage,
  index,
  messagesLength,
  lastDiffHeight,
  scrollToBottom,
}: ChatMessageItemProps) => {
  const content = renderBySender[talkMessage.sender](talkMessage, { index });

  if (talkMessage.sender === Sender.CHATBOT) {
    const isLast = index === messagesLength - 1;
    return (
      <ChatbotItemWrapper
        isLastMessage={isLast}
        lastDiffHeight={lastDiffHeight}
        scrollToBottom={scrollToBottom}
      >
        {content}
      </ChatbotItemWrapper>
    );
  }

  return content;
};

export default ChatMessageRenderStrategy;
