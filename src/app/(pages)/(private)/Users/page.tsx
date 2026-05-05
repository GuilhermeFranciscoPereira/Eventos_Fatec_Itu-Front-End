'use client';
import { useState } from 'react';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdEdit, MdDelete } from 'react-icons/md';
import InputField from '@/components/Inputs/InputField';
import InputSelect from '@/components/Inputs/InputSelect';
import type { UserRoleTypes } from '@/@Types/UserJwtProps';
import type { UserProps, CreateUserDto } from '@/@Types/UsersTypes';
import styles from '@/app/(pages)/(private)/Users/Users.module.css';
import { useUsersPage } from '@/hooks/pages/(private)/Users/useUsersPage';

export default function Users(): React.ReactElement {
    const { editUser, createUser, deleteUser, openModal, users, loading, refetch, nameRef, emailRef, newNameRef, newEmailRef, newPasswordRef } = useUsersPage();

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
                hiddenOnMobile={['email', 'role']}
            />
        </main>
    );

    function handleCreate(): void {
        let selectedRole: UserRoleTypes = 'AUXILIAR';

        function CreateContent(): React.ReactElement {
            const [role, setRole] = useState<UserRoleTypes>('AUXILIAR');

            function handleRoleChange(value: string): void {
                const nextRole = value as UserRoleTypes;
                selectedRole = nextRole;
                setRole(nextRole);
            }

            return (
                <form className={styles.editForm}>
                    <InputField ref={newNameRef} label="Nome" autoFocus />
                    <InputField ref={newEmailRef} label="E-mail" type="email" />
                    <InputField ref={newPasswordRef} label="Senha" type="password" />
                    <br />
                    <InputSelect
                        label="Nível de usuário"
                        value={role}
                        onChange={handleRoleChange}
                        options={[
                            { label: 'Administrador', value: 'ADMIN' },
                            { label: 'Coordenador', value: 'COORDENADOR' },
                            { label: 'Auxiliar Docente', value: 'AUXILIAR' },
                        ]}
                    />
                </form>
            );
        }

        openModal({
            icon: <IoMdPersonAdd size={32} />,
            title: 'Criar novo usuário',
            message: <CreateContent />,
            confirmLabel: 'Criar',
            onConfirm: async () => {
                const dto: CreateUserDto = {
                    name: newNameRef.current?.value ?? '',
                    email: newEmailRef.current?.value ?? '',
                    password: newPasswordRef.current?.value ?? '',
                    role: selectedRole,
                };

                await createUser(dto);
                refetch();
            },
        });
    }

    function handleEdit(user: UserProps): void {
        let selectedRole: UserRoleTypes = user.role as UserRoleTypes;

        function EditContent(): React.ReactElement {
            const [role, setRole] = useState<UserRoleTypes>(user.role as UserRoleTypes);

            function handleRoleChange(value: string): void {
                const nextRole = value as UserRoleTypes;
                selectedRole = nextRole;
                setRole(nextRole);
            }

            return (
                <form className={styles.editForm}>
                    <InputField ref={nameRef} label="Nome" defaultValue={user.name} autoFocus />
                    <InputField ref={emailRef} label="E-mail" type="email" defaultValue={user.email} />
                    <br />
                    <InputSelect
                        label="Nível de usuário"
                        value={role}
                        onChange={handleRoleChange}
                        options={[
                            { label: 'Administrador', value: 'ADMIN' },
                            { label: 'Coordenador', value: 'COORDENADOR' },
                            { label: 'Auxiliar Docente', value: 'AUXILIAR' },
                        ]}
                    />
                </form>
            );
        }

        openModal({
            icon: <MdEdit size={32} />,
            title: 'Editar usuário',
            message: <EditContent />,
            confirmLabel: 'Salvar',
            onConfirm: async () => {
                await editUser(user.id, {
                    name: nameRef.current?.value ?? '',
                    email: emailRef.current?.value ?? '',
                    role: selectedRole,
                });
                refetch();
            },
        });
    }

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
