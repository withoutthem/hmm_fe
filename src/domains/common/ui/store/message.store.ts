// src/domains/common/ui/ui.store.ts
import { create } from 'zustand';

export type ChatMessage = UserMessage | ChatbotMessage | ChatbotLoading;

// user 메세지
export interface UserMessage {
  sender: 'user';
  type: 'message';
  message?: string;
  images?: File[];
}

// chatbot 정상 메시지
export interface ChatbotMessage {
  sender: 'chatbot';
  type: 'message' | 'adaptiveCard';
  tokens: string[];
  fallback?: false;
}

export interface ChatbotLoading {
  sender: 'chatbot';
  type: 'loading';
}

// 1. 스토어의 전체 상태와 액션 타입을 한 번에 정의합니다.
interface MessageState {
  // Message
  message: string /** 입력한 message들 */;
  images: File[] /** 입력한 이미지들 */;
  messages: ChatMessage[] /** 타임라인 (전체 교체만) */;

  // Actions
  setMessage: (msg: string) => void;
  setImages: (images: File[]) => void;
  setMessages: (updater: ((prev: ChatMessage[]) => ChatMessage[]) | ChatMessage[]) => void;
}

// 2. create 함수 안에 모든 초기 상태와 액션을 정의합니다.
const useMessageStore = create<MessageState>((set) => ({
  // 초기 상태
  message: '',
  images: [],
  messages: [],

  // 액션
  setMessage: (msg) => set({ message: msg }),
  setImages: (images) => set({ images }),
  setMessages: (updater) =>
    set((state) => ({
      messages: typeof updater === 'function' ? updater(state.messages) : updater,
    })),
}));

export default useMessageStore;
