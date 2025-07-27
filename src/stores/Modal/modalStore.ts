import { create } from 'zustand';

type ModalOptions = {
    icon?: React.ReactNode;
    title: string;
    message: React.ReactNode;
    confirmLabel?: string;
    onConfirm?: () => Promise<void> | void;
};

type ModalStore = {
    isOpen: boolean;
    options: ModalOptions | null;
    openModal: (opts: ModalOptions) => void;
    closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    options: null,
    openModal: (opts) => set({ isOpen: true, options: opts }),
    closeModal: () => set({ isOpen: false, options: null }),
}));
