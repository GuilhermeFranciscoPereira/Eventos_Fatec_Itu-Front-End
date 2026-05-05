'use client';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import { RiImageAddLine } from 'react-icons/ri';
import { MdEdit, MdDelete } from 'react-icons/md';
import InputImage from '@/components/Inputs/InputImage';
import InputField from '@/components/Inputs/InputField';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import styles from '@/app/(pages)/(private)/Carousel/Carousel.module.css';
import { useCarouselPage } from '@/hooks/pages/(private)/Carousel/useCarouselPage';
import type { CarouselProps, CreateCarouselDto, UpdateCarouselDto } from '@/@Types/CarouselTypes';

export default function Carousel(): React.ReactElement {
    const { editCarousel, createCarousel, deleteCarousel, openModal, showToast, handleToggle, carousels, loading, refetch, nameRef, orderRef, activeRef, selectedFileRef } = useCarouselPage()

    const schemaTable = [
        {
            id: 'preview', header: 'Preview', accessor: (c: CarouselProps) => (
                <div className={styles.previewWrapper}>
                    <ImageCloudinary
                        src={c.imageUrl}
                        alt={c.name}
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

    // Below we have the modals

    function handleCreate(): void {
        selectedFileRef.current = null;

        openModal({
            icon: <RiImageAddLine size={32} />,
            title: 'Adicionar nova imagem',
            message: (
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Título da imagem" autoFocus />
                    <InputField ref={orderRef} label="Ordem no carrossel" type="number" min={1} />
                    <InputCheckbox
                        ref={activeRef}
                        defaultChecked
                        label="Imagem deve aparecer no carrossel?"
                    />
                    <div className={styles.formGroup}>
                        <InputImage
                            id="carousel-create-image"
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
                const dto: CreateCarouselDto = {
                    name: nameRef.current!.value,
                    order: Number(orderRef.current!.value),
                    isActive: activeRef.current!.checked,
                    image: file
                };
                await createCarousel(dto);
                selectedFileRef.current = null;
                refetch();
            }
        });
    }

    function handleEdit(item: CarouselProps): void {
        selectedFileRef.current = null;

        openModal({
            icon: <MdEdit size={32} />,
            title: 'Editar imagem',
            message: (
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Título da imagem" defaultValue={item.name} autoFocus />
                    <InputField ref={orderRef} label="Ordem" type="number" min={1} defaultValue={String(item.order)} />
                    <InputCheckbox
                        ref={activeRef}
                        label="Imagem deve aparecer no carrossel?"
                        defaultChecked={item.isActive}
                    />
                    <div className={styles.formGroup}>
                        <div className={styles.previewWrapperEdit}>
                            <InputImage
                                id="carousel-edit-image"
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
                const dto: UpdateCarouselDto = {
                    name: nameRef.current!.value,
                    order: Number(orderRef.current!.value),
                    isActive: activeRef.current!.checked,
                    image: file ?? undefined
                };
                await editCarousel(item.id, dto);
                selectedFileRef.current = null;
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
}