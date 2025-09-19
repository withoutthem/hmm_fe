import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
} from 'react';
import useMessageStore, {
  MessageType,
  Sender,
  type TalkMessage,
} from '@domains/common/ui/store/message.store';
import { scrollToBottomWithAnimation } from '@domains/common/utils/utils';

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
   */
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1] as TalkMessage;

    if (last.sender === Sender.USER) {
      const loadingMsg: TalkMessage = {
        sender: Sender.CHATBOT,
        type: MessageType.MESSAGE,
        streamingToken: '',
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMsg]);

      setTimeout(() => {
        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastIdx = newMsgs.length - 1;
          const last = newMsgs[lastIdx];

          if (
            last &&
            last.sender === Sender.CHATBOT &&
            last.type === MessageType.MESSAGE &&
            last.isLoading
          ) {
            newMsgs[lastIdx] = {
              sender: Sender.CHATBOT,
              type: MessageType.ADAPTIVE_CARD,
              isLoading: false,
              adaptiveCardInfo: {
                type: 'AdaptiveCard',
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
    if (lastMessage?.sender !== Sender.USER) return;

    const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]') as HTMLElement;
    const targetIndex = messages.length - 1;

    const tryGetEl = () => {
      const targetEl = scrollerEl.querySelector(
        `[data-item-index="${targetIndex}"]`
      ) as HTMLElement;

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
