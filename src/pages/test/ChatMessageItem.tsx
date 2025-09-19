import { MessageType, Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import ChatbotMessageBubble from '@pages/test/components/ChatMessageBubble';
import ChatbotFallbackBubble from '@pages/test/components/ChatbotFallbackBubble';
import UserMessageBubble from '@pages/test/components/UserMessageBubble';
import LoadingBubble from '@pages/test/components/LoadingBubble';
import AdaptiveCardRenderer from '@pages/test/components/AdaptiveCardRenderer';
import ChatbotItemWrapper from '@pages/test/components/ChatbotItemWrapper';
import { adaptiveCardData } from '@pages/test/components/AdaptiveCardData';
import { Box, styled } from '@mui/material';
import type { JSX } from 'react';
import { onAdaptiveCardSubmit } from '@domains/common/utils/utils';

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
    render: () => (
      <AdaptiveCardStyleProvider>
        <AdaptiveCardRenderer card={adaptiveCardData} onSubmit={onAdaptiveCardSubmit} />
      </AdaptiveCardStyleProvider>
    ),
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

const ChatMessageItem = ({
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

export default ChatMessageItem;

/** AdaptiveCard 스타일 */
const AdaptiveCardStyleProvider = styled(Box)({
  '& input, & select': {
    border: '1px solid black',
    '&.ac-input-validation-failed': { borderColor: 'red', color: 'red' },
  },
  '& button': { background: 'black', color: '#fff' },
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& td': { border: '1px solid #ddd' },
  '& .ac-horizontal-separator': { display: 'none !important' },
  '& #timeBox': { flexDirection: 'row !important', '& > div': { flex: '1 !important' } },
});
