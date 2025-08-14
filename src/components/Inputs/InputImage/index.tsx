'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { IoMdImages } from 'react-icons/io';
import ImageCloudinary from '@/components/ImageCloudinary';
import { FiUpload, FiTrash2, FiCamera } from 'react-icons/fi';
import styles from '@/components/Inputs/InputImage/InputImage.module.css';

type InputImageProps = {
    initialUrl?: string | null;
    onChange?: (file: File | null, previewUrl: string | null) => void;
    accept?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
};

export default function InputImage({ initialUrl = null, onChange, accept = 'image/*', disabled = false, id = 'input-image', className }: InputImageProps): React.ReactElement {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [hasDraggedOver, setHasDraggedOver] = useState<boolean>(false);
    const currentUrl: string | null = previewUrl ?? initialUrl ?? null;
    const canRemove: boolean = Boolean(previewUrl);

    function isValidImage(file: File | undefined): file is File {
        return !!file && file.type.startsWith('image/');
    }

    function handleFile(file: File | null): void {
        if (!file) {
            setPreviewUrl(null);
            onChange?.(null, null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onChange?.(file, url);
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const file = e.target.files?.[0] ?? null;
        handleFile(file);
    }

    function onDrop(e: React.DragEvent<HTMLElement>): void {
        e.preventDefault();
        setHasDraggedOver(false);
        if (disabled) return;
        const file = e.dataTransfer.files?.[0];
        if (isValidImage(file)) handleFile(file);
    }

    return (
        <div
            className={`${styles.container} ${hasDraggedOver ? styles.containerDragOver : ''} ${className ?? ''}`}
            onDragOver={(e) => { e.preventDefault(); if (!disabled) setHasDraggedOver(true); }}
            onDragEnter={(e) => { e.preventDefault(); if (!disabled) setHasDraggedOver(true); }}
            onDragLeave={() => setHasDraggedOver(false)}
            onDrop={onDrop}
            aria-disabled={disabled}
        >
            <div
                className={styles.header}
                onClick={() => !disabled && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); if (!disabled) setHasDraggedOver(true); }}
                onDragEnter={(e) => { e.preventDefault(); if (!disabled) setHasDraggedOver(true); }}
                onDragLeave={() => setHasDraggedOver(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (disabled) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
            >
                {currentUrl ? (
                    <div className={styles.imageWrapper}>
                        {previewUrl ? (
                            <Image
                                src={currentUrl}
                                alt="Pré-visualização"
                                fill
                                sizes="100vw"
                                className={styles.image}
                                priority
                            />
                        ) : (
                            <ImageCloudinary
                                src={currentUrl}
                                alt="Imagem existente"
                                sizes="100vw"
                            />
                        )}
                    </div>
                ) : (
                    <div className={styles.uploadPlaceholder}>
                        <div className={styles.uploadIcons}>
                            <FiCamera className={styles.headerIcon} aria-hidden />
                            <span>|</span>
                            <IoMdImages className={styles.headerIcon} aria-hidden />
                        </div>
                        <p>Clique, cole ou arraste e solte para selecionar uma imagem!</p>
                    </div>
                )}
            </div>

            <label
                htmlFor={id}
                className={`${styles.footer} ${hasDraggedOver ? styles.footerDragOver : ''}`}
                onDragOver={(e) => { e.preventDefault(); if (!disabled) setHasDraggedOver(true); }}
                onDragLeave={() => setHasDraggedOver(false)}
                onDrop={onDrop}
            >
                <FiUpload className={styles.footerIconLeft} aria-hidden />

                <button
                    type="button"
                    disabled={!canRemove || disabled}
                    className={`${styles.footerIconRightButton} ${canRemove && !disabled ? styles.footerIconRightButtonActive : styles.footerIconRightButtonDisabled}`}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!canRemove || disabled) return;
                        handleFile(null);
                        if (inputRef.current) inputRef.current.value = '';
                    }}
                    aria-label="Remover imagem selecionada"
                >
                    <FiTrash2 />
                </button>
            </label>

            <input
                id={id}
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={onInputChange}
                disabled={disabled}
                className={styles.fileInput}
            />
        </div>
    );
}
