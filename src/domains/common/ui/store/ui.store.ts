// src/domains/common/ui/ui.store.ts
import { create } from 'zustand'

export type Sender = 'user' | 'chatbot'
export type MessageType = 'message' | 'fallback'

export type ChatMessage =
  // sender가 user일때는 message 또는 images 중 하나 이상은 있어야 함
  | { id: number; sender: 'user'; type: 'message'; message?: string; images?: File[] }
  // sender가 chatbot일때 type이 message이면 tokens가 반드시 있어야 함
  | { id: number; sender: 'chatbot'; type: 'message'; tokens: string[] }
  // sender가 chatbot일때 type이 fallback이면 tokens 없음
  | { id: number; sender: 'chatbot'; type: 'fallback' }

// 1. 스토어의 전체 상태와 액션 타입을 한 번에 정의합니다.
interface UiState {
  // Message
  message: string /** 입력한 message들 */
  images: File[] /** 입력한 이미지들 */
  messages: ChatMessage[] /** 타임라인 (전체 교체만) */

  // Actions
  setMessage: (msg: string) => void
  setImages: (images: File[]) => void
  setMessages: (messages: ChatMessage[]) => void
}

// 2. create 함수 안에 모든 초기 상태와 액션을 정의합니다.
const useUIStore = create<UiState>((set) => ({
  // 초기 상태
  message: '',
  images: [],
  messages: [],

  // 액션
  setMessage: (msg) => set({ message: msg }),
  setImages: (images) => set({ images }),
  setMessages: (messages) => set({ messages }),
}))

export default useUIStore
