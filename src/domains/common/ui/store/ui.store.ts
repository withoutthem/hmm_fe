// src/domains/common/ui/ui.store.ts
import { create } from 'zustand'

// 1. 스토어의 전체 상태와 액션 타입을 한 번에 정의합니다.
interface UiState {
  // Message
  message: string

  // Actions
  setMessage: (msg: string) => void
}

// 2. create 함수 안에 모든 초기 상태와 액션을 정의합니다.
const useUIStore = create<UiState>((set) => ({
  // 초기 상태
  message: '',

  // 액션
  setMessage: (msg) => set({ message: msg }),
}))

export default useUIStore
