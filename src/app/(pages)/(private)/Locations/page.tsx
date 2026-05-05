'use client';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import InputField from '@/components/Inputs/InputField';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import styles from '@/app/(pages)/(private)/Locations/Locations.module.css';
import { useLocationsPage } from '@/hooks/pages/(private)/Locations/useLocationsPage';
import type { LocationProps, CreateLocationDto, UpdateLocationDto } from '@/@Types/LocationsTypes';

export default function Locations(): React.ReactElement {
    const { editLocation, createLocation, deleteLocation, openModal, locations, loading, refetch, nameRef, newNameRef } = useLocationsPage();

    const schemaTable = [
        { id: 'name', header: 'Nome', accessor: (l: LocationProps) => l.name },
        {
            id: 'createdAt',
            header: 'Criado em',
            accessor: (l: LocationProps) => new Date(l.createdAt).toLocaleString('pt-BR').replace(',', ' -'),
        },
        {
            id: 'updatedAt',
            header: 'Editado última vez em',
            accessor: (l: LocationProps) => new Date(l.updatedAt).toLocaleString('pt-BR').replace(',', ' -'),
        },
        {
            id: 'actions',
            header: 'Ações',
            accessor: () => null,
            cellRenderer: (l: LocationProps) => (
                <div className={styles.actions}>
                    <MdEdit className={styles.icon} size={20} onClick={() => handleEdit(l)} />
                    <MdDelete className={styles.icon} size={20} onClick={() => handleDelete(l)} />
                </div>
            ),
        },
    ];

    return (
        <main className={styles.locationsPage}>
            <header className={styles.locationsPageHeader}>
                <h1>Gerenciamento de Locais</h1>
                <button className={styles.createBtn} onClick={handleCreate}>
                    <MdAssignmentAdd /> Criar novo local
                </button>
            </header>

            {loading && <Loader />}

            <Table<LocationProps>
                records={locations}
                schema={schemaTable}
                getIdentifier={l => l.id}
                hiddenOnMobile={['createdAt', 'updatedAt']}
            />
        </main>
    );

    // Below we have the modals

    function handleCreate(): void {
        openModal({
            icon: <MdAssignmentAdd size={32} />,
            title: 'Criar novo local',
            message: (
                <form className={styles.form}>
                    <InputField ref={newNameRef} label="Nome do local" autoFocus />
                </form>
            ),
            confirmLabel: 'Criar local',
            onConfirm: async () => {
                const dto: CreateLocationDto = { name: newNameRef.current?.value ?? '' };
                await createLocation(dto);
                refetch();
            },
        });
    }

    function handleEdit(location: LocationProps): void {
        openModal({
            icon: <MdEdit size={32} />,
            title: 'Editar local',
            message: (
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Nome do local" defaultValue={location.name} autoFocus />
                </form>
            ),
            confirmLabel: 'Salvar local',
            onConfirm: async () => {
                const dto: UpdateLocationDto = { name: nameRef.current?.value };
                await editLocation(location.id, dto);
                refetch();
            },
        });
    }

    function handleDelete(location: LocationProps): void {
        openModal({
            icon: <MdDelete size={32} color="red" />,
            title: 'Deletar local',
            message: <p>Você tem certeza que deseja excluir o local <strong>{location.name}</strong>?</p>,
            confirmLabel: 'Sim, deletar',
            onConfirm: async () => {
                await deleteLocation(location.id);
                refetch();
            },
        });
    }
}