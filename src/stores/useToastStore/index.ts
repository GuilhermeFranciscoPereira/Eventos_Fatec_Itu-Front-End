import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastData = {
    message: string;
    type: ToastType;
    durationMs?: number;
};

type ToastStore = {
    toast: ToastData | null;
    isVisible: boolean;
    progress: number;
    showToast: (toast: ToastData) => void;
    hideToast: () => void;
    _intervalId: number | null;
    _timeoutId: number | null;
};

export const useToastStore = create<ToastStore>((set, get) => ({
    toast: null,
    isVisible: false,
    progress: 0,
    _intervalId: null,
    _timeoutId: null,
    showToast: (toast) => {
        const duration = toast.durationMs && toast.durationMs > 0 ? toast.durationMs : 5000;
        const { _intervalId, _timeoutId } = get();
        if (_intervalId) clearInterval(_intervalId);
        if (_timeoutId) clearTimeout(_timeoutId);

        set({ toast, isVisible: true, progress: 0, _intervalId: null, _timeoutId: null });

        const step = 100 / (duration / 100);
        const iid = window.setInterval(() => {
            set((s) => {
                const next = s.progress + step;
                return { progress: next >= 100 ? 100 : next };
            });
        }, 100);

        const tid = window.setTimeout(() => {
            clearInterval(iid);
            set({ isVisible: false, toast: null, progress: 0, _intervalId: null, _timeoutId: null });
        }, duration);

        set({ _intervalId: iid, _timeoutId: tid });
    },
    hideToast: () => {
        const { _intervalId, _timeoutId } = get();
        if (_intervalId) clearInterval(_intervalId);
        if (_timeoutId) clearTimeout(_timeoutId);
        set({ isVisible: false, toast: null, progress: 0, _intervalId: null, _timeoutId: null });
    },
}));
