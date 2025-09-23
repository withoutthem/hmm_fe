import { Box, IconButton, styled } from '@mui/material';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useCallback, useEffect, useRef, useState } from 'react';
import useMessageStore, { Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import useAutoScroll from '@domains/common/hooks/useAutoScroll';
import PublishFloating from '@pages/test/PublishFloating';
import RenderTypeOrchestrator from '@domains/chatbot/components/chats/orchestrators/RenderTypeOrchestrator';
import { scrollLastMessageUserThenBottom } from '@domains/common/utils/utils';

import ic_scroll_to_bottom from '@assets/img/icon/ic_scroll_to_bottom.svg';

const renderChatMessage =
  (messages: TalkMessage[], lastDiffHeight: number | null, atBottom: boolean) =>
  (index: number, message: TalkMessage) => (
    <RenderTypeOrchestrator
      talkMessage={message}
      index={index}
      messagesLength={messages.length}
      lastDiffHeight={lastDiffHeight}
      atBottom={atBottom}
    />
  );

const MainPage = () => {
  // ┣━━━━━━━━━━━━━━━━ Stores ━━━━━━━━━━━━━━━━━━━┫
  const messages = useMessageStore((s) => s.messages);

  // ┣━━━━━━━━━━━━━━━━ States ━━━━━━━━━━━━━━━━━━━┫
  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  // ┣━━━━━━━━━━━━━━━━ Refs ━━━━━━━━━━━━━━━━━━━┫
  const messageContentRef = useRef<HTMLDivElement | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  // ┣━━━━━━━━━━━━━━━━ Hooks ━━━━━━━━━━━━━━━━━━━┫
  // 높이 보정 계산만 담당시키세요. (강제 스크롤 금지)
  useAutoScroll({
    messageContentRef,
    setLastDiffHeight,
  });

  // ❶ 커스텀 애니메이션 트리거 (맨위/중간/맨아래 모두 동일하게 동작)
  const scrollUserThenBottom = useCallback(async () => {
    const lastIndex = messages.length - 1;
    if (lastIndex < 0) return;
    await scrollLastMessageUserThenBottom(virtuosoRef.current, lastIndex);
  }, [messages.length]);

  // ❷ "사용자 메시지 추가" 시, 항상 트리거
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last?.sender === Sender.USER) {
      void scrollUserThenBottom();
    }
  }, [messages.length, messages, scrollUserThenBottom]);

  return (
    <MainPageContainer className={'main_page'}>
      <MessagesContainer ref={messageContentRef}>
        <Virtuoso
          className={'virtuoso'}
          data={messages}
          ref={virtuosoRef}
          overscan={10}
          itemContent={renderChatMessage(messages, lastDiffHeight, atBottom)}
          followOutput={false} // ✅ Virtuoso 자동 스크롤 OFF (충돌 방지)
          atBottomStateChange={setAtBottom}
          computeItemKey={(index, item) => item.messageId ?? `${item.sender}-${index}`}
          increaseViewportBy={{ top: 0, bottom: 600 }} // 하단 프리로딩
        />
      </MessagesContainer>

      {/* TEST */}
      <PublishFloating />
      {messages.length > 0 && !atBottom && (
        <ScrollToBottomButton>
          <Box component={'img'} src={ic_scroll_to_bottom} />
        </ScrollToBottomButton>
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
    flex: '1',
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
  boxShadow: '0 0 0.5px 0 rgba(0, 0, 0, 0.25), 0 3px 4px 0 rgba(9, 30, 66, 0.10)',
  background: '#fff',
});
