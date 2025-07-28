import { createPortal } from 'react-dom';
import ButtonRay from '../Buttons/ButtonRay';
import { TbAlertTriangleFilled } from 'react-icons/tb';
import { useModalStore } from '@/stores/useModalStore';
import { useCallback, useEffect, useState } from 'react';
import styles from '@/components/Modal/Modal.module.css';

export default function Modal(): React.ReactElement | null {
    const isOpen = useModalStore((s) => s.isOpen);
    const opts = useModalStore((s) => s.options);
    const close = useModalStore((s) => s.closeModal);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleConfirm = useCallback(async () => {
        setErrorMessage(null);
        try {
            if (opts?.onConfirm) {
                await opts.onConfirm();
            }
            close();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setErrorMessage(msg);
        }
    }, [opts, close]);

    useEffect(() => { if (!isOpen) setErrorMessage(null) }, [isOpen]);

    const handleClose = useCallback(() => {
        setErrorMessage(null);
        close();
    }, [close]);

    if (!isOpen || !opts) return null;

    return createPortal(
        <div className={styles.modalContainer}>
            <section className={styles.modalSection}>
                <div className={styles.modalDiv} onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirm() } }}>
                    <button className={styles.modalClose} aria-label="Fechar modal" onClick={handleClose}>❌</button>
                    {opts.icon && (
                        <div className={styles.modalIcon}>
                            {opts.icon}
                        </div>
                    )}
                    <h2 className={styles.modalTitle}>{opts.title}</h2>
                    <div className={styles.modalMessage}>{opts.message}</div>
                    {errorMessage && (
                        <div className={styles.modalError}>
                            <p className={styles.errorMessage}><TbAlertTriangleFilled /> {errorMessage}</p>
                        </div>
                    )}
                    <ButtonRay text={opts.confirmLabel ?? 'Confirmar'} type='submit' onClick={handleConfirm} />
                </div>
            </section>
        </div>,
        document.body
    );
}
