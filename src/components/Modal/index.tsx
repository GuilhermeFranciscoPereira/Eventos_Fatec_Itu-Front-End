'use client';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import ButtonRay from '../Buttons/ButtonRay';
import styles from '@/components/Modal/Modal.module.css';
import { useModalStore } from '@/stores/Modal/modalStore';

export default function Modal(): React.ReactElement | null {
    const isOpen = useModalStore((s) => s.isOpen);
    const opts = useModalStore((s) => s.options);
    const close = useModalStore((s) => s.closeModal);

    const handleConfirm = useCallback(async () => {
        if (opts?.onConfirm) {
            await opts.onConfirm();
        }
        close();
    }, [opts, close]);

    if (!isOpen || !opts) return null;

    return createPortal(
        <div className={styles.modalContainer}>
            <section className={styles.modalSection}>
                <div className={styles.modalDiv}>
                    <button className={styles.modalClose} aria-label="Fechar modal" onClick={close}>❌</button>
                    {opts.icon && (
                        <div className={styles.modalIcon}>
                            {opts.icon}
                        </div>
                    )}
                    <h2 className={styles.modalTitle}>{opts.title}</h2>
                    <div className={styles.modalMessage}>{opts.message}</div>
                    <ButtonRay text={opts.confirmLabel ?? 'Confirmar'} type='button' onClick={handleConfirm} />
                </div>
            </section>
        </div>,
        document.body
    );
}
