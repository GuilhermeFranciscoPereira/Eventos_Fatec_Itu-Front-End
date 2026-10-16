'use client';
import { FaLayerGroup } from 'react-icons/fa';
import RecordsPage from '@/components/RecordsPage';
import InputField from '@/components/Inputs/InputField';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import styles from '@/app/(pages)/(private)/AdminPage.module.css';
import { useCategoriesPage } from '@/hooks/pages/(private)/Categories/useCategoriesPage';
import type { CategoryProps, CreateCategoryDto, UpdateCategoryDto } from '@/@Types/CategoriesTypes';

export default function Categories(): React.ReactElement {
    const { editCategory, createCategory, deleteCategory, openModal, categories, loading, refetch, nameRef, newNameRef } = useCategoriesPage();

    return (
        <RecordsPage<CategoryProps>
            icon={<FaLayerGroup />}
            rowIcon={<FaLayerGroup />}
            title="Categorias"
            description="Organize os eventos por tema. As categorias aparecem nos filtros da agenda pública."
            nouns={{ one: 'categoria', many: 'categorias', newLabel: 'Nova categoria' }}
            records={categories}
            loading={loading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );

    // Below we have the modals

    function handleCreate(): void {
        openModal({
            icon: <MdAssignmentAdd />,
            title: 'Criar nova categoria',
            message: (
                <form className={styles.form}>
                    <InputField ref={newNameRef} label="Nome da categoria" autoFocus />
                </form>
            ),
            confirmLabel: 'Criar categoria',
            onConfirm: async () => {
                const dto: CreateCategoryDto = { name: newNameRef.current?.value ?? '' };
                await createCategory(dto);
                refetch();
            },
        });
    }

    function handleEdit(record: CategoryProps): void {
        openModal({
            icon: <MdEdit />,
            title: 'Editar categoria',
            message: (
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Nome da categoria" defaultValue={record.name} autoFocus />
                </form>
            ),
            confirmLabel: 'Salvar categoria',
            onConfirm: async () => {
                const dto: UpdateCategoryDto = { name: nameRef.current?.value };
                await editCategory(record.id, dto);
                refetch();
            },
        });
    }

    function handleDelete(record: CategoryProps): void {
        openModal({
            icon: <MdDelete />,
            title: 'Excluir categoria',
            message: <p>Você tem certeza que deseja excluir a categoria <strong>{record.name}</strong>? Essa ação não pode ser desfeita.</p>,
            confirmLabel: 'Sim, excluir',
            onConfirm: async () => {
                await deleteCategory(record.id);
                refetch();
            },
        });
    }
}
