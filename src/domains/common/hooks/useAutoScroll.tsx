// src/domains/common/hooks/useAutoScroll.ts
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import useMessageStore, {
  MessageType,
  RenderType,
  Sender,
  type TalkMessage,
} from '@domains/common/ui/store/message.store';
import { alignItemToTop, getScroller } from '@domains/common/utils/utils';
import { simulateChatbotReply } from '@domains/test/simulateReply';

interface UseAutoScrollProps {
  messageContentRef: RefObject<HTMLDivElement | null>;
  setLastDiffHeight: Dispatch<SetStateAction<number | null>>;
}

/** 스크롤러가 현재 바닥 근처인지 체크(버튼 노출용 판단은 Virtuoso의 atBottomStateChange 사용) */
const isNearBottom = (el: HTMLElement, threshold = 48) =>
  el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;

const useAutoScroll = (props: UseAutoScrollProps) => {
  const messages = useMessageStore((s) => s.messages);
  const setMessages = useMessageStore((s) => s.setMessages);

  /**
   * “사용자 메시지 1회 정렬” 보장용 플래그:
   * - 어떤 위치(최상단/중단/최하단)에서든 내가 발화하면 "내 버블이 우측 최상단"에 오도록 딱 한 번만 점프
   * - 이후 들어오는 챗봇 메시지에 대해서는 절대 자동 스크롤하지 않음 (스크롤 영역만 늘어남)
   */
  const lockedAfterUserRef = useRef(false);
  const lastHandledUserIndexRef = useRef<number | null>(null);

  /**
   * ① 사용자 메시지 추가 시:
   *   - 마지막 인덱스(=방금 사용자 버블)를 최상단 정렬(애니메이션 없이 점프)
   *   - lockedAfterUserRef = true → 이후 챗봇 메시지에는 자동 스크롤 금지
   *   - LOADING 추가 + 모킹 응답 주입 (scroll은 하지 않음)
   */
  useEffect(() => {
    if (messages.length === 0) return;

    const lastIndex = messages.length - 1;
    const last = messages[lastIndex] as TalkMessage;

    // 같은 USER 메시지를 중복 처리하는 걸 방지
    if (last?.sender !== Sender.USER) return;
    if (lastHandledUserIndexRef.current === lastIndex) return;

    lastHandledUserIndexRef.current = lastIndex;

    // 1) 내 메시지를 스크롤러 최상단에 "한 번만" 붙이기 (점프, no-anim)
    void (async () => {
      await alignItemToTop(lastIndex);
      // 2) 이후 챗봇 메시지에 대해서 자동 스크롤 금지
      lockedAfterUserRef.current = true;

      // 3) LOADING 추가
      const loadingMsg: TalkMessage = {
        sender: Sender.CHATBOT,
        renderType: RenderType.LOADING,
        messageType: MessageType.MARKDOWN,
      };
      setMessages((prev) => [...prev, loadingMsg]);

      // 4) 모킹 응답 주입 (all|random|roundRobin 아무거나 테스트)
      simulateChatbotReply(setMessages, {
        delayMs: 1000,
        pickMode: 'random',
      });
    })();
  }, [messages, setMessages]);

  /**
   * ② 챗봇 메시지 추가 시:
   *   - lockedAfterUserRef === true 이면 "아무 스크롤도 하지 않음" (스크롤 영역만 늘어나게)
   *   - lockedAfterUserRef === false 인 상황(원치 않으시면 그냥 무시 가능)에서도 기본적으로 아무것도 안 함
   *   - 이후 “유저가 직접 바닥까지 스크롤”하면 Virtuoso의 atBottom 버튼으로 컨트롤
   */
  // 일부러 아무것도 안 함

  /**
   * ③ 마지막 USER 버블 높이 차 계산 (ChatbotItemWrapper min-height 계산에 사용)
   *   - 사용자가 보낸 "마지막 USER 메시지"의 실제 높이를 기준으로 컨테이너와 차이를 저장
   *   - 이렇게 해야 이후 챗봇 버블이 렌더되며 아래로 늘어나도,
   *     내 버블이 화면 최상단에 고정된 듯한 레이아웃이 유지(스크롤은 늘어날 뿐)
   */
  useLayoutEffect(() => {
    if (messages.length === 0) return;

    const lastIndex = messages.length - 1;
    const lastMessage = messages[lastIndex];
    if (lastMessage?.sender !== Sender.USER) return;

    const scrollerEl = getScroller();
    if (!scrollerEl || !props.messageContentRef.current) return;

    const tryMeasure = () => {
      const targetEl = scrollerEl.querySelector(
        `[data-item-index="${lastIndex}"]`
      ) as HTMLElement | null;

      if (targetEl) {
        const size = targetEl.clientHeight;
        if (size && props.messageContentRef?.current) {
          const containerH = props.messageContentRef?.current.clientHeight - size;
          props.setLastDiffHeight(containerH);
          return;
        }
      }
      // 가상화로 아직 안 붙었으면 다음 프레임 재시도
      requestAnimationFrame(tryMeasure);
    };

    requestAnimationFrame(tryMeasure);
  }, [messages, props]);

  /**
   * ④ 유저가 스크롤을 직접 움직여서 "완전히 바닥에 도달"했을 때 잠금 해제하고 싶으면 아래 주석 해제
   *    (선택사항) — 지금 요구사항으론 “다음 유저 발화까지 금지”가 더 ChatGPT에 가깝습니다.
   */
  // useEffect(() => {
  //   const scroller = getScroller();
  //   if (!scroller) return;
  //   const onScroll = () => {
  //     if (isNearBottom(scroller)) {
  //       lockedAfterUserRef.current = false;
  //     }
  //   };
  //   scroller.addEventListener('scroll', onScroll, { passive: true });
  //   return () => scroller.removeEventListener('scroll', onScroll);
  // }, []);
};

export default useAutoScroll;
