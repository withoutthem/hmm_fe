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
}

export interface TalkMessage {
  sender: Sender;
  type: MessageType;
  message?: string;
  images?: File[];
  streamingToken?: string;
  fallback?: boolean;
  isLoading?: boolean;
  adaptiveCardInfo?: IAdaptiveCard;
}

// user 메세지
export interface UserMessage {
  sender: 'user';
  type: 'message';
  message?: string;
  images?: File[];
}

// 1. 스토어의 전체 상태와 액션 타입을 한 번에 정의합니다.
interface MessageState {
  // Message
  images: File[] /** 입력한 이미지들 */;
  messages: TalkMessage[] /** 타임라인 (전체 교체만) */;

  // Actions
  setImages: (images: File[]) => void;
  setMessages: (updater: (prev: TalkMessage[]) => TalkMessage[]) => void;
}

// 2. create 함수 안에 모든 초기 상태와 액션을 정의합니다.
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
