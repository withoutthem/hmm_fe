import { useCallback, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { UseFormHandleSubmit } from 'react-hook-form';
import type { ComposerFormValues } from '@domains/common/components/composer/Composer';
import useChatFlow from '@domains/common/hooks/useChatFlow';

interface UseSendMessageOptions {
  getMessage: () => string;
  images: File[];
  clearForm: () => void;
  clearImages: () => void;
  afterSend?: () => void;
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
  const { run } = useChatFlow();
  const sendingRef = useRef(false);

  const clearComposer = useCallback(() => {
    clearForm();
    clearImages();
    afterSend?.();
  }, [clearForm, clearImages, afterSend]);

  const doSend = useCallback(() => {
    if (sendingRef.current) return;
    sendingRef.current = true;

    try {
      const trimmed = (getMessage() ?? '').trim();
      if (!trimmed && images.length === 0) return;

      run(trimmed, { images, simulate: true }); // USER → LOADING → simulate
      clearComposer();
    } finally {
      requestAnimationFrame(() => {
        sendingRef.current = false;
      });
    }
  }, [getMessage, images, run, clearComposer]);

  const send = useCallback(async () => {
    if (handleSubmit) {
      void handleSubmit(async () => {
        doSend();
      })();
    } else {
      doSend();
    }
  }, [handleSubmit, doSend]);

  const sendPicked = useCallback(
    async (picked: string) => {
      if (!picked) return;
      if (sendingRef.current) return;
      sendingRef.current = true;

      try {
        run(picked, { simulate: true });
        clearComposer();
      } finally {
        requestAnimationFrame(() => {
          sendingRef.current = false;
        });
      }
    },
    [run, clearComposer]
  );

  const onKeyDownEnterToSend = useCallback(
    async (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const native: KeyboardEvent = e.nativeEvent;
      if (native.isComposing) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        await send();
      }
    },
    [send]
  );

  return { send, sendPicked, onKeyDownEnterToSend };
};
