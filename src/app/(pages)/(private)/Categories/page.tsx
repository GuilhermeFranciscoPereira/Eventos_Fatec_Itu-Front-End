'use client';
import { useRef } from 'react';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import styles from './Categories.module.css';
import { useModalStore } from '@/stores/Modal/modalStore';
import InputDefault from '@/components/Inputs/InputDefault';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import { useEditCategory } from '@/hooks/api/Categories/Patch/useEditCategory';
import { useCreateCategory } from '@/hooks/api/Categories/Post/useCreateCategory';
import { useDeleteCategory } from '@/hooks/api/Categories/Delete/useDeleteCategory';
import { useGetAllCategories } from '@/hooks/api/Categories/Get/useGetAllCategories';
import { CategoryProps, CreateCategoryDto, UpdateCategoryDto } from '@/@Types/CategoriesTypes';

export default function Categories(): React.ReactElement {
    const editCategory = useEditCategory();
    const createCategory = useCreateCategory();
    const deleteCategory = useDeleteCategory();
    const openModal = useModalStore(s => s.openModal);
    const { categories, loading, refetch } = useGetAllCategories();

    const nameRef = useRef<HTMLInputElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);

    function handleCreate(): void {
        openModal({
            icon: <MdAssignmentAdd size={32} />,
            title: 'Criar nova categoria',
            message: (
                <form className={styles.form}>
                    <InputDefault ref={newNameRef} label="Nome da categoria" />
                </form>
            ),
            confirmLabel: 'Criar categoria',
            onConfirm: async () => {
                const dto: CreateCategoryDto = { name: newNameRef.current?.value ?? '' };
                await createCategory(dto);
                refetch();
            },
        });
    };

    function handleEdit(cat: CategoryProps): void {
        openModal({
            icon: <MdEdit size={32} />,
            title: 'Editar categoria',
            message: (
                <form className={styles.form}>
                    <InputDefault ref={nameRef} label="Nome da categoria" defaultValue={cat.name} />
                </form>
            ),
            confirmLabel: 'Salvar categoria',
            onConfirm: async () => {
                const dto: UpdateCategoryDto = { name: nameRef.current?.value };
                await editCategory(cat.id, dto);
                refetch();
            },
        });
    };

    function handleDelete(cat: CategoryProps): void {
        openModal({
            icon: <MdDelete size={32} color='red' />,
            title: 'Deletar categoria',
            message: <p>Você tem certeza que deseja excluir a categoria <strong>{cat.name}</strong>?</p>,
            confirmLabel: 'Sim, deletar',
            onConfirm: async () => {
                await deleteCategory(cat.id);
                refetch();
            },
        });
    };

    const schemaTable = [
        {
            id: 'name', header: 'Nome', accessor: (c: CategoryProps) => c.name
        },
        {
            id: 'createdAt', header: 'Criado em',
            accessor: (c: CategoryProps) => new Date(c.createdAt).toLocaleString('pt-BR').replace(',', ' -')
        },
        {
            id: 'updatedAt', header: 'Editado última vez em',
            accessor: (c: CategoryProps) => new Date(c.updatedAt).toLocaleString('pt-BR').replace(',', ' -')
        },
        {
            id: 'actions', header: 'Ações', accessor: () => null, cellRenderer: (c: CategoryProps) => (
                <div className={styles.actions}>
                    <MdEdit className={styles.icon} size={20} onClick={() => handleEdit(c)} />
                    <MdDelete className={styles.icon} size={20} onClick={() => handleDelete(c)} />
                </div>
            ),
        },
    ];

    return (
        <main className={styles.categoriesPage}>
            <header className={styles.categoriesPageHeader}>
                <h1>Gerenciamento de categorias</h1>
                <button className={styles.createBtn} onClick={handleCreate}>
                    <MdAssignmentAdd /> Criar nova categoria
                </button>
            </header>

            {loading && <Loader />}

            <Table<CategoryProps>
                records={categories}
                schema={schemaTable}
                getIdentifier={c => c.id}
                hiddenOnMobile={['createdAt', 'updatedAt']}
            />
        </main>
    );
}
