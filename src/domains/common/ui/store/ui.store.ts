// src/domains/common/ui/ui.store.ts
import { create } from 'zustand';

// BottomSheet의 종류를 enum으로 정의
export enum BottomSheetType {
  QUOTATION = 'QUOTATION',
}

export enum SelectBottomSheetType {
  LANGUAGE = 'LANGUAGE',
}

// Modal 종류를 enum으로 정의
export enum ModalType {
  TESTALERT = 'TESTALERT',
  TESTCONFIRM = 'TESTCONFIRM',
  TESTHEADERCONFIRM = 'TESTHEADERCONFIRM',
}

interface UIState {
  isSidebarOpen: boolean;
  isMenuOpen: null | HTMLElement;
  isBottomSheetOpen: boolean; // true/false
  bottomSheetType: BottomSheetType | null; // 어떤 시트인지
  toastMessage?: string | null; // 토스트 메시지
  toastType?: 'success' | 'error' | 'warning' | null; // 토스트 타입
  isToastOpen?: boolean; // 토스트 오픈 여부
  isModalOpen?: boolean; // 모달 오픈 여부
  modalType?: ModalType | null; // 어떤 모달인지

  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (el: HTMLElement | null) => void;
  setBottomSheetOpen: (type: BottomSheetType | null) => void;
  closeBottomSheet: () => void;
  setToastOpen: (toastMessage: string, toastType?: 'success' | 'error' | 'warning') => void;
  setToastClose: () => void;
  setModalOpen?: (modalType: ModalType | null) => void;
  setModalClose?: () => void;
}

const useUIStore = create<UIState>((set) => ({
  // 초기 상태
  isSidebarOpen: false,
  isMenuOpen: null,
  isBottomSheetOpen: false,
  bottomSheetType: null,
  toastMessage: null,
  toastType: null,
  isToastOpen: false,
  isModalOpen: false,
  modalType: null,

  // 액션
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  setIsMenuOpen: (el) => set({ isMenuOpen: el }),
  setBottomSheetOpen: (type) =>
    set({
      isBottomSheetOpen: !!type,
      bottomSheetType: type,
    }),

  closeBottomSheet: () =>
    set({
      isBottomSheetOpen: false,
      bottomSheetType: null,
    }),

  setToastOpen: (toastMessage, toastType) =>
    set(() => ({
      isToastOpen: true,
      toastMessage,
      toastType: toastType ?? null,
    })),
  setToastClose: () =>
    set({
      isToastOpen: false,
      toastMessage: null,
      toastType: null,
    }),

  setModalOpen: (modalType) =>
    set({
      isModalOpen: !!modalType,
      modalType: modalType,
    }),
  setModalClose: () =>
    set({
      isModalOpen: false,
      modalType: null,
    }),
}));

export default useUIStore;
