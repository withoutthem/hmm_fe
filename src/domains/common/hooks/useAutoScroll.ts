// src/domains/common/hooks/useAutoScroll.ts
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';
import useMessageStore, { Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import { alignItemToTop, getScroller } from '@domains/common/utils/utils';

interface UseAutoScrollProps {
  messageContentRef: RefObject<HTMLDivElement | null>;
  setLastDiffHeight: Dispatch<SetStateAction<number | null>>;
  virtuosoRef: RefObject<VirtuosoHandle | null>; // ✅ 추가
}

const findLastUserIndex = (msgs: TalkMessage[]) => {
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]?.sender === Sender.USER) return i;
  }
  return -1;
};

const useAutoScroll = ({
  messageContentRef,
  setLastDiffHeight,
  virtuosoRef,
}: UseAutoScrollProps) => {
  const messages = useMessageStore((s) => s.messages);

  // 같은 USER 메시지에 대해 중복 정렬 방지
  const lastHandledUserIndexRef = useRef<number | null>(null);

  /**
   * ① 마지막 USER 버블을 "반드시 마운트" → "상단 정렬(스무스, 1회)"
   *   - 가상화 때문에 먼저 scrollToIndex로 해당 인덱스를 붙여야 함
   */
  useEffect(() => {
    if (messages.length === 0) return;

    const userIndex = findLastUserIndex(messages);
    if (userIndex < 0) return;
    if (lastHandledUserIndexRef.current === userIndex) return;
    lastHandledUserIndexRef.current = userIndex;

    // 1) 강제로 해당 인덱스 마운트
    virtuosoRef.current?.scrollToIndex({ index: userIndex, align: 'end', behavior: 'auto' });

    // 2) 아주 살짝 양보 후 상단 정렬 애니메이션 1회
    requestAnimationFrame(() => {
      void alignItemToTop(userIndex, { smooth: true, durationMs: 160 });
    });
  }, [messages, virtuosoRef]);

  /**
   * ② min-height 계산: 마지막 USER 기준
   *   - ChatbotItemWrapper(마지막 챗봇 항목)에 전달 → 화면 하단까지 받쳐줌
   */
  useLayoutEffect(() => {
    if (messages.length === 0) return;

    const userIndex = findLastUserIndex(messages);
    if (userIndex < 0) return;

    const scrollerEl = getScroller();
    const container = messageContentRef.current;
    if (!scrollerEl || !container) return;

    const tryMeasure = () => {
      const userEl = scrollerEl.querySelector(
        `[data-item-index="${userIndex}"]`
      ) as HTMLElement | null;

      if (userEl) {
        const userH = userEl.clientHeight;
        if (userH) {
          const diff = Math.max(0, container.clientHeight - userH);
          setLastDiffHeight(diff);
          return;
        }
      }
      requestAnimationFrame(tryMeasure);
    };
    requestAnimationFrame(tryMeasure);
  }, [messages, messageContentRef, setLastDiffHeight]);
};

export default useAutoScroll;
