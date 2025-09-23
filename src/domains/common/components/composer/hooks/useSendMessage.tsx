import { useCallback, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { UseFormHandleSubmit } from 'react-hook-form';
import type { ComposerFormValues } from '@domains/common/components/composer/Composer';
import useChatFlow from '@domains/common/hooks/useChatFlow';

interface UseSendMessageOptions {
  // 메시지 가져오기
  getMessage: () => string;
  // 붙여넣은 이미지들
  images: File[];
  // 폼 초기화
  clearForm: () => void;
  // 이미지 초기화
  clearImages: () => void;
  // 전송 후 추가 후처리
  afterSend?: () => void;
  // RHF 유효성 검증용 핸들러
  handleSubmit?: UseFormHandleSubmit<ComposerFormValues>;
}

/**
 * useSendMessage
 * - 컴포저에서 전송 UX를 담당: 중복전송 방지, 폼/이미지 초기화, 자동완성 전송, IME 조합 Enter 무시.
 * - 실제 메시지 흐름(USER → LOADING → 응답)은 useChatFlow.run 한 줄로 트리거.
 * - 실서버 전환 시 run 내부만 교체하면 UI 로직 변경 없음.
 */
export const useSendMessage = ({
  getMessage,
  images,
  clearForm,
  clearImages,
  afterSend,
  handleSubmit,
}: UseSendMessageOptions) => {
  const { run } = useChatFlow(); // 메시지 흐름 실행 훅
  const sendingRef = useRef(false); // 중복 전송 잠금 플래그

  // 전송 후 입력/이미지/자동완성 상태 초기화하는 함수.
  const clearComposer = useCallback(() => {
    clearForm(); // 폼 초기화
    clearImages(); // 이미지 초기화
    afterSend?.(); // 추가 후처리
  }, [clearForm, clearImages, afterSend]);

  // 실제 전송을 수행하는 함수.
  const doSend = useCallback(() => {
    if (sendingRef.current) return;
    sendingRef.current = true; // 중복 방지 락
    try {
      const trimmed = (getMessage() ?? '').trim(); // 입력값 트림
      if (!trimmed && images.length === 0) return; // 공백 + 이미지 없음 → 전송 안 함

      run(trimmed, { images, simulate: true }); // USER → LOADING → simulate
      clearComposer(); // 전송 후 UI 초기화
    } finally {
      requestAnimationFrame(() => {
        sendingRef.current = false;
      }); // 다음 프레임에 락 해제
    }
  }, [getMessage, images, run, clearComposer]);

  // 외부에서 호출하는 전송 함수(버튼 클릭 등).
  const send = useCallback(async () => {
    if (handleSubmit) {
      void handleSubmit(async () => {
        doSend();
      })(); // RHF 유효성 검증 후 전송
    } else {
      doSend(); // 바로 전송
    }
  }, [handleSubmit, doSend]);

  // 자동완성 항목을 선택했을 때 즉시 전송하는 함수.
  const sendPicked = useCallback(
    async (picked: string) => {
      if (!picked) return;
      if (sendingRef.current) return;
      sendingRef.current = true; // 중복 방지
      try {
        run(picked, { simulate: true }); // 텍스트만 전송
        clearComposer(); // UI 초기화
      } finally {
        requestAnimationFrame(() => {
          sendingRef.current = false;
        }); // 락 해제
      }
    },
    [run, clearComposer]
  );

  // Enter 키로 전송하는 함수. (Shift+Enter는 줄바꿈, IME 조합 중이면 무시)
  const onKeyDownEnterToSend = useCallback(
    async (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const native: KeyboardEvent = e.nativeEvent;
      if (native.isComposing) return; // IME 조합 중 무시
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // 줄바꿈 방지
        await send(); // 전송
      }
    },
    [send]
  );

  return { send, sendPicked, onKeyDownEnterToSend };
};
