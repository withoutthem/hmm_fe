// src/domains/common/ui/ui.store.ts
import { create } from 'zustand';
import type { IAdaptiveCard } from 'adaptivecards';
import type {
  BUSINESS_TYPE,
  BusinessPayload,
} from '@domains/chatbot/components/chats/apiCaseBusinesses/types/businessType';

export enum Sender {
  USER = 'user',
  CHATBOT = 'chatbot',
}

export enum NodeType {
  CAROUSEL = 'carousel', // QuickButton 등 카드형 메시지
  SLOT = 'slot', // Custom Slot Payload 산출
  SPEAK = 'speak', // 한 대화 종료
}

// 1. RenderType (최상위 분기)
export enum RenderType {
  LOADING = 'loading',
  FALLBACK = 'fallback',
  NORMAL = 'normal',
}

// 2. MessageType
export enum MessageType {
  MARKDOWN = 'markdown',
  ADAPTIVE_CARD = 'adaptiveCard',
  JSON = 'json',
}

export interface TalkMessage {
  // 공통
  messageId?: string; // 서버 할당 ID
  sender: Sender; // USER / CHATBOT
  renderType?: RenderType; // UI 렌더링 타입 (LOADING, FALLBACK, NORMAL)
  nodeType?: NodeType; // 메시지 노드 타입 (CAROUSEL, SLOT, SPEAK)
  messageType: MessageType; // 메시지 포맷

  // 일반 메시지
  message?: string;
  streamingToken?: string;
  images?: File[];

  // AdaptiveCard
  adaptiveCardInfo?: IAdaptiveCard;

  // JSON 기반 비즈니스 메시지
  businessType?: BUSINESS_TYPE;
  payload?: BusinessPayload; // businessType에 따라 구조 달라짐
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
