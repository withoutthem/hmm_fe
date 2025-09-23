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
  // 메시지 컨테이너 ref
  messageContentRef: RefObject<HTMLDivElement | null>;
  // 마지막 USER 버블과 컨테이너 높이 차이 저장
  setLastDiffHeight: Dispatch<SetStateAction<number | null>>;
  // Virtuoso 핸들 ref (가상화 아이템 강제 마운트)
  virtuosoRef: RefObject<VirtuosoHandle | null>;
}

/**
 * useAutoScroll
 * - 마지막 USER 버블을 가상화 목록에 "반드시" 붙인 뒤 1회 상단 정렬(스무스).
 * - 마지막 USER 높이 기반으로 min-height를 계산해 챗봇 영역이 바닥까지 받치도록 함.
 * - 챗봇 메시지 렌더 중에는 추가 자동 스크롤을 하지 않아 드득거림/충돌을 방지.
 */
const useAutoScroll = ({
  messageContentRef,
  setLastDiffHeight,
  virtuosoRef,
}: UseAutoScrollProps) => {
  const messages = useMessageStore((s) => s.messages);
  const lastHandledUserIndexRef = useRef<number | null>(null); // 마지막으로 정렬 처리한 USER 인덱스 기억

  // 배열을 역순으로 훑어서 마지막 USER 인덱스를 찾는 함수.
  const findLastUserIndex = (msgs: TalkMessage[]) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i]?.sender === Sender.USER) return i; // 발견 즉시 반환
    }
    return -1; // 없으면 -1
  };

  useEffect(() => {
    if (messages.length === 0) return;

    const userIndex = findLastUserIndex(messages); // 마지막 USER 위치
    if (userIndex < 0) return;
    if (lastHandledUserIndexRef.current === userIndex) return; // 중복 처리 방지
    lastHandledUserIndexRef.current = userIndex; // 처리 인덱스 기록

    virtuosoRef.current?.scrollToIndex({ index: userIndex, align: 'end', behavior: 'auto' }); // 해당 아이템 강제 마운트
    requestAnimationFrame(() => {
      void alignItemToTop(userIndex, { smooth: true, durationMs: 160 }); // 한 번만 부드럽게 상단 정렬
    });
  }, [messages, virtuosoRef]);

  useLayoutEffect(() => {
    if (messages.length === 0) return;

    const userIndex = findLastUserIndex(messages); // 기준이 되는 마지막 USER
    if (userIndex < 0) return;

    const scrollerEl = getScroller();
    const container = messageContentRef.current;
    if (!scrollerEl || !container) return;

    const tryMeasure = () => {
      const userEl = scrollerEl.querySelector(
        `[data-item-index="${userIndex}"]`
      ) as HTMLElement | null;

      if (userEl) {
        const userH = userEl.clientHeight; // USER 버블 실제 높이
        if (userH) {
          const diff = Math.max(0, container.clientHeight - userH); // 컨테이너와의 높이 차
          setLastDiffHeight(diff); // min-height로 사용
          return;
        }
      }
      requestAnimationFrame(tryMeasure); // 아직 마운트 전이면 다음 프레임 재시도
    };

    requestAnimationFrame(tryMeasure); // 첫 프레임 양보 후 측정 시작
  }, [messages, messageContentRef, setLastDiffHeight]);
};

export default useAutoScroll;
