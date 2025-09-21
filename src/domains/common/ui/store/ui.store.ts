// src/domains/common/ui/ui.store.ts
import { create } from 'zustand';

// BottomSheet의 종류를 enum으로 정의
export enum BottomSheetType {
  LANGUAGE = 'LANGUAGE',
}

interface UIState {
  isSidebarOpen: boolean;
  isMenuOpen: null | HTMLElement;
  isBottomSheetOpen: boolean; // true/false
  bottomSheetType: BottomSheetType | null; // 어떤 시트인지

  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (el: HTMLElement | null) => void;
  setBottomSheetOpen: (type: BottomSheetType | null) => void;
  closeBottomSheet: () => void;
}

const useUIStore = create<UIState>((set) => ({
  // 초기 상태
  isSidebarOpen: false,
  isMenuOpen: null,
  isBottomSheetOpen: false,
  bottomSheetType: null,

  // 액션
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setIsMenuOpen: (el) => set({ isMenuOpen: el }),
  setBottomSheetOpen: (type) => set({ isBottomSheetOpen: !!type, bottomSheetType: type }),

  closeBottomSheet: () => set({ isBottomSheetOpen: false, bottomSheetType: null }),
}));

export default useUIStore;
