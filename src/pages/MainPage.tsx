import { Box, styled } from '@mui/material';
import { Virtuoso } from 'react-virtuoso';
import { useEffect, useRef, useState } from 'react';
import useMessageStore, { type TalkMessage } from '@domains/common/ui/store/message.store';
import ChatMessageRenderStrategy from '@domains/chatbot/components/chats/strategy/ChatMessageRenderStrategy';
import useAutoScroll from '@domains/common/hooks/useAutoScroll';
import { scrollToBottomWithAnimation } from '@domains/common/utils/utils';
import PublishFloating from '@pages/test/PublishFloating';

const renderChatMessage =
  (messages: TalkMessage[], lastDiffHeight: number | null, scrollToBottom: () => void) =>
  (index: number, message: TalkMessage) => (
    <ChatMessageRenderStrategy
      talkMessage={message}
      index={index}
      messagesLength={messages.length}
      lastDiffHeight={lastDiffHeight}
      scrollToBottom={scrollToBottom}
    />
  );

const MainPage = () => {
  // ┣━━━━━━━━━━━━━━━━ Stores ━━━━━━━━━━━━━━━━━━━┫
  const messages = useMessageStore((s) => s.messages);

  // ┣━━━━━━━━━━━━━━━━ States ━━━━━━━━━━━━━━━━━━━┫
  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null);

  // ┣━━━━━━━━━━━━━━━━ Variables ━━━━━━━━━━━━━━━━┫
  const messageContentRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef(null);

  // ┣━━━━━━━━━━━━━━━━ CustomHooks ━━━━━━━━━━━━━━━━━━━━┫
  useAutoScroll({
    messageContentRef,
    setLastDiffHeight,
  });

  useEffect(() => {
    console.log('messages', messages);
  }, [messages]);

  return (
    <MainPageContainer className={'main_page'}>
      <MessagesContainer ref={messageContentRef}>
        <Virtuoso
          className={'virtuoso'}
          data={messages}
          ref={virtuosoRef}
          overscan={10}
          itemContent={renderChatMessage(messages, lastDiffHeight, scrollToBottomWithAnimation)}
        />
      </MessagesContainer>

      {/*TEST*/}
      <PublishFloating />
    </MainPageContainer>
  );
};

export default MainPage;

const MainPageContainer = styled(Box)({
  width: '100%',
  height: '100%',
});

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
