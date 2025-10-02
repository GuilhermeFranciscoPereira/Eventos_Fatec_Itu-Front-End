'use client';
import { useRef } from 'react';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import { useModalStore } from '@/stores/useModalStore';
import InputDefault from '@/components/Inputs/InputDefault';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import styles from '@/app/(pages)/(private)/Courses/Courses.module.css';
import { useEditCourse } from '@/hooks/api/Courses/Patch/useEditCourses';
import { useGetAllCourses } from '@/hooks/api/Courses/Get/useGetAllCourses';
import { useCreateCourse } from '@/hooks/api/Courses/Post/useCreateCourses';
import { useDeleteCourse } from '@/hooks/api/Courses/Delete/useDeleteCourses';
import { CourseProps, CreateCourseDto, UpdateCourseDto } from '@/@Types/CoursesTypes';

export default function Course(): React.ReactElement {
    const editCourse = useEditCourse();
    const createCourse = useCreateCourse();
    const deleteCourse = useDeleteCourse();
    const openModal = useModalStore(s => s.openModal);
    const { courses, loading, refetch } = useGetAllCourses();
    const nameRef = useRef<HTMLInputElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);

    const schemaTable = [
        { id: 'name', header: 'Nome', accessor: (c: CourseProps) => c.name },
        {
            id: 'createdAt', header: 'Criado em',
            accessor: (c: CourseProps) => new Date(c.createdAt).toLocaleString('pt-BR').replace(',', ' -')
        },
        {
            id: 'updatedAt', header: 'Editado última vez em',
            accessor: (c: CourseProps) => new Date(c.updatedAt).toLocaleString('pt-BR').replace(',', ' -')
        },
        {
            id: 'actions', header: 'Ações', accessor: () => null, cellRenderer: (c: CourseProps) => (
                <div className={styles.actions}>
                    <MdEdit className={styles.icon} size={20} onClick={() => handleEdit(c)} />
                    <MdDelete className={styles.icon} size={20} onClick={() => handleDelete(c)} />
                </div>
            ),
        },
    ];

    return (
        <main className={styles.coursesPage}>
            <header className={styles.coursesPageHeader}>
                <h1>Gerenciamento de Cursos</h1>
                <button className={styles.createBtn} onClick={handleCreate}>
                    <MdAssignmentAdd /> Criar novo curso
                </button>
            </header>

            {loading && <Loader />}

            <Table<CourseProps>
                records={courses}
                schema={schemaTable}
                getIdentifier={c => c.id}
                hiddenOnMobile={['createdAt', 'updatedAt']}
            />
        </main>
    );

    function handleCreate(): void {
        openModal({
            icon: <MdAssignmentAdd size={32} />,
            title: 'Criar novo curso',
            message: (
                <form className={styles.form}>
                    <InputDefault ref={newNameRef} label="Nome do curso" />
                </form>
            ),
            confirmLabel: 'Criar curso',
            onConfirm: async () => {
                const dto: CreateCourseDto = { name: newNameRef.current?.value ?? '' };
                await createCourse(dto);
                refetch();
            },
        });
    };

    function handleEdit(cat: CourseProps): void {
        openModal({
            icon: <MdEdit size={32} />,
            title: 'Editar curso',
            message: (
                <form className={styles.form}>
                    <InputDefault ref={nameRef} label="Nome do curso" defaultValue={cat.name} />
                </form>
            ),
            confirmLabel: 'Salvar curso',
            onConfirm: async () => {
                const dto: UpdateCourseDto = { name: nameRef.current?.value };
                await editCourse(cat.id, dto);
                refetch();
            },
        });
    };

    function handleDelete(cat: CourseProps): void {
        openModal({
            icon: <MdDelete size={32} color='red' />,
            title: 'Deletar curso',
            message: <p>Você tem certeza que deseja excluir o curso <strong>{cat.name}</strong>?</p>,
            confirmLabel: 'Sim, deletar',
            onConfirm: async () => {
                await deleteCourse(cat.id);
                refetch();
            },
        });
    };
}
