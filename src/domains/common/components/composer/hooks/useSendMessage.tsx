import { useCallback, type KeyboardEvent } from 'react';
import useMessageStore, {
  MessageType,
  Sender,
  type TalkMessage,
} from '@domains/common/ui/store/message.store';

interface UseSendMessageOptions {
  getMessage: () => string;
  images: File[];
  clearForm: () => void;
  clearImages: () => void;
  afterSend?: () => void; // 예: 자동완성 clear
}

export const useSendMessage = ({
  getMessage,
  images,
  clearForm,
  clearImages,
  afterSend,
}: UseSendMessageOptions) => {
  const setMessages = useMessageStore((s) => s.setMessages);

  const pushUserMessage = useCallback(
    (payload: { message: string; images?: File[] }) => {
      if (payload.message.length === 0) return; // 빈 메시지 방지

      const userMsg: TalkMessage = {
        sender: Sender.USER,
        type: MessageType.MESSAGE,
        message: payload.message,
        ...(payload.images?.length ? { images: payload.images } : {}),
      };
      setMessages((prev: TalkMessage[]) => [...prev, userMsg]);
    },
    [setMessages]
  );

  const clearComposer = useCallback(() => {
    clearForm();
    clearImages();
    afterSend?.();
  }, [clearForm, clearImages, afterSend]);

  // 일반 메시지 전송
  const send = useCallback(() => {
    const trimmed = getMessage().trim();
    if (!trimmed && images.length === 0) return;
    pushUserMessage({ message: trimmed, images });
    clearComposer();
  }, [getMessage, images, pushUserMessage, clearComposer]);

  // 자동완성 선택 시 전송
  const sendPicked = useCallback(
    (picked: string) => {
      if (!picked) return;
      pushUserMessage({ message: picked });
      clearComposer();
    },
    [pushUserMessage, clearComposer]
  );

  // 엔터 전송 핸들러
  const onKeyDownEnterToSend = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return { send, sendPicked, onKeyDownEnterToSend };
};
