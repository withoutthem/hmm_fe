// src/domains/common/ui/ui.store.ts
import { create } from 'zustand';
import type { IAdaptiveCard } from 'adaptivecards';

export enum Sender {
  USER = 'user',
  CHATBOT = 'chatbot',
}

export enum MessageType {
  MESSAGE = 'message',
  ADAPTIVE_CARD = 'adaptiveCard',
  FALLBACK = 'fallback',
}

export interface TalkMessage {
  messageId?: string; // 서버 할당 ID
  sender: Sender;
  type: MessageType;
  message?: string;
  images?: File[];
  streamingToken?: string;
  // fallback?: boolean;
  isLoading?: boolean;
  adaptiveCardInfo?: IAdaptiveCard;
}

interface MessageState {
  // Message
  images: File[] /** 입력한 이미지들 */;
  messages: TalkMessage[] /** 타임라인 (전체 교체만) */;

  // Actions
  setImages: (images: File[]) => void;
  setMessages: (updater: (prev: TalkMessage[]) => TalkMessage[]) => void;
}

const useMessageStore = create<MessageState>((set) => ({
  // 초기 상태
  images: [],
  messages: [],

  // 액션
  setImages: (images) => set({ images }),
  setMessages: (updater) =>
    set((state) => ({
      messages: typeof updater === 'function' ? updater(state.messages) : updater,
    })),
}));

export default useMessageStore;
