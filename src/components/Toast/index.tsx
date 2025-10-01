'use client';
import styles from './Toast.module.css';
import { createPortal } from 'react-dom';
import { useToastStore } from '@/stores/useToastStore';
import { MdClose, MdCheckCircle, MdError, MdWarningAmber, MdInfo } from 'react-icons/md';

const icons = {
    success: <MdCheckCircle size={22} />,
    error: <MdError size={22} />,
    warning: <MdWarningAmber size={22} />,
    info: <MdInfo size={22} />,
} as const;

const prefixes = {
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Aviso',
    info: 'Informação',
} as const;

export default function Toast(): React.ReactElement | null {
    const toast = useToastStore((s) => s.toast);
    const progress = useToastStore((s) => s.progress);
    const hideToast = useToastStore((s) => s.hideToast);
    const isVisible = useToastStore((s) => s.isVisible);

    if (!isVisible || !toast) return null;

    const typeClass = {
        success: styles.toastSuccess,
        error: styles.toastError,
        warning: styles.toastWarning,
        info: styles.toastInfo,
    }[toast.type];

    const node = (
        <div className={`${styles.toastContainer} ${typeClass}`} role="status" aria-live="polite">
            <div className={styles.toastInner}>
                <div className={styles.iconWrapper}>{icons[toast.type]}</div>
                <div className={styles.textWrapper}>
                    <span className={styles.textLine}>
                        <strong>{prefixes[toast.type]}: </strong>
                        {toast.message}
                    </span>
                </div>
                <button className={styles.closeBtn} onClick={hideToast} aria-label="Fechar notificação">
                    <MdClose size={18} />
                </button>
            </div>
            <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );

    return createPortal(node, document.body);
}
