// src/domains/common/components/composer/hooks/useSendMessage.ts
import { useCallback, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import useMessageStore, {
  MessageType,
  Sender,
  type TalkMessage,
} from '@domains/common/ui/store/message.store';
import type { UseFormHandleSubmit } from 'react-hook-form';
import type { ComposerFormValues } from '@domains/common/components/composer/Composer';

interface UseSendMessageOptions {
  getMessage: () => string;
  images: File[];
  clearForm: () => void;
  clearImages: () => void;
  afterSend?: () => void; // 예: 자동완성 clear
  handleSubmit?: UseFormHandleSubmit<ComposerFormValues>;
}

export const useSendMessage = ({
  getMessage,
  images,
  clearForm,
  clearImages,
  afterSend,
  handleSubmit,
}: UseSendMessageOptions) => {
  const setMessages = useMessageStore((s) => s.setMessages);

  // 엔터/버튼 더블 트리거 방지
  const sendingRef = useRef(false);

  const pushUserMessage = useCallback(
    (payload: { message?: string; images?: File[] }) => {
      const userMsg: TalkMessage = {
        sender: Sender.USER,
        type: MessageType.MESSAGE,
        ...(payload.message ? { message: payload.message } : {}),
        ...(payload.images?.length ? { images: payload.images } : {}),
      };
      setMessages((prev) => [...prev, userMsg]);
    },
    [setMessages]
  );

  const clearComposer = useCallback(() => {
    clearForm();
    clearImages();
    afterSend?.();
  }, [clearForm, clearImages, afterSend]);

  const doSend = useCallback(() => {
    if (sendingRef.current) return; // 중복 방지
    sendingRef.current = true;

    try {
      const trimmed = (getMessage() ?? '').trim();
      if (!trimmed && images.length === 0) return;

      pushUserMessage({ message: trimmed, images });
      clearComposer();
    } finally {
      // 다음 프레임에서 해제 (동시에 두 번 못 들어오게)
      requestAnimationFrame(() => {
        sendingRef.current = false;
      });
    }
  }, [getMessage, images, pushUserMessage, clearComposer]);

  /** 외부에서 직접 호출하는 전송 함수(버튼 클릭 등) */
  const send = useCallback(() => {
    if (handleSubmit) {
      // RHF validation 사용 시
      void handleSubmit(() => {
        doSend();
      })();
    } else {
      doSend();
    }
  }, [handleSubmit, doSend]);

  /** 자동완성 선택 시 전송 */
  const sendPicked = useCallback(
    (picked: string) => {
      if (!picked) return;
      if (sendingRef.current) return;
      sendingRef.current = true;

      try {
        pushUserMessage({ message: picked });
        clearComposer();
      } finally {
        requestAnimationFrame(() => {
          sendingRef.current = false;
        });
      }
    },
    [pushUserMessage, clearComposer]
  );

  /** 엔터 전송 핸들러(IME 조합 중에는 무시) */
  const onKeyDownEnterToSend = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      // IME 조합 중에는 전송 금지
      const native: KeyboardEvent = e.nativeEvent;
      if (native.isComposing) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return { send, sendPicked, onKeyDownEnterToSend };
};
