'use client';
import Image from 'next/image';
import { IoMdImages } from 'react-icons/io';
import { useEffect, useRef, useState } from 'react';
import ImageCropper from '@/components/ImageCropper';
import ImageCloudinary from '@/components/ImageCloudinary';
import styles from '@/components/Inputs/InputImage/InputImage.module.css';
import { FiUpload, FiTrash2, FiCamera, FiCrop, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { formatAspectRatio, formatSize, loadImage, meetsRecommendation, type ImageRecommendation, type ImageSize } from '@/utils/imageCrop';

type InputImageProps = {
    initialUrl?: string | null;
    onChange?: (file: File | null, previewUrl: string | null) => void;
    accept?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    // Enables the size hint and the crop editor (opened right after a new image is picked).
    recommendedSize?: ImageRecommendation;
};

const CLOUD_NAME: string = process.env.NEXT_PUBLIC_CLOUDINARY_NAME as string;

function getOriginalImageUrl(src: string): string {
    if (src.startsWith('http')) return src;
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${src.replace(/^\/+/, '')}`;
}

export default function InputImage({ initialUrl = null, onChange, accept = 'image/*', disabled = false, id = 'input-image', className, recommendedSize }: InputImageProps): React.ReactElement {
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [hasDraggedOver, setHasDraggedOver] = useState<boolean>(false);
    // The untouched file the user picked: every crop starts from it, so cropping twice never loses quality.
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [imageSize, setImageSize] = useState<ImageSize | null>(null);
    const [isLoadingCurrent, setIsLoadingCurrent] = useState<boolean>(false);
    const [cropError, setCropError] = useState<string | null>(null);
    const currentUrl: string | null = previewUrl ?? initialUrl ?? null;
    const canRemove: boolean = Boolean(previewUrl);
    const canCrop: boolean = Boolean(recommendedSize) && Boolean(currentUrl) && !disabled && !isLoadingCurrent;

    useEffect(() => () => {
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    }, []);

    function isValidImage(file: File | undefined): file is File {
        return !!file && file.type.startsWith('image/');
    }

    function showResult(file: File | null): void {
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        const url = file ? URL.createObjectURL(file) : null;
        previewUrlRef.current = url;
        setPreviewUrl(url);
        setImageSize(null);
        onChange?.(file, url);

        if (url && recommendedSize) {
            loadImage(url)
                .then(image => { if (previewUrlRef.current === url) setImageSize({ width: image.naturalWidth, height: image.naturalHeight }); })
                .catch(() => setImageSize(null));
        }
    }

    function handleFile(file: File | null): void {
        setCropError(null);
        setSourceFile(file);
        showResult(file);
        if (file && recommendedSize) setCropFile(file);
    }

    function handleCropApply(cropped: File): void {
        setCropFile(null);
        showResult(cropped);
    }

    async function openCropper(): Promise<void> {
        if (!canCrop) return;
        setCropError(null);
        if (sourceFile) {
            setCropFile(sourceFile);
            return;
        }
        if (!initialUrl) return;

        // Editing an already-saved image: fetch the original from Cloudinary to crop it locally.
        try {
            setIsLoadingCurrent(true);
            const response = await fetch(getOriginalImageUrl(initialUrl));
            if (!response.ok) throw new Error();
            const blob = await response.blob();
            const extension = blob.type === 'image/png' ? 'png' : 'jpg';
            const file = new File([blob], `imagem-atual.${extension}`, { type: blob.type || 'image/jpeg' });
            setSourceFile(file);
            setCropFile(file);
        } catch {
            setCropError('Não foi possível carregar a imagem atual para recortar.');
        } finally {
            setIsLoadingCurrent(false);
        }
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const file = e.target.files?.[0] ?? null;
        handleFile(file);
        // Lets the same file be picked again after removing it.
        e.target.value = '';
    }

    function onDrop(e: React.DragEvent<HTMLElement>): void {
        e.preventDefault();
        setHasDraggedOver(false);
        if (disabled) return;
        const file = e.dataTransfer.files?.[0];
        if (isValidImage(file)) handleFile(file);
    }

    function renderSizeInfo(): React.ReactNode {
        if (!recommendedSize) return null;
        if (cropError) {
            return <span className={`${styles.sizeInfo} ${styles.sizeInfoWarning}`} role="alert"><FiAlertTriangle aria-hidden /> {cropError}</span>;
        }
        if (previewUrl && imageSize) {
            const isGood = meetsRecommendation(imageSize, recommendedSize);
            return (
                <span
                    className={`${styles.sizeInfo} ${isGood ? styles.sizeInfoOk : styles.sizeInfoWarning}`}
                    title={isGood ? 'Resolução ideal' : `Abaixo do recomendado (${formatSize(recommendedSize)}): pode ficar desfocada`}
                >
                    {isGood ? <FiCheckCircle aria-hidden /> : <FiAlertTriangle aria-hidden />}
                    <span>
                        {formatSize(imageSize)}
                        <span className={styles.sizeInfoDetail}>{isGood ? ' · ideal' : ' · abaixo do recomendado'}</span>
                    </span>
                </span>
            );
        }
        return (
            <span className={styles.sizeInfo}>
                <span>Recomendado: <strong>{formatSize(recommendedSize)}</strong></span>
            </span>
        );
    }

    return (
        <>
            <div
                className={`${styles.container} ${recommendedSize ? styles.containerRatio : ''} ${hasDraggedOver ? styles.containerDragOver : ''} ${className ?? ''}`}
                style={recommendedSize ? { '--image-ratio': `${recommendedSize.width} / ${recommendedSize.height}` } as React.CSSProperties : undefined}
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
                    aria-label={currentUrl ? 'Trocar imagem' : 'Selecionar imagem'}
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
                                    sizes="(max-width: 768px) 100vw, 900px"
                                    fit="contain"
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
                            {recommendedSize && (
                                <p className={styles.recommendation}>
                                    Tamanho recomendado: <strong>{formatSize(recommendedSize)}</strong> (proporção {formatAspectRatio(recommendedSize)})
                                </p>
                            )}
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

                    {renderSizeInfo()}

                    <div className={styles.footerActions}>
                        {recommendedSize && (
                            <button
                                type="button"
                                disabled={!canCrop}
                                className={`${styles.footerIconRightButton} ${canCrop ? styles.footerIconRightButtonActive : styles.footerIconRightButtonDisabled}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    void openCropper();
                                }}
                                aria-label="Recortar imagem"
                                title={isLoadingCurrent ? 'Carregando imagem...' : 'Recortar imagem'}
                            >
                                <FiCrop className={isLoadingCurrent ? styles.spinning : undefined} />
                            </button>
                        )}

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
                    </div>
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

            {cropFile && recommendedSize && (
                <ImageCropper
                    file={cropFile}
                    recommendation={recommendedSize}
                    onApply={handleCropApply}
                    onCancel={() => setCropFile(null)}
                />
            )}
        </>
    );
}
