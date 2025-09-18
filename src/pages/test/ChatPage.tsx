import { styled, Box, Button } from '@mui/material';
import Layout from '@shared/components/Layout';
import PublishFloating, { PublushButton } from '@pages/test/PublishFloating';
import useMessageStore, {
  type ChatbotMessage,
  type ChatMessage,
} from '@domains/common/ui/store/message.store';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import useDialogStore from '@domains/common/ui/store/dialog.store';
import { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { FlexBox } from '@shared/ui/layoutUtilComponents';
import ChatMessageItem from '@pages/test/ChatMessageItem';

const renderChatMessage =
  (messages: ChatMessage[], lastDiffHeight: number | null, scrollToBottom: () => void) =>
  (index: number, m: ChatMessage) => (
    <ChatMessageItem
      m={m}
      index={index}
      messagesLength={messages.length}
      lastDiffHeight={lastDiffHeight}
      scrollToBottom={scrollToBottom}
    />
  );

const ChatPage = () => {
  const messages = useMessageStore((s) => s.messages);
  const setMessages = useMessageStore((s) => s.setMessages);
  const messageContentRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const openDialog = useDialogStore((s) => s.openDialog);

  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null);

  /**
   * 스크롤 애니메이션
   */
  const scrollToBottomWithAnimation = useCallback(() => {
    const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]');
    if (!scrollerEl) return;

    const start = scrollerEl.scrollTop;
    const end = scrollerEl.scrollHeight - scrollerEl.clientHeight;
    const duration = 500;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      startTime ??= timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      scrollerEl.scrollTop = start + (end - start) * ease;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  // 메시지 변경 시 스크롤 맨 아래로
  useEffect(() => {
    if (messages.length > 0) {
      let count = 0;
      const tryScroll = () => {
        scrollToBottomWithAnimation();
        count++;
        if (count < 5) requestAnimationFrame(tryScroll);
      };
      requestAnimationFrame(tryScroll);
    }
  }, [messages.length, scrollToBottomWithAnimation]);

  /**
   * 시뮬레이션: user 입력 → chatbot 응답
   */
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1] as ChatMessage;

    if (last.sender === 'user') {
      const loadingMsg: ChatbotMessage = {
        sender: 'chatbot',
        type: 'message',
        tokens: '',
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMsg]);

      setTimeout(() => {
        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastIdx = newMsgs.length - 1;
          const last = newMsgs[lastIdx];

          if (last && last.sender === 'chatbot' && last.type === 'message' && last.isLoading) {
            newMsgs[lastIdx] = {
              sender: 'chatbot',
              type: 'adaptiveCard',
              card: {
                title: 'Adaptive Card 테스트',
                description: '이건 카드 형식 UI예요.',
              },
            };
          }

          return newMsgs;
        });
      }, 2000);
    }
  }, [messages, setMessages]);

  /**
   * 마지막 user 버블 높이 계산
   */
  useLayoutEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender !== 'user') return;

    const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]') as HTMLElement;
    const targetIndex = messages.length - 1;

    const tryGetEl = () => {
      const targetEl = scrollerEl.querySelector(
        `[data-item-index="${targetIndex}"]`
      ) as HTMLElement;

      if (targetEl && messageContentRef.current) {
        const size = targetEl.clientHeight;
        if (size) {
          const containerH = messageContentRef.current.clientHeight - Number(size);
          setLastDiffHeight(containerH);
        }
      } else {
        requestAnimationFrame(tryGetEl);
      }
    };

    requestAnimationFrame(tryGetEl);
  }, [messages]);

  const onPublisherCheck = () => {
    const el = document.getElementById('publish');
    if (el) el.style.display = 'flex';
  };

  return (
    <>
      <Layout>
        <PublushButton onClick={onPublisherCheck}>Publish</PublushButton>

        <TestFlexBox>
          <Button variant="primary" onClick={() => openDialog('history')}>
            dialog
          </Button>
        </TestFlexBox>

        <MessagesContainer ref={messageContentRef}>
          <Virtuoso
            data={messages}
            ref={virtuosoRef}
            overscan={10}
            itemContent={renderChatMessage(messages, lastDiffHeight, scrollToBottomWithAnimation)}
          />
        </MessagesContainer>
      </Layout>
      <PublishFloating />
    </>
  );
};

export default ChatPage;

const TestFlexBox = styled(FlexBox)({
  position: 'fixed',
  top: '2px',
  left: '10px',
  gap: '8px',
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

export const ChatbotBubbleWrap = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
});
