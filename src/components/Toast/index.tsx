'use client';
import { createPortal } from 'react-dom';
import { useToastStore } from '@/stores/Toast/toastStore';
import styles from '@/components/Toast/Toast.module.css';

export default function Toast(): React.ReactElement | null {
    const toast = useToastStore((s) => s.toast);
    const isVisible = useToastStore((s) => s.isVisible);
    const progress = useToastStore((s) => s.progress);
    const hideToast = useToastStore((s) => s.hideToast);

    if (!isVisible || !toast) return null;

    const typeClass = {
        Success: styles.toastSuccess,
        Alert: styles.toastAlert,
        Error: styles.toastError,
    }[toast.type];

    const toastNode = (
        <div className={`${styles.toastContainer} ${typeClass}`}>
            <div className={styles.toastProgress}>
                <div
                    className={styles.toastProgressBar}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className={styles.toastMessage}>{toast.message}</div>
            <button className={styles.toastClose} onClick={hideToast} aria-label="Fechar toast">❌</button>
        </div>
    );

    return createPortal(toastNode, document.body);
}
