'use client';
import 'react-image-crop/dist/ReactCrop.css';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiRotateCcw, FiX, FiAlertTriangle, FiCheckCircle, FiSmartphone } from 'react-icons/fi';
import ReactCrop, { centerCrop, makeAspectCrop, type PercentCrop } from 'react-image-crop';
import styles from '@/components/ImageCropper/ImageCropper.module.css';
import { cropImageToFile, formatAspectRatio, formatSize, getOutputSize, meetsRecommendation, type ImageRecommendation, type ImageSize, type PixelArea } from '@/utils/imageCrop';

type ImageCropperProps = {
    file: File;
    recommendation: ImageRecommendation;
    onApply: (file: File) => void;
    onCancel: () => void;
};

type CropModeId = 'recommended' | 'free' | '16:9' | '4:3' | '1:1';

type CropMode = { id: CropModeId; label: string; aspect?: number };

// Below this the selection stops being useful and becomes hard to grab on touch screens.
const MIN_SELECTION_PX = 40;

function getInitialCrop(aspect: number | undefined, width: number, height: number): PercentCrop {
    if (!aspect) return { unit: '%', x: 0, y: 0, width: 100, height: 100 };
    const base = width / height > aspect ? { unit: '%' as const, height: 100 } : { unit: '%' as const, width: 100 };
    return centerCrop(makeAspectCrop(base, aspect, width, height), width, height);
}

function toPixelArea(crop: PercentCrop, { width: naturalWidth, height: naturalHeight }: ImageSize): PixelArea {
    const x = Math.round((crop.x / 100) * naturalWidth);
    const y = Math.round((crop.y / 100) * naturalHeight);
    return {
        x,
        y,
        width: Math.max(1, Math.min(naturalWidth - x, Math.round((crop.width / 100) * naturalWidth))),
        height: Math.max(1, Math.min(naturalHeight - y, Math.round((crop.height / 100) * naturalHeight))),
    };
}

