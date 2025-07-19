// A zustand store to manage theft alerts and book dialogs
import { create } from 'zustand';

interface StoreState {
  theftAlert: boolean; // Replace 'any' with your actual type
  setTheftAlert: (alert: boolean) => void;
  bookBorrowingDialogOpen: boolean;
  setBookBorrowingDialogOpen: (open: boolean) => void;
  bookId: string;
  setBookId: (id: string) => void;
  bookReturningDialogOpen: boolean;
  setBookReturningDialogOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  theftAlert: false,
  setTheftAlert: (alert) => set({ theftAlert: alert }),
  bookBorrowingDialogOpen: false,
  setBookBorrowingDialogOpen: (open) => set({ bookBorrowingDialogOpen: open }),
  bookId: '',
  setBookId: (id) => set({ bookId: id }),
  bookReturningDialogOpen: false,
  setBookReturningDialogOpen: (open) => set({ bookReturningDialogOpen: open }),
}));
