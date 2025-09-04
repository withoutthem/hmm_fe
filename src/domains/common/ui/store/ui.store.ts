// src/domains/common/ui/ui.store.ts
import { create } from 'zustand'

export type Sender = 'user' | 'chatbot'

export type ChatMessage =
  | { id: number; sender: 'user'; message?: string; images?: File[] }
  | { id: number; sender: 'chatbot'; tokens: string[] }

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
