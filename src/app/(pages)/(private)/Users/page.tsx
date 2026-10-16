'use client';
import { useCallback, useMemo, useState } from 'react';
import { IoMdPersonAdd } from 'react-icons/io';
import PageHeader from '@/components/PageHeader';
import UserAvatar from '@/components/UserAvatar';
import Button from '@/components/Buttons/Button';
import IconButton from '@/components/Buttons/IconButton';
import InputField from '@/components/Inputs/InputField';
import InputSelect from '@/components/Inputs/InputSelect';
import SearchInput from '@/components/Inputs/SearchInput';
import { Table, TableToolbar } from '@/components/Table';
import StatCard, { StatGrid } from '@/components/StatCard';
import type { UserRoleTypes } from '@/@Types/UserJwtProps';
import { splitDateTime } from '@/utils/formatDate';
import { useTableSearch } from '@/hooks/components/useTableSearch';
import type { UserProps, CreateUserDto } from '@/@Types/UsersTypes';
import styles from '@/app/(pages)/(private)/AdminPage.module.css';
import { useUsersPage } from '@/hooks/pages/(private)/Users/useUsersPage';
import { MdEdit, MdDelete, MdAdminPanelSettings, MdSupervisorAccount, MdSchool } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';

const ROLE_OPTIONS = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Coordenador', value: 'COORDENADOR' },
    { label: 'Auxiliar Docente', value: 'AUXILIAR' },
];

const ROLE_LABELS: Record<string, string> = { ADMIN: 'Administrador', COORDENADOR: 'Coordenador', AUXILIAR: 'Auxiliar docente' };
const ROLE_CHIPS: Record<string, string> = { ADMIN: styles.chipBrand, COORDENADOR: styles.chipInfo, AUXILIAR: styles.chipSuccess };

export default function Users(): React.ReactElement {
    const { editUser, createUser, deleteUser, openModal, users, loading, refetch, nameRef, emailRef, newNameRef, newEmailRef, newPasswordRef } = useUsersPage();
    const getSearchText = useCallback((u: UserProps) => [u.name, u.email, ROLE_LABELS[u.role]], []);
    const { query, setQuery, filtered } = useTableSearch(users, getSearchText);

    const counts = useMemo(() => ({
        admin: users.filter(u => u.role === 'ADMIN').length,
        coord: users.filter(u => u.role === 'COORDENADOR').length,
        aux: users.filter(u => u.role === 'AUXILIAR').length,
    }), [users]);
    const firstLoad = loading && !users.length;

    const schemaTable = [
        {
            id: 'name', header: 'Usuário', variant: 'primary' as const, accessor: (u: UserProps) => (
                <div className={styles.cellMain}>
                    <UserAvatar name={u.name} />
                    <div className={styles.cellTexts}>
                        <span className={styles.cellTitle}>{u.name}</span>
                        <span className={styles.cellMeta}>{u.email}</span>
                    </div>
                </div>
            )
        },
        {
            id: 'role', header: 'Perfil', accessor: (u: UserProps) => (
                <span className={`${styles.chip} ${styles.chipDot} ${ROLE_CHIPS[u.role] ?? ''}`}>{ROLE_LABELS[u.role] ?? u.role}</span>
            )
        },
        {
            id: 'createdAt', header: 'Criado em', accessor: (u: UserProps) => {
                const { date, time } = splitDateTime(u.createdAt);
                return <span className={styles.dateCell}>{date}<span>às {time}</span></span>;
            }
        },
        {
            id: 'actions', header: 'Ações', variant: 'actions' as const, accessor: () => null, cellRenderer: (u: UserProps) => (
                <>
                    <IconButton label={`Editar ${u.name}`} tone="info" onClick={() => handleEdit(u)}><MdEdit /></IconButton>
                    <IconButton label={`Excluir ${u.name}`} tone="danger" onClick={() => handleDelete(u)}><MdDelete /></IconButton>
                </>
            )
        },
    ];

    return (
        <main className={styles.page}>
            <PageHeader
                icon={<FaUsers />}
                title="Usuários"
                description="Quem pode acessar a área administrativa e o que cada perfil pode fazer. Trocar a senha ou o perfil encerra as sessões abertas da pessoa."
                actions={<Button icon={<IoMdPersonAdd />} onClick={handleCreate}>Novo usuário</Button>}
            />

            <StatGrid>
                <StatCard icon={<FaUsers />} label="Total de usuários" value={users.length} loading={firstLoad} />
                <StatCard icon={<MdAdminPanelSettings />} label="Administradores" value={counts.admin} hint="Acesso completo e auditoria" loading={firstLoad} />
                <StatCard icon={<MdSupervisorAccount />} tone="info" label="Coordenadores" value={counts.coord} hint="Eventos, carrossel e cadastros" loading={firstLoad} />
                <StatCard icon={<MdSchool />} tone="success" label="Auxiliares docentes" value={counts.aux} hint="Eventos e presença" loading={firstLoad} />
            </StatGrid>

            <TableToolbar count={`${filtered.length} de ${users.length}`}>
                <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nome, e-mail ou perfil" label="Buscar usuário" />
            </TableToolbar>

            <Table<UserProps>
                records={filtered}
                schema={schemaTable}
                getIdentifier={(u) => u.id}
                hiddenOnMobile={['createdAt']}
                loading={loading}
                caption="Usuários"
                emptyState={query
                    ? { title: 'Nenhum usuário encontrado', description: `Nenhum resultado para "${query}".` }
                    : { title: 'Nenhum usuário cadastrado', action: <Button icon={<IoMdPersonAdd />} onClick={handleCreate}>Novo usuário</Button> }}
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
                <form className={styles.form}>
                    <InputField ref={newNameRef} label="Nome" autoFocus />
                    <InputField ref={newEmailRef} label="E-mail" type="email" />
                    <InputField ref={newPasswordRef} label="Senha" type="password" />
                    <div className={styles.formGroup}>
                        <InputSelect label="Nível de usuário" value={role} onChange={handleRoleChange} options={ROLE_OPTIONS} />
                    </div>
                </form>
            );
        }

        openModal({
            icon: <IoMdPersonAdd />,
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
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Nome" defaultValue={user.name} autoFocus />
                    <InputField ref={emailRef} label="E-mail" type="email" defaultValue={user.email} />
                    <div className={styles.formGroup}>
                        <InputSelect label="Nível de usuário" value={role} onChange={handleRoleChange} options={ROLE_OPTIONS} />
                    </div>
                </form>
            );
        }

        openModal({
            icon: <MdEdit />,
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
            icon: <MdDelete />,
            title: 'Confirmar exclusão',
            message: <p>Tem certeza que deseja excluir <strong>{user.name}</strong>? A pessoa perde o acesso imediatamente.</p>,
            confirmLabel: 'Sim, excluir',
            onConfirm: async () => {
                await deleteUser(user.id);
                refetch();
            },
        });
    };
}
