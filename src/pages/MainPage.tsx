import { Box, styled } from '@mui/material';
import { Virtuoso } from 'react-virtuoso';
import { useRef, useState } from 'react';
import useMessageStore, { type TalkMessage } from '@domains/common/ui/store/message.store';
import ChatMessageItem from '@pages/test/ChatMessageItem';
import useAutoScroll from '@domains/common/hooks/useAutoScroll';
import { scrollToBottomWithAnimation } from '@domains/common/utils/utils';

const renderChatMessage =
  (messages: TalkMessage[], lastDiffHeight: number | null, scrollToBottom: () => void) =>
  (index: number, message: TalkMessage) => (
    <ChatMessageItem
      talkMessage={message}
      index={index}
      messagesLength={messages.length}
      lastDiffHeight={lastDiffHeight}
      scrollToBottom={scrollToBottom}
    />
  );

const MainPage = () => {
  // =================================================================================
  // ┣━━━━━━━━━━━━━━━━ Hooks ━━━━━━━━━━━━━━━━┫
  // =================================================================================

  // =================================================================================
  // ┣━━━━━━━━━━━━━━━━ Stores ━━━━━━━━━━━━━━━━┫
  // =================================================================================
  const messages = useMessageStore((s) => s.messages);
  // =================================================================================
  // ┣━━━━━━━━━━━━━━━━ States ━━━━━━━━━━━━━━━━┫
  // =================================================================================
  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null);

  // =================================================================================
  // ┣━━━━━━━━━━━━━━━━ Variables ━━━━━━━━━━━━━━━━┫
  // =================================================================================
  const messageContentRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef(null);
  // =================================================================================
  // ┣━━━━━━━━━━━━━━━━ Effects ━━━━━━━━━━━━━━━━┫
  // =================================================================================
  useAutoScroll({
    messageContentRef,
    setLastDiffHeight,
  });

  // =================================================================================
  // ┣━━━━━━━━━━━━━━━━ Handlers ━━━━━━━━━━━━━━━━┫
  // =================================================================================

  return (
    <Box className={'main_page'}>
      <MessagesContainer ref={messageContentRef}>
        <Virtuoso
          data={messages}
          ref={virtuosoRef}
          overscan={10}
          itemContent={renderChatMessage(messages, lastDiffHeight, scrollToBottomWithAnimation)}
        />
      </MessagesContainer>
    </Box>
  );
};

export default MainPage;

const MessagesContainer = styled(Box)({
  width: '100%',
  height: '100%',
  '& div[data-testid="virtuoso-scroller"]': {
    flex: '1',
    height: '100%',
    gap: '8px',
    scrollbarWidth: 'thin',
  },
});
