import { Box, styled } from '@mui/material';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useCallback, useEffect, useRef, useState } from 'react';
import useMessageStore, { type TalkMessage } from '@domains/common/ui/store/message.store';
import useAutoScroll from '@domains/common/hooks/useAutoScroll';
import PublishFloating from '@pages/test/PublishFloating';
import RenderTypeOrchestrator from '@domains/chatbot/components/chats/orchestrators/RenderTypeOrchestrator';

const renderChatMessage =
  (
    messages: TalkMessage[],
    lastDiffHeight: number | null,
    atBottom: boolean,
    scrollUserThenBottom: () => void
  ) =>
  (index: number, message: TalkMessage) => (
    <RenderTypeOrchestrator
      talkMessage={message}
      index={index}
      messagesLength={messages.length}
      lastDiffHeight={lastDiffHeight}
      scrollToBottom={scrollUserThenBottom}
      atBottom={atBottom}
    />
  );

const MainPage = () => {
  // ┣━━━━━━━━━━━━━━━━ Stores ━━━━━━━━━━━━━━━━━━━┫
  const messages = useMessageStore((s) => s.messages);

  // ┣━━━━━━━━━━━━━━━━ States ━━━━━━━━━━━━━━━━━━━┫
  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  // ┣━━━━━━━━━━━━━━━━ Variables ━━━━━━━━━━━━━━━━┫
  const messageContentRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // ┣━━━━━━━━━━━━━━━━ CustomHooks ━━━━━━━━━━━━━━━━━━━━┫
  useAutoScroll({
    messageContentRef,
    setLastDiffHeight,
  });

  // ┣━━━━━━━━━━━━━━━━ Handlers ━━━━━━━━━━━━━━━━━━━┫
  // 2단계 스크롤: (1) 최상단 스냅 -> (2) 다음 프레임에서 바닥으로 smooth
  const scrollUserThenBottom = useCallback(() => {
    const lastIndex = messages.length - 1;
    if (lastIndex < 0) return;

    // 1) 스냅해서 내 메시지를 화면 최상단에 위치시킴 (instant)
    virtuosoRef.current?.scrollToIndex({
      index: lastIndex,
      align: 'start',
      behavior: 'auto',
    });

    // 2) 다음 프레임에서 바닥까지 부드럽게 이동
    requestAnimationFrame(() => {
      virtuosoRef.current?.scrollToIndex({
        index: lastIndex,
        align: 'end',
        behavior: 'smooth',
      });
    });
  }, [messages.length]);

  //TEST
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
          itemContent={renderChatMessage(messages, lastDiffHeight, atBottom, scrollUserThenBottom)}
          followOutput={false} // 우리가 직접 제어 (중복 충돌 방지)
          atBottomStateChange={setAtBottom}
          computeItemKey={(index, item) => item.messageId ?? `${item.sender}-${index}`}
          increaseViewportBy={{ top: 0, bottom: 600 }}
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
