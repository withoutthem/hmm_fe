// src/pages/MainPage.tsx
import { Box, IconButton, styled } from '@mui/material';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useCallback, useEffect, useRef, useState } from 'react';
import useMessageStore, { Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import useAutoScroll from '@domains/common/hooks/useAutoScroll';
import PublishFloating from '@pages/test/PublishFloating';
import RenderTypeOrchestrator from '@domains/chatbot/components/chats/orchestrators/RenderTypeOrchestrator';
import {
  scrollLastMessageUserThenBottom,
  scrollToBottomWithAnimation, // ✅ 추가
} from '@domains/common/utils/utils'; // ✅ 동일 파일에서 가져옴

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
  const messages = useMessageStore((s) => s.messages);

  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  const messageContentRef = useRef<HTMLDivElement | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  useAutoScroll({ messageContentRef, setLastDiffHeight });

  // 사용자 메시지 추가 시: 한 번만 “내 메시지 → 바닥” 정렬
  const scrollUserThenBottom = useCallback(async () => {
    const lastIndex = messages.length - 1;
    if (lastIndex < 0) return;
    await scrollLastMessageUserThenBottom(virtuosoRef.current, lastIndex);
  }, [messages.length]);

  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last?.sender === Sender.USER) {
      void scrollUserThenBottom();
    }
  }, [messages.length, messages, scrollUserThenBottom]);

  // ✅ 스크롤-투-바텀 버튼 클릭 핸들러
  const onClickScrollToBottom = useCallback(() => {
    scrollToBottomWithAnimation();
    // 애니메이션이 끝나도 atBottomStateChange 이벤트가 즉시 안 올 수 있어,
    // 한 틱 뒤에 상태를 스냅샷 하여 보정합니다(시각적 깜빡임 방지).
    requestAnimationFrame(() => {
      // Virtuoso가 바닥으로 내려갔으면 이 콜백이 곧 트리거되지만,
      // 바로 버튼을 숨기고 싶다면 아래 한 줄을 유지하세요.
      setAtBottom(true);
    });
  }, []);

  return (
    <MainPageContainer className={'main_page'}>
      <MessagesContainer ref={messageContentRef}>
        <Virtuoso
          className={'virtuoso'}
          data={messages}
          ref={virtuosoRef}
          overscan={10}
          itemContent={renderChatMessage(messages, lastDiffHeight, atBottom)}
          followOutput={false}
          atBottomStateChange={setAtBottom}
          computeItemKey={(index, item) => item.messageId ?? `${item.sender}-${index}`}
          increaseViewportBy={{ top: 0, bottom: 600 }}
        />
      </MessagesContainer>

      {/* TEST */}
      <PublishFloating />

      {/* ✅ 바닥 아닐 때만 노출 & 클릭 시 부드럽게 하단 이동 */}
      {messages.length > 0 && !atBottom && (
        <ScrollToBottomButton aria-label="최신 메시지로 이동" onClick={onClickScrollToBottom}>
          <Box component={'img'} src={ic_scroll_to_bottom} alt="" />
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
