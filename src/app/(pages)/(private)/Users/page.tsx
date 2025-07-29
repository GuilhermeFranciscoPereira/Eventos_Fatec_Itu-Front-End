'use client';
import { useRef } from 'react';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useModalStore } from '@/stores/useModalStore';
import InputDefault from '@/components/Inputs/InputDefault';
import { UserProps, CreateUserDto } from '@/@Types/UsersTypes';
import { useEditUser } from '@/hooks/api/Users/Patch/useEditUser';
import styles from '@/app/(pages)/(private)/Users/Users.module.css';
import { useCreateUser } from '@/hooks/api/Users/Post/useCreateUser';
import { useGetAllUsers } from '@/hooks/api/Users/Get/useGetAllUsers';
import { useDeleteUser } from '@/hooks/api/Users/Delete/useDeleteUser';

export default function Users(): React.ReactElement {
    const editUser = useEditUser();
    const createUser = useCreateUser();
    const deleteUser = useDeleteUser();
    const openModal = useModalStore((s) => s.openModal);
    const { users, loading, refetch } = useGetAllUsers();

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLSelectElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);
    const newEmailRef = useRef<HTMLInputElement>(null);
    const newRoleRef = useRef<HTMLSelectElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);

    const schemaTable = [
        { id: 'name', header: 'Nome', accessor: (u: UserProps) => u.name },
        { id: 'email', header: 'Email', accessor: (u: UserProps) => u.email },
        { id: 'role', header: 'Nível de usuário', accessor: (u: UserProps) => u.role },
        {
            id: 'actions', header: 'Ações', accessor: () => null, cellRenderer: (u: UserProps) => (
                <div className={styles.actions}>
                    <MdEdit className={styles.icon} size={20} onClick={() => handleEdit(u)} />
                    <MdDelete className={styles.icon} size={20} onClick={() => handleDelete(u)} />
                </div>
            )
        },
    ];

    return (
        <main className={styles.usersPage}>
            <header className={styles.usersPageHeader}>
                <h1>Gerenciamento de Usuários</h1>
                <button className={styles.createBtn} onClick={handleCreate}>
                    <IoMdPersonAdd /> Criar novo usuário
                </button>
            </header>

            {loading && <Loader />}

            <Table<UserProps>
                records={users}
                schema={schemaTable}
                getIdentifier={(u) => u.id}
                hiddenOnMobile={['name', 'role']}
            />
        </main>
    );

    function handleCreate(): void {
        openModal({
            icon: <IoMdPersonAdd size={32} />,
            title: 'Criar novo usuário',
            message: (
                <form className={styles.editForm}>
                    <InputDefault ref={newNameRef} label="Nome" />
                    <InputDefault ref={newEmailRef} label="E-mail" type="email" />
                    <InputDefault ref={newPasswordRef} label="Senha" type="password" />
                    <div className={styles.selectWrapper}>
                        <label htmlFor="role-create" className={styles.selectLabel}>Nível de usuário</label>
                        <select id="role-create" ref={newRoleRef} defaultValue="AUXILIAR" className={styles.select}>
                            <option value="ADMIN">Administrador</option>
                            <option value="COORDENADOR">Coordenador</option>
                            <option value="AUXILIAR">Auxiliar Docente</option>
                        </select>
                    </div>
                </form>
            ),
            confirmLabel: 'Criar',
            onConfirm: async () => {
                const dto: CreateUserDto = {
                    name: newNameRef.current?.value ?? '',
                    email: newEmailRef.current?.value ?? '',
                    password: newPasswordRef.current?.value ?? '',
                    role: newRoleRef.current?.value ?? null,
                };
                await createUser(dto);
                refetch();
            },
        });
    };

    function handleEdit(user: UserProps): void {
        openModal({
            icon: <MdEdit size={32} />,
            title: 'Editar usuário',
            message: (
                <form className={styles.editForm}>
                    <InputDefault ref={nameRef} label="Nome" defaultValue={user.name} />
                    <InputDefault ref={emailRef} label="E-mail" type="email" defaultValue={user.email} />
                    <div className={styles.selectWrapper}>
                        <label htmlFor="role-edit" className={styles.selectLabel}>Nível de usuário</label>
                        <select id="role-edit" ref={roleRef} defaultValue={user.role} className={styles.select}>
                            <option value="ADMIN">Administrador</option>
                            <option value="COORDENADOR">Coordenador</option>
                            <option value="AUXILIAR">Auxiliar Docente</option>
                        </select>
                    </div>
                </form>
            ),
            confirmLabel: 'Salvar',
            onConfirm: async () => {
                await editUser(user.id, {
                    name: nameRef.current?.value ?? '',
                    email: emailRef.current?.value ?? '',
                    role: roleRef.current?.value ?? '',
                });
                refetch();
            },
        });
    };

    function handleDelete(user: UserProps): void {
        openModal({
            icon: <MdDelete size={32} color='red' />,
            title: 'Confirmar exclusão',
            message: <p>Tem certeza que deseja excluir <strong>{user.name}</strong>?</p>,
            confirmLabel: 'Sim, excluir',
            onConfirm: async () => {
                await deleteUser(user.id);
                refetch();
            },
        });
    };
}