export default function ImageCropper({ file, recommendation, onApply, onCancel }: ImageCropperProps): React.ReactElement {
    const imageRef = useRef<HTMLImageElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [mode, setMode] = useState<CropModeId>('recommended');
    const [crop, setCrop] = useState<PercentCrop>();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [naturalSize, setNaturalSize] = useState<ImageSize | null>(null);

    const recommendedAspect = recommendation.width / recommendation.height;
    const modes: CropMode[] = useMemo(() => [
        { id: 'recommended', label: `Recomendado (${formatAspectRatio(recommendation)})`, aspect: recommendedAspect },
        { id: 'free', label: 'Livre' },
        { id: '16:9', label: '16:9', aspect: 16 / 9 },
        { id: '4:3', label: '4:3', aspect: 4 / 3 },
        { id: '1:1', label: 'Quadrado', aspect: 1 },
    ], [recommendation, recommendedAspect]);
    const activeMode = modes.find(item => item.id === mode) ?? modes[0];
    const isRecommendedMode = activeMode.id === 'recommended';

    const area = crop && naturalSize ? toPixelArea(crop, naturalSize) : null;
    const output = area ? getOutputSize(area, recommendation, isRecommendedMode) : null;
    const hasEnoughResolution = area ? meetsRecommendation(area, recommendation) : true;
    const areaAspect = area ? area.width / area.height : recommendedAspect;
    const aspectDiffersFromRecommended = Math.abs(areaAspect - recommendedAspect) / recommendedAspect > 0.15;

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setSourceUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialogRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, []);

    function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>): void {
        const { naturalWidth, naturalHeight } = event.currentTarget;
        setNaturalSize({ width: naturalWidth, height: naturalHeight });
        setCrop(getInitialCrop(activeMode.aspect, naturalWidth, naturalHeight));
    }

    function handleModeChange(nextMode: CropMode): void {
        setMode(nextMode.id);
        setErrorMessage(null);
        if (naturalSize) setCrop(getInitialCrop(nextMode.aspect, naturalSize.width, naturalSize.height));
    }

    function handleReset(): void {
        handleModeChange(modes[0]);
    }

    async function handleApply(): Promise<void> {
        if (!imageRef.current || !area || !output) return;
        try {
            setIsSaving(true);
            setErrorMessage(null);
            // The displayed <img> is blob-backed, so it never taints the canvas.
            const cropped = await cropImageToFile(imageRef.current, area, output, file);
            onApply(cropped);
        } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : 'Não foi possível recortar a imagem.');
        } finally {
            setIsSaving(false);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        // Events bubble through portals in React: keep Enter/Escape away from the modal or form underneath.
        event.stopPropagation();
        if (event.key === 'Escape') onCancel();
    }

    return createPortal(
        <div className={styles.overlay} onKeyDown={handleKeyDown} onClick={(e) => e.stopPropagation()}>
            <div
                ref={dialogRef}
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="image-cropper-title"
                aria-describedby="image-cropper-description"
                tabIndex={-1}
            >
                <header className={styles.header}>
                    <div>
                        <h2 id="image-cropper-title" className={styles.title}>Editar imagem</h2>
                        <p id="image-cropper-description" className={styles.subtitle}>
                            Tamanho recomendado: <strong>{formatSize(recommendation)}</strong> (proporção {formatAspectRatio(recommendation)})
                        </p>
                    </div>
                    <button type="button" className={styles.closeButton} onClick={onCancel} aria-label="Fechar editor de imagem">
                        <FiX aria-hidden />
                    </button>
                </header>

                <div className={styles.modes} role="group" aria-label="Formato do recorte">
                    {modes.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            className={`${styles.modeButton} ${item.id === mode ? styles.modeButtonActive : ''}`}
                            aria-pressed={item.id === mode}
                            onClick={() => handleModeChange(item)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className={styles.stage}>
                    {sourceUrl && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            aspect={activeMode.aspect}
                            keepSelection
                            ruleOfThirds
                            minWidth={MIN_SELECTION_PX}
                            minHeight={MIN_SELECTION_PX}
                            className={styles.cropper}
                            renderSelectionAddon={() => isRecommendedMode && recommendation.mobileVisibleRatio ? (
                                <div
                                    className={styles.mobileGuide}
                                    style={{ '--visible': recommendation.mobileVisibleRatio } as React.CSSProperties}
                                    aria-hidden
                                >
                                    <div className={styles.mobileGuideZone}>
                                        <span className={styles.mobileGuideLabel}><FiSmartphone /> Celular</span>
                                    </div>
                                </div>
                            ) : null}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element -- needs the raw element for canvas cropping */}
                            <img
                                ref={imageRef}
                                src={sourceUrl}
                                alt="Imagem sendo recortada"
                                className={styles.image}
                                onLoad={handleImageLoad}
                                onError={() => setErrorMessage('Não foi possível abrir esta imagem.')}
                            />
                        </ReactCrop>
                    )}
                </div>

                <div className={styles.info} aria-live="polite">
                    {area && output && (
                        <p className={styles.dimensions}>
                            Recorte: <strong>{formatSize(area)}</strong>
                            {(output.width !== area.width || output.height !== area.height) && (
                                <> · será salvo em <strong>{formatSize(output)}</strong></>
                            )}
                        </p>
                    )}
                    {area && (hasEnoughResolution ? (
                        <p className={`${styles.status} ${styles.statusOk}`}>
                            <FiCheckCircle aria-hidden /> Resolução ideal para o site.
                        </p>
                    ) : (
                        <p className={`${styles.status} ${styles.statusWarning}`}>
                            <FiAlertTriangle aria-hidden /> Recorte menor que {formatSize(recommendation)}: a imagem pode ficar desfocada. Aumente a área ou use uma foto maior.
                        </p>
                    ))}
                    {area && !isRecommendedMode && aspectDiffersFromRecommended && (
                        <p className={`${styles.status} ${styles.statusWarning}`}>
                            <FiAlertTriangle aria-hidden /> Proporção diferente da recomendada: o site vai cortar as bordas para encaixar a imagem.
                        </p>
                    )}
                    {isRecommendedMode && recommendation.mobileVisibleRatio && (
                        <p className={styles.hint}>
                            <FiSmartphone aria-hidden /> No celular, só a faixa central marcada aparece. Mantenha textos e rostos dentro dela.
                        </p>
                    )}
                    {errorMessage && <p className={`${styles.status} ${styles.statusError}`} role="alert">{errorMessage}</p>}
                </div>

                <footer className={styles.footer}>
                    <button type="button" className={`${styles.actionButton} ${styles.ghostButton}`} onClick={handleReset} disabled={!naturalSize}>
                        <FiRotateCcw aria-hidden /> Restaurar
                    </button>
                    <div className={styles.footerRight}>
                        <button type="button" className={`${styles.actionButton} ${styles.ghostButton}`} onClick={onCancel}>
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className={`${styles.actionButton} ${styles.primaryButton}`}
                            onClick={handleApply}
                            disabled={!area || isSaving}
                        >
                            <FiCheck aria-hidden /> {isSaving ? 'Aplicando...' : 'Aplicar recorte'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>,
        document.body
    );
}
