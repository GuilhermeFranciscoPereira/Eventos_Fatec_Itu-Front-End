import Loader from '../Loader';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import Button from '@/components/Buttons/Button';
import { TbAlertTriangleFilled } from 'react-icons/tb';
import { useModalStore } from '@/stores/useModalStore';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from '@/components/Modal/Modal.module.css';

export default function Modal(): React.ReactElement | null {
    const titleId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);
    const isOpen = useModalStore((s) => s.isOpen);
    const opts = useModalStore((s) => s.options);
    const close = useModalStore((s) => s.closeModal);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleConfirm = useCallback(async () => {
        setErrorMessage(null);
        setLoading(true);
        try {
            if (opts?.onConfirm) {
                await opts.onConfirm();
            }
            close();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    }, [opts, close]);

    useEffect(() => { if (!isOpen) setErrorMessage(null) }, [isOpen]);

    const handleClose = useCallback(() => {
        setErrorMessage(null);
        close();
    }, [close]);

    useEffect(() => {
        if (!isOpen) return;
        const previousFocus = document.activeElement as HTMLElement | null;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const timer = window.setTimeout(() => {
            const firstField = dialogRef.current?.querySelector<HTMLElement>('input:not([type=hidden]):not([disabled]), textarea, select');
            (firstField ?? dialogRef.current)?.focus();
        }, 30);

        function onKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape' && !event.defaultPrevented) handleClose();
        }
        document.addEventListener('keydown', onKeyDown);

        return () => {
            window.clearTimeout(timer);
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = originalOverflow;
            previousFocus?.focus?.();
        };
    }, [isOpen, handleClose]);

    if (!isOpen || !opts) return null;

    return createPortal(
        <div className={styles.modalContainer}>
            {loading && <Loader />}
            <section className={styles.modalSection} onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
                <div
                    ref={dialogRef}
                    className={styles.modalDiv}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        const target = e.target as HTMLElement;
                        if (e.key === 'Enter' && target.tagName !== 'TEXTAREA' && target.tagName !== 'BUTTON') { e.preventDefault(); handleConfirm() }
                    }}
                >
                    <header className={styles.modalHeader}>
                        {opts.icon && <span className={styles.modalIcon} aria-hidden>{opts.icon}</span>}
                        <h2 id={titleId} className={styles.modalTitle}>{opts.title}</h2>
                        <button type="button" className={styles.modalClose} aria-label="Fechar" onClick={handleClose}>
                            <IoClose aria-hidden />
                        </button>
                    </header>

                    <div className={styles.modalMessage}>{opts.message}</div>

                    {errorMessage && (
                        <div className={styles.modalError} role="alert">
                            <TbAlertTriangleFilled aria-hidden />
                            <p className={styles.errorMessage}>{errorMessage}</p>
                        </div>
                    )}

                    <footer className={styles.modalFooter}>
                        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" onClick={handleConfirm} disabled={loading}>
                            {opts.confirmLabel ?? 'Confirmar'}
                        </Button>
                    </footer>
                </div>
            </section>
        </div>,
        document.body
    );
}
