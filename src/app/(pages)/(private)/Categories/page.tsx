'use client';
import { useRef } from 'react';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import styles from './Categories.module.css';
import { useModalStore } from '@/stores/Modal/modalStore';
import InputDefault from '@/components/Inputs/InputDefault';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import { useEditCategory } from '@/hooks/api/Categories/Patch/useEditCategory';
import { useDeleteCategory } from '@/hooks/api/Categories/Delete/useDeleteCategory';
import { useGetAllCategories, CategoryProps } from '@/hooks/api/Categories/Get/useGetAllCategories';
import { useCreateCategory, CreateCategoryDto } from '@/hooks/api/Categories/Post/useCreateCategory';

export default function Categories(): React.ReactElement {
    const { categories, loading, error, refetch } = useGetAllCategories();
    const createCategory = useCreateCategory();
    const editCategory = useEditCategory();
    const deleteCategory = useDeleteCategory();
    const openModal = useModalStore(s => s.openModal);

    const nameRef = useRef<HTMLInputElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);

    function formatDate(date: string | Date): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        const secs = String(d.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${mins}:${secs}`;
    }


    const handleCreate = () => {
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

    const handleEdit = (cat: CategoryProps) => {
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
                await editCategory(cat.id, { name: nameRef.current?.value });
                refetch();
            },
        });
    };

    const handleDelete = (cat: CategoryProps) => {
        openModal({
            icon: <MdDelete size={32} />,
            title: 'Deletar categoria',
            message: <p>Você tem certeza que deseja excluir a categoria <strong>{cat.name}</strong>?</p>,
            confirmLabel: 'Sim, deletar',
            onConfirm: async () => {
                await deleteCategory(cat.id);
                refetch();
            },
        });
    };

    const schema = [
        { id: 'name', header: 'Nome', accessor: (c: CategoryProps) => c.name },
        { id: 'createdAt', header: 'Criado em', accessor: (c: CategoryProps) => formatDate(c.createdAt) },
        { id: 'updatedAt', header: 'Editado última vez em', accessor: (c: CategoryProps) => formatDate(c.updatedAt) },
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
            {error && <p className={styles.error}>Erro: {error}</p>}

            <Table<CategoryProps>
                records={categories}
                schema={schema}
                getIdentifier={c => c.id}
                hiddenOnMobile={['createdAt', 'updatedAt']}
            />
        </main>
    );
}
