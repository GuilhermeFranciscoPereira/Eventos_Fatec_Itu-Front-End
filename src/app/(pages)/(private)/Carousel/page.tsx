'use client';
import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import Loader from '@/components/Loader';
import { RiImageAddLine } from 'react-icons/ri';
import { GiKnightBanner } from 'react-icons/gi';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Buttons/Button';
import EmptyState from '@/components/EmptyState';
import IconButton from '@/components/Buttons/IconButton';
import StatCard, { StatGrid } from '@/components/StatCard';
import { MdEdit, MdDelete, MdDragIndicator, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import adminStyles from '@/app/(pages)/(private)/AdminPage.module.css';
import InputImage from '@/components/Inputs/InputImage';
import { CAROUSEL_IMAGE_RECOMMENDATION } from '@/utils/imageCrop';
import InputField from '@/components/Inputs/InputField';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import styles from '@/app/(pages)/(private)/Carousel/Carousel.module.css';
import { useCarouselPage } from '@/hooks/pages/(private)/Carousel/useCarouselPage';
import type { CarouselProps, CreateCarouselDto, UpdateCarouselDto } from '@/@Types/CarouselTypes';

function sortCarousels(records: CarouselProps[]): CarouselProps[] {
    return [...records]
        .sort((a, b) => a.order - b.order)
        .map((item, index) => ({ ...item, order: index + 1 }));
}

function moveCarouselItem(records: CarouselProps[], activeId: number, overId: number): CarouselProps[] {
    const activeIndex = records.findIndex(item => item.id === activeId);
    const overIndex = records.findIndex(item => item.id === overId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return records;

    const next = [...records];
    const [activeItem] = next.splice(activeIndex, 1);
    next.splice(overIndex, 0, activeItem);

    return next.map((item, index) => ({ ...item, order: index + 1 }));
}

export default function Carousel(): React.ReactElement {
    const { editCarousel, reorderCarousel, createCarousel, deleteCarousel, openModal, showToast, handleToggle, carousels, loading, refetch, nameRef, orderRef, activeRef, selectedFileRef } = useCarouselPage()
    const [orderedCarousels, setOrderedCarousels] = useState<CarouselProps[]>([]);
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const [isReordering, setIsReordering] = useState<boolean>(false);
    const orderedCarouselsRef = useRef<CarouselProps[]>([]);
    const lastDragOverIdRef = useRef<number | null>(null);

    useEffect(() => {
        const sorted = sortCarousels(carousels);
        orderedCarouselsRef.current = sorted;
        setOrderedCarousels(sorted);
    }, [carousels]);

    const activeCount = carousels.filter(item => item.isActive).length;
    const firstLoad = loading && !carousels.length;

    return (
        <main className={adminStyles.page}>
            <PageHeader
                icon={<GiKnightBanner />}
                title="Carrossel"
                description="Imagens em destaque no topo da página inicial. Arraste pelo ícone à direita para mudar a ordem."
                actions={<Button icon={<RiImageAddLine />} onClick={handleCreate}>Nova imagem</Button>}
            />

            <StatGrid>
                <StatCard icon={<GiKnightBanner />} label="Imagens cadastradas" value={carousels.length} loading={firstLoad} />
                <StatCard icon={<MdVisibility />} tone="success" label="Aparecendo no site" value={activeCount} loading={firstLoad} />
                <StatCard icon={<MdVisibilityOff />} tone="neutral" label="Ocultas" value={carousels.length - activeCount} loading={firstLoad} />
            </StatGrid>

            {isReordering && <Loader />}

            <section className={styles.carouselList} aria-busy={loading}>
                {firstLoad ? (
                    Array.from({ length: 3 }, (_, idx) => <div key={idx} className={styles.skeletonItem} aria-hidden />)
                ) : orderedCarousels.length === 0 ? (
                    <div className={styles.emptyState}>
                        <EmptyState
                            icon={<GiKnightBanner />}
                            title="Nenhuma imagem no carrossel"
                            description="Adicione uma imagem no formato 1920 × 480 px para ela aparecer no topo da página inicial."
                            action={<Button icon={<RiImageAddLine />} onClick={handleCreate}>Nova imagem</Button>}
                        />
                    </div>
                ) : (
                    orderedCarousels.map((item, index) => (
                        <article
                            key={item.id}
                            className={[
                                styles.carouselItem,
                                draggedId === item.id ? styles.dragging : '',
                                dragOverId === item.id && draggedId !== item.id ? styles.dragOver : '',
                                !item.isActive ? styles.inactive : '',
                            ].filter(Boolean).join(' ')}
                            style={{ '--item-index': index } as React.CSSProperties}
                            onDragOver={(event) => handleDragOver(event, item.id)}
                            onDrop={handleDrop}
                        >
                            <span className={styles.orderBadge}>{item.order}</span>
                            <div className={styles.previewWrapper}>
                                <ImageCloudinary
                                    src={item.imageUrl}
                                    alt={item.name}
                                    sizes="(max-width: 720px) 100vw, 320px"
                                />
                            </div>
                            <div className={styles.itemInfo}>
                                <strong className={styles.itemTitle}>{item.name}</strong>
                                <span className={`${adminStyles.chip} ${adminStyles.chipDot} ${item.isActive ? adminStyles.chipSuccess : adminStyles.chipNeutral}`}>
                                    {item.isActive ? 'Aparecendo no site' : 'Oculta'}
                                </span>
                            </div>
                            <div className={styles.actions}>
                                <span className={styles.activeToggle} title={item.isActive ? 'Ocultar do site' : 'Mostrar no site'}>
                                    <InputCheckbox
                                        checked={item.isActive}
                                        aria-label={item.isActive ? `Ocultar ${item.name}` : `Mostrar ${item.name}`}
                                        onChange={() => handleToggle(item.id, !item.isActive)}
                                    />
                                    <span>Ativa</span>
                                </span>
                                <IconButton label={`Editar ${item.name}`} tone="info" onClick={() => handleEdit(item)}><MdEdit /></IconButton>
                                <IconButton label={`Excluir ${item.name}`} tone="danger" onClick={() => handleDelete(item)}><MdDelete /></IconButton>
                                <button
                                    type="button"
                                    className={styles.dragHandle}
                                    aria-label={`Arrastar ${item.name}`}
                                    title="Arrastar para reordenar"
                                    draggable={!isReordering}
                                    onDragStart={(event) => handleDragStart(event, item.id)}
                                    onDragEnd={handleDragEnd}
                                    disabled={isReordering}
                                >
                                    <MdDragIndicator size={22} />
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </section>
        </main>
    );

    function updateOrderedCarousels(updater: (items: CarouselProps[]) => CarouselProps[]): void {
        setOrderedCarousels(previousItems => {
            const nextItems = updater(previousItems);
            orderedCarouselsRef.current = nextItems;
            return nextItems;
        });
    }

    function handleDragStart(event: DragEvent<HTMLButtonElement>, id: number): void {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(id));
        lastDragOverIdRef.current = null;
        setDraggedId(id);
    }

    function handleDragOver(event: DragEvent<HTMLElement>, overId: number): void {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        if (draggedId === null || draggedId === overId || lastDragOverIdRef.current === overId) return;

        lastDragOverIdRef.current = overId;
        setDragOverId(overId);
        updateOrderedCarousels(items => moveCarouselItem(items, draggedId, overId));
    }

    function handleDrop(event: DragEvent<HTMLElement>): void {
        event.preventDefault();
    }

    async function handleDragEnd(): Promise<void> {
        if (draggedId === null) return;

        const movedId = draggedId;
        const nextOrder = orderedCarouselsRef.current.findIndex(item => item.id === movedId) + 1;
        const previousOrder = carousels.find(item => item.id === movedId)?.order;

        setDraggedId(null);
        setDragOverId(null);
        lastDragOverIdRef.current = null;

        if (!nextOrder || nextOrder === previousOrder) return;

        try {
            setIsReordering(true);
            await reorderCarousel(movedId, nextOrder);
            await refetch();
        } catch (err: unknown) {
            const sorted = sortCarousels(carousels);
            orderedCarouselsRef.current = sorted;
            setOrderedCarousels(sorted);
            showToast({ message: err instanceof Error ? err.message : 'Falha ao reordenar carrossel', type: 'error' });
        } finally {
            setIsReordering(false);
        }
    }

    function blockInvalidOrderKey(event: KeyboardEvent<HTMLInputElement>): void {
        if (['e', 'E', '+', '-', '.', ','].includes(event.key)) event.preventDefault();
    }

    function getValidatedOrder(maxOrder: number, fallback?: number): number | undefined {
        const rawOrder = orderRef.current?.value.trim() ?? '';
        if (!rawOrder) return fallback;

        const order = Number(rawOrder);
        if (!/^\d+$/.test(rawOrder) || !Number.isSafeInteger(order) || order < 1 || order > maxOrder) {
            showToast({ message: `Informe uma ordem entre 1 e ${maxOrder}.`, type: 'warning' });
            throw new Error();
        }

        return order;
    }

    function handleCreate(): void {
        selectedFileRef.current = null;
        const maxOrder = carousels.length + 1;

        openModal({
            icon: <RiImageAddLine size={32} />,
            title: 'Adicionar nova imagem',
            message: (
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Título da imagem" autoFocus />
                    <InputField
                        ref={orderRef}
                        label="Ordem no carrossel"
                        type="number"
                        min={1}
                        max={maxOrder}
                        step={1}
                        inputMode="numeric"
                        required={false}
                        onKeyDown={blockInvalidOrderKey}
                    />
                    <InputCheckbox
                        ref={activeRef}
                        defaultChecked
                        label="Imagem deve aparecer no carrossel?"
                    />
                    <div className={styles.formGroup}>
                        <InputImage
                            id="carousel-create-image"
                            recommendedSize={CAROUSEL_IMAGE_RECOMMENDATION}
                            onChange={(file) => { selectedFileRef.current = file; }}
                        />
                    </div>
                </form>
            ),
            confirmLabel: 'Salvar',
            onConfirm: async () => {
                const file = selectedFileRef.current;
                if (!file) {
                    showToast({ message: 'Você deve adicionar uma imagem!', type: 'warning' })
                    throw new Error();
                }
                const order = getValidatedOrder(maxOrder);
                const dto: CreateCarouselDto = {
                    name: nameRef.current!.value,
                    isActive: activeRef.current!.checked,
                    image: file,
                    ...(order !== undefined && { order })
                };
                await createCarousel(dto);
                selectedFileRef.current = null;
                await refetch();
            }
        });
    }

    function handleEdit(item: CarouselProps): void {
        selectedFileRef.current = null;
        const maxOrder = carousels.length;

        openModal({
            icon: <MdEdit size={32} />,
            title: 'Editar imagem',
            message: (
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Título da imagem" defaultValue={item.name} autoFocus />
                    <InputField
                        ref={orderRef}
                        label="Ordem"
                        type="number"
                        min={1}
                        max={maxOrder}
                        step={1}
                        inputMode="numeric"
                        required={false}
                        defaultValue={String(item.order)}
                        onKeyDown={blockInvalidOrderKey}
                    />
                    <InputCheckbox
                        ref={activeRef}
                        label="Imagem deve aparecer no carrossel?"
                        defaultChecked={item.isActive}
                    />
                    <div className={styles.formGroup}>
                        <div className={styles.previewWrapperEdit}>
                            <InputImage
                                id="carousel-edit-image"
                                recommendedSize={CAROUSEL_IMAGE_RECOMMENDATION}
                                initialUrl={item.imageUrl}
                                onChange={(file) => { selectedFileRef.current = file; }}
                            />
                        </div>
                    </div>
                </form>
            ),
            confirmLabel: 'Salvar',
            onConfirm: async () => {
                const file = selectedFileRef.current;
                const order = getValidatedOrder(maxOrder, item.order);
                const dto: UpdateCarouselDto = {
                    name: nameRef.current!.value,
                    order,
                    isActive: activeRef.current!.checked,
                    image: file ?? undefined
                };
                await editCarousel(item.id, dto);
                selectedFileRef.current = null;
                await refetch();
            }
        });
    }

    function handleDelete(item: CarouselProps): void {
        openModal({
            icon: <MdDelete size={32} color="red" />,
            title: 'Confirmar exclusão',
            message: (<p>Tem certeza que deseja excluir a imagem <strong>{item.name}</strong>?</p>),
            confirmLabel: 'Sim, excluir',
            onConfirm: async () => {
                await deleteCarousel(item.id);
                await refetch();
            }
        });
    }
}
