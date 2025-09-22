// simulateReply.ts

import { nextTestMessage, TEST_CASES, type PickMode } from '@domains/test/testRenderData';
import { RenderType, Sender, type TalkMessage } from '@domains/common/ui/store/message.store';

export interface SimulateReplyOptions {
  delayMs?: number; // 기본 1000ms
  pickMode?: PickMode | 'all'; // 'roundRobin' | 'random' | 'all'
}

// store의 setMessages 시그니처 그대로 반영
type SetMessagesFn = (updater: (prev: TalkMessage[]) => TalkMessage[]) => void;

/**
 * 마지막 CHATBOT LOADING 메시지를 테스트 데이터로 교체
 */
export function simulateChatbotReply(
  setMessages: SetMessagesFn,
  options: SimulateReplyOptions = {}
): number {
  const { delayMs = 1000, pickMode = 'roundRobin' } = options;

  return window.setTimeout(() => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;

      const newMsgs = [...prev];
      // 뒤에서부터 첫 번째 LOADING 메시지 탐색
      for (let i = newMsgs.length - 1; i >= 0; i--) {
        const m = newMsgs[i];
        const isLoading =
          m?.sender === Sender.CHATBOT &&
          (m.renderType ?? RenderType.NORMAL) === RenderType.LOADING;

        if (isLoading) {
          if (pickMode === 'all') {
            // LOADING 메시지를 전체 테스트 케이스로 교체
            newMsgs.splice(i, 1, ...TEST_CASES.map((fn) => fn()));
          } else {
            // 기존 로직: roundRobin / random
            newMsgs[i] = nextTestMessage(pickMode);
          }
          return newMsgs;
        }
      }
      return newMsgs;
    });
  }, delayMs);
}
