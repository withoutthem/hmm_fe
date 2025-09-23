import useMessageStore, {
  MessageType,
  RenderType,
  Sender,
  type TalkMessage,
} from '@domains/common/ui/store/message.store';
import { useCallback } from 'react';
import { simulateChatbotReply, type SimulateReplyOptions } from '@domains/test/simulateReply';

// setMessages(prev => next) 시그니처 재사용용 타입
type SetMessagesFn = (updater: (prev: TalkMessage[]) => TalkMessage[]) => void;

// 실행 옵션들
export interface RunOptions {
  images?: File[]; // 사용자 발화와 함께 보낼 이미지 배열
  simulate?: boolean; // 시뮬레이터 사용 여부(테스트/데모 목적)
  simulateOptions?: SimulateReplyOptions; // 시뮬레이터 세부 옵션 (delay, pickMode)
}

/**
 * useChatFlow
 * - "메시지 타임라인"만 책임지는 경량 훅.
 * - 역할: USER 메시지 push → LOADING push → (시뮬레이터 or 실서버 응답으로 LOADING 교체)
 * - 비역할: 스크롤/레이아웃/가상화 제어 (모두 별도 훅/컴포넌트에서 담당)
 *
 * 반환:
 * - run(text, options): 한 번의 대화 플로우 실행(사용자 발화 → 로딩 → 교체/시뮬레이트)
 * - pushUser(message, images?): 사용자 메시지만 단독 추가
 * - pushLoading(): 챗봇 LOADING 메시지 추가
 * - replaceLastLoading(next): 가장 최근 LOADING을 실제 챗봇 응답으로 치환
 *
 * 사용 예:
 *   const { run } = useChatFlow();
 *   run('안녕', { simulate: true });
 *
 * 실서버 연동:
 *   - run 내부의 simulateChatbotReply 대신 서버 API 호출 후 replaceLastLoading(...) 호출
 *   - 메시지 ID/메타데이터가 필요하면 TalkMessage 확장해서 채워 넣기
 */
const useChatFlow = () => {
  const setMessages = useMessageStore((s) => s.setMessages);

  // 사용자 메시지를 타임라인 끝에 추가하는 함수.
  const pushUser = useCallback(
    (message: string, images?: File[]) => {
      const userMsg: TalkMessage = {
        sender: Sender.USER,
        messageType: MessageType.MARKDOWN,
        ...(message ? { message } : {}),
        ...(images?.length ? { images } : {}),
      };
      setMessages((prev) => [...prev, userMsg]); // 끝에 USER 메시지 추가
    },
    [setMessages]
  );

  // 챗봇 LOADING 메시지를 타임라인 끝에 추가하는 함수.
  const pushLoading = useCallback(() => {
    const loading: TalkMessage = {
      sender: Sender.CHATBOT,
      renderType: RenderType.LOADING,
      messageType: MessageType.MARKDOWN,
    };
    setMessages((prev) => [...prev, loading]); // 끝에 LOADING 추가
  }, [setMessages]);

  // 최근 LOADING 메시지를 찾아 실제 챗봇 응답으로 교체하는 함수.
  const replaceLastLoading = useCallback(
    (talkMessage: TalkMessage) => {
      setMessages((prev) => {
        const nextList = [...prev];
        for (let i = nextList.length - 1; i >= 0; i--) {
          const m = nextList[i];
          const isLoading =
            m?.sender === Sender.CHATBOT &&
            (m.renderType ?? RenderType.NORMAL) === RenderType.LOADING; // LOADING 판별
          if (isLoading) {
            nextList[i] = talkMessage; // 해당 LOADING을 실제 응답으로 교체
            return nextList;
          }
        }
        return prev; // LOADING이 없으면 변경 없음(안전 가드)
      });
    },
    [setMessages]
  );

  // USER → LOADING → (simulate | 서버응답 교체)까지 한 번에 수행하는 함수.
  const run = useCallback(
    (text: string, options: RunOptions = {}) => {
      const { images, simulate = true, simulateOptions } = options;

      pushUser(text, images); // 사용자 메시지 추가
      pushLoading(); // 챗봇 LOADING 추가

      if (simulate) {
        // 테스트/데모: 시뮬레이터가 "가장 최근 LOADING"을 찾아 알맞은 더미 응답으로 교체
        simulateChatbotReply(setMessages as SetMessagesFn, {
          delayMs: simulateOptions?.delayMs ?? 1000, // 기본 1초 지연
          pickMode: simulateOptions?.pickMode ?? 'random', // 기본 랜덤 케이스
        });
      }
      // 실서버라면:
      // 1) 여기서 서버에 text/images 전송
      // 2) 응답 수신 후 replaceLastLoading({ ...응답을 TalkMessage로 }) 호출
    },
    [pushUser, pushLoading, setMessages]
  );

  return { run, pushUser, pushLoading, replaceLastLoading };
};

export default useChatFlow;
