import { create } from 'zustand';

type ToastType = 'Success' | 'Alert' | 'Error';

type Toast = {
    message: string;
    type: ToastType;
};

type ToastStore = {
    toast: Toast | null;
    isVisible: boolean;
    progress: number;
    showToast: (toast: Toast) => void;
    hideToast: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
    toast: null,
    isVisible: false,
    progress: 0,
    showToast: (toast) => {
        const duration = 5000;
        set({ toast, isVisible: true, progress: 0 });

        const interval = setInterval(() => {
            set((state) => ({
                progress: Math.min(state.progress + 100 / (duration / 100), 100),
            }));
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            set({ isVisible: false, toast: null, progress: 0 });
        }, duration);
    },
    hideToast: () => set({ isVisible: false, toast: null, progress: 0 }),
}));
