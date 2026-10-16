'use client';
import { FaBook } from 'react-icons/fa';
import RecordsPage from '@/components/RecordsPage';
import InputField from '@/components/Inputs/InputField';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import styles from '@/app/(pages)/(private)/AdminPage.module.css';
import { useCoursesPage } from '@/hooks/pages/(private)/Courses/useCoursesPage';
import type { CourseProps, CreateCourseDto, UpdateCourseDto } from '@/@Types/CoursesTypes';

export default function Course(): React.ReactElement {
    const { editCourse, createCourse, deleteCourse, openModal, courses, loading, refetch, nameRef, newNameRef } = useCoursesPage();

    return (
        <RecordsPage<CourseProps>
            icon={<FaBook />}
            rowIcon={<FaBook />}
            title="Cursos"
            description="Cursos da Fatec Itu usados para restringir eventos e no formulário de inscrição dos alunos."
            nouns={{ one: 'curso', many: 'cursos', newLabel: 'Novo curso' }}
            records={courses}
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
            title: 'Criar novo curso',
            message: (
                <form className={styles.form}>
                    <InputField ref={newNameRef} label="Nome do curso" autoFocus />
                </form>
            ),
            confirmLabel: 'Criar curso',
            onConfirm: async () => {
                const dto: CreateCourseDto = { name: newNameRef.current?.value ?? '' };
                await createCourse(dto);
                refetch();
            },
        });
    }

    function handleEdit(record: CourseProps): void {
        openModal({
            icon: <MdEdit />,
            title: 'Editar curso',
            message: (
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Nome do curso" defaultValue={record.name} autoFocus />
                </form>
            ),
            confirmLabel: 'Salvar curso',
            onConfirm: async () => {
                const dto: UpdateCourseDto = { name: nameRef.current?.value };
                await editCourse(record.id, dto);
                refetch();
            },
        });
    }

    function handleDelete(record: CourseProps): void {
        openModal({
            icon: <MdDelete />,
            title: 'Excluir curso',
            message: <p>Você tem certeza que deseja excluir o curso <strong>{record.name}</strong>? Essa ação não pode ser desfeita.</p>,
            confirmLabel: 'Sim, excluir',
            onConfirm: async () => {
                await deleteCourse(record.id);
                refetch();
            },
        });
    }
}
