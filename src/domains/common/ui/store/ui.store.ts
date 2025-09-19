// src/domains/common/ui/ui.store.ts
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMenuOpen: null | HTMLElement;

  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (el: HTMLElement | null) => void;
}

// 2. create 함수 안에 모든 초기 상태와 액션을 정의합니다.
const useUIStore = create<UIState>((set) => ({
  // 초기 상태
  isSidebarOpen: false,
  isMenuOpen: null,

  // 액션
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setIsMenuOpen: (el) => set({ isMenuOpen: el }),
}));

export default useUIStore;
