import { Box, Fade, IconButton, styled } from '@mui/material';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useCallback, useRef, useState } from 'react';
import useMessageStore, { type TalkMessage } from '@domains/common/ui/store/message.store';
import useAutoScroll from '@domains/common/hooks/useAutoScroll';
import PublishFloating from '@pages/test/PublishFloating';
import RenderTypeOrchestrator from '@domains/chatbot/components/chats/orchestrators/RenderTypeOrchestrator';
import { scrollToBottomWithAnimation } from '@domains/common/utils/utils';

import ic_scroll_to_bottom from '@assets/img/icon/ic_scroll_to_bottom.svg';

const renderChatMessage =
  (messages: TalkMessage[], lastDiffHeight: number | null) =>
  (index: number, message: TalkMessage) => (
    <RenderTypeOrchestrator
      talkMessage={message}
      index={index}
      messagesLength={messages.length}
      lastDiffHeight={lastDiffHeight}
    />
  );

const MainPage = () => {
  const messages = useMessageStore((s) => s.messages);
  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  const messageContentRef = useRef<HTMLDivElement | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  useAutoScroll({ messageContentRef, setLastDiffHeight, virtuosoRef });

  const onClickScrollToBottom = useCallback(() => {
    scrollToBottomWithAnimation();
    requestAnimationFrame(() => setAtBottom(true));
  }, []);

  return (
    <MainPageContainer>
      <MessagesContainer ref={messageContentRef}>
        <Virtuoso
          className="virtuoso"
          data={messages}
          ref={virtuosoRef}
          overscan={10}
          itemContent={renderChatMessage(messages, lastDiffHeight)}
          followOutput={false}
          atBottomStateChange={setAtBottom}
          computeItemKey={(i, item) => item.messageId ?? `${item.sender}-${i}`}
          increaseViewportBy={{ top: 0, bottom: 600 }}
        />
      </MessagesContainer>

      <PublishFloating />

      {messages.length > 0 && !atBottom && (
        <Fade in timeout={300}>
          <ScrollToBottomButton onClick={onClickScrollToBottom}>
            <Box component="img" src={ic_scroll_to_bottom} alt="" />
          </ScrollToBottomButton>
        </Fade>
      )}
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
    flex: 1,
    height: '100%',
    gap: '8px',
    scrollbarWidth: 'thin',
  },
});

const ScrollToBottomButton = styled(IconButton)({
  position: 'fixed',
  bottom: '83px',
  right: '20px',
  zIndex: 100,
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  boxShadow: '0 0 0.5px rgba(0,0,0,.25), 0 3px 4px rgba(9,30,66,.1)',
  background: '#fff',
});
