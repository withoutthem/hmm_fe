// ui.dialog.store.ts
import { create } from 'zustand';

interface DialogState {
  open: boolean;
  type: DialogType | null;
  openDialog: (type: DialogType) => void;
  closeDialog: () => void;
}

export enum DialogType {
  HISTORY = 'history',
}

const useDialogStore = create<DialogState>((set) => ({
  open: false,
  type: null,
  openDialog: (type) => set({ open: true, type }),
  closeDialog: () => set({ open: false, type: null }),
}));

export default useDialogStore;
