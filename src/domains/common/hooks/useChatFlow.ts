import useMessageStore, {
  MessageType,
  RenderType,
  Sender,
  type TalkMessage,
} from '@domains/common/ui/store/message.store';
import { useCallback } from 'react';
import { simulateChatbotReply, type SimulateReplyOptions } from '@domains/test/simulateReply';

type SetMessagesFn = (updater: (prev: TalkMessage[]) => TalkMessage[]) => void;

export interface RunOptions {
  images?: File[];
  simulate?: boolean;
  simulateOptions?: SimulateReplyOptions;
}

const useChatFlow = () => {
  const setMessages = useMessageStore((s) => s.setMessages);

  const pushUser = useCallback(
    (message: string, images?: File[]) => {
      const userMsg: TalkMessage = {
        sender: Sender.USER,
        messageType: MessageType.MARKDOWN,
        ...(message ? { message } : {}),
        ...(images?.length ? { images } : {}),
      };
      setMessages((prev) => [...prev, userMsg]);
    },
    [setMessages]
  );

  const pushLoading = useCallback(() => {
    const loading: TalkMessage = {
      sender: Sender.CHATBOT,
      renderType: RenderType.LOADING,
      messageType: MessageType.MARKDOWN,
    };
    setMessages((prev) => [...prev, loading]);
  }, [setMessages]);

  const replaceLastLoading = useCallback(
    (talkMessage: TalkMessage) => {
      setMessages((prev) => {
        const nextList = [...prev];
        for (let i = nextList.length - 1; i >= 0; i--) {
          const m = nextList[i];
          const isLoading =
            m?.sender === Sender.CHATBOT &&
            (m.renderType ?? RenderType.NORMAL) === RenderType.LOADING;
          if (isLoading) {
            nextList[i] = talkMessage;
            return nextList;
          }
        }
        return prev;
      });
    },
    [setMessages]
  );

  const run = useCallback(
    (text: string, options: RunOptions = {}) => {
      const { images, simulate = true, simulateOptions } = options;
      pushUser(text, images);
      pushLoading();

      if (simulate) {
        simulateChatbotReply(setMessages as SetMessagesFn, {
          delayMs: simulateOptions?.delayMs ?? 1000,
          pickMode: simulateOptions?.pickMode ?? 'random',
        });
      }
    },
    [pushUser, pushLoading, setMessages]
  );

  return { run, pushUser, pushLoading, replaceLastLoading };
};

export default useChatFlow;
