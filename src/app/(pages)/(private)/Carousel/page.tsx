'use client';
import { useRef } from 'react';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import { RiImageAddLine } from 'react-icons/ri';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useToastStore } from '@/stores/useToastStore';
import { useModalStore } from '@/stores/useModalStore';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputDefault from '@/components/Inputs/InputDefault';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import styles from '@/app/(pages)/(private)/Carousel/Carousel.module.css';
import { useCreateCarousel } from '@/hooks/api/Carousel/Post/useCreateCarousel';
import { useGetAllCarousels } from '@/hooks/api/Carousel/Get/useGetAllCarousels';
import { useDeleteCarousel } from '@/hooks/api/Carousel/Delete/useDeleteCarousel';
import { CarouselProps, CreateCarouselDto, UpdateCarouselDto } from '@/@Types/CarouselTypes';
import { useEditCarousel, useToggleActiveCarousel } from '@/hooks/api/Carousel/Patch/useEditCarousel';

export default function Carousel(): React.ReactElement {
    const editCarousel = useEditCarousel();
    const createCarousel = useCreateCarousel();
    const deleteCarousel = useDeleteCarousel();
    const toggleActive = useToggleActiveCarousel();
    const openModal = useModalStore(s => s.openModal);
    const showToast = useToastStore((s) => s.showToast);
    const { records: carousels, loading, refetch } = useGetAllCarousels();

    const nameRef = useRef<HTMLInputElement>(null);
    const orderRef = useRef<HTMLInputElement>(null);
    const activeRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const schemaTable = [
        {
            id: 'preview', header: 'Preview', accessor: (c: CarouselProps) => (
                <div className={styles.previewWrapper}>
                    <ImageCloudinary
                        src={c.imageUrl}
                        alt={c.name}
                        sizes="100px"
                    />
                </div>
            )
        },
        { id: 'name', header: 'Nome', accessor: (c: CarouselProps) => c.name },
        { id: 'order', header: 'Ordem', accessor: (c: CarouselProps) => String(c.order) },
        {
            id: 'actions',
            header: 'Ações',
            accessor: () => null,
            cellRenderer: (c: CarouselProps) => (
                <div className={styles.actions}>
                    <InputCheckbox
                        checked={c.isActive}
                        onChange={() => handleToggle(c.id, !c.isActive)}
                    />
                    <MdEdit size={25} className={styles.icon} onClick={() => handleEdit(c)} />
                    <MdDelete size={25} className={styles.icon} onClick={() => handleDelete(c)} />
                </div>
            )
        }
    ];

    return (
        <main className={styles.carouselPage}>
            <header className={styles.carouselPageHeader}>
                <h1>Gerenciamento de Carrossel</h1>
                <button className={styles.createBtn} onClick={handleCreate}>
                    <RiImageAddLine /> Nova Imagem
                </button>
            </header>

            {loading && <Loader />}

            <Table<CarouselProps>
                records={carousels}
                schema={schemaTable}
                getIdentifier={(c) => c.id}
                hiddenOnMobile={['name', 'order']}
            />
        </main>
    );

    function handleCreate(): void {
        openModal({
            icon: <RiImageAddLine size={32} />,
            title: 'Adicionar nova imagem',
            message: (
                <form className={styles.form}>
                    <InputDefault ref={nameRef} label="Título da imagem" />
                    <InputDefault ref={orderRef} label="Ordem no carrossel" type="number" min={1} />
                    <InputCheckbox
                        ref={activeRef}
                        defaultChecked
                        label="Imagem deve aparecer no carrossel?"
                    />
                    <div className={styles.formGroup}>
                        <input ref={fileRef} type="file" accept="image/*" className={styles.fileInput} />
                    </div>
                </form>
            ),
            confirmLabel: 'Salvar',
            onConfirm: async () => {
                const fileList = fileRef.current!.files;
                const file = fileList?.[0];
                if (!file) {
                    showToast({ message: 'Você deve adicionar uma imagem!', type: 'Alert' })
                    throw new Error();
                }
                const dto: CreateCarouselDto = {
                    name: nameRef.current!.value,
                    order: Number(orderRef.current!.value),
                    isActive: activeRef.current!.checked,
                    image: file
                };
                await createCarousel(dto);
                refetch();
            }
        });
    }

    function handleEdit(item: CarouselProps): void {
        openModal({
            icon: <MdEdit size={32} />,
            title: 'Editar imagem',
            message: (
                <form className={styles.form}>
                    <InputDefault ref={nameRef} label="Título da imagem" defaultValue={item.name} />
                    <InputDefault ref={orderRef} label="Ordem" type="number" min={1} defaultValue={String(item.order)} />
                    <InputCheckbox
                        ref={activeRef}
                        label="Imagem deve aparecer no carrossel?"
                        defaultChecked={item.isActive}
                    />
                    <div className={styles.formGroup}>
                        <div className={styles.previewWrapperEdit}>
                            <ImageCloudinary
                                src={item.imageUrl}
                                alt={item.name}
                                sizes="320px"
                                priority
                            />
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className={styles.fileInput} />
                    </div>
                </form>
            ),
            confirmLabel: 'Salvar',
            onConfirm: async () => {
                const fileList = fileRef.current!.files;
                const file = fileList?.[0];
                const dto: UpdateCarouselDto = {
                    name: nameRef.current!.value,
                    order: Number(orderRef.current!.value),
                    isActive: activeRef.current!.checked,
                    image: file
                };
                await editCarousel(item.id, dto);
                refetch();
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
                refetch();
            }
        });
    }

    async function handleToggle(id: number, nextState: boolean): Promise<void> {
        await toggleActive(id, nextState);
        refetch();
    }
}
