// ui.dialog.store.ts
import { create } from 'zustand'

interface DialogState {
  open: boolean
  type: string
  openDialog: (type: string) => void
  closeDialog: () => void
}

const useDialogStore = create<DialogState>((set) => ({
  open: false,
  type: '',
  openDialog: (type) => set({ open: true, type }),
  closeDialog: () => set({ open: false, type: '' }),
}))

export default useDialogStore
