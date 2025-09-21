import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
} from 'react';
import useMessageStore, {
  MessageType,
  RenderType,
  Sender,
  type TalkMessage,
} from '@domains/common/ui/store/message.store';
import { scrollToBottomWithAnimation } from '@domains/common/utils/utils';
import { adaptiveCardData } from '@domains/test/testData/adaptiveCardData';

interface UseAutoScrollProps {
  messageContentRef: RefObject<HTMLDivElement | null>;
  setLastDiffHeight: Dispatch<SetStateAction<number | null>>;
}

const useAutoScroll = (props: UseAutoScrollProps) => {
  const messages = useMessageStore((s) => s.messages);
  const setMessages = useMessageStore((s) => s.setMessages);

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
  }, [messages.length]);

  /**
   * 시뮬레이션: user 입력 → chatbot 응답
   * - 이전: isLoading / MessageType.MESSAGE 사용
   * - 변경: RenderType.LOADING / MessageType.MARKDOWN 사용
   */
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1] as TalkMessage;

    if (last.sender === Sender.USER) {
      // 1) 챗봇 로딩 메시지 추가
      const loadingMsg: TalkMessage = {
        sender: Sender.CHATBOT,
        renderType: RenderType.LOADING,
        messageType: MessageType.MARKDOWN, // 필수 필드라 아무 포맷 하나 지정 (텍스트/토큰 없음)
        // streamingToken: '', // 필요시 유지
      };
      setMessages((prev) => [...prev, loadingMsg]);

      // TEST
      // 2) 2초 뒤 로딩 → 실제 응답(예: Adaptive Card)으로 교체
      setTimeout(() => {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const newMsgs = [...prev];
          const lastIdx = newMsgs.length - 1;
          const lastMsg = newMsgs[lastIdx] as TalkMessage;

          if (
            lastMsg &&
            lastMsg.sender === Sender.CHATBOT &&
            (lastMsg.renderType ?? RenderType.NORMAL) === RenderType.LOADING
          ) {
            newMsgs[lastIdx] = {
              sender: Sender.CHATBOT,
              renderType: RenderType.NORMAL,
              messageType: MessageType.ADAPTIVE_CARD,
              message: '챗봇 응답: Adaptive Card 예시',
              adaptiveCardInfo: adaptiveCardData,
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
    if (lastMessage?.sender !== Sender.USER) return;

    const scrollerEl = document.querySelector(
      '[data-testid="virtuoso-scroller"]'
    ) as HTMLElement | null;
    if (!scrollerEl) return;

    const targetIndex = messages.length - 1;

    const tryGetEl = () => {
      const targetEl = scrollerEl.querySelector(
        `[data-item-index="${targetIndex}"]`
      ) as HTMLElement | null;

      if (targetEl && props.messageContentRef.current) {
        const size = targetEl.clientHeight;
        if (size) {
          const containerH = props.messageContentRef.current.clientHeight - Number(size);
          props.setLastDiffHeight(containerH);
        }
      } else {
        requestAnimationFrame(tryGetEl);
      }
    };

    requestAnimationFrame(tryGetEl);
  }, [messages, props]);
};

export default useAutoScroll;
