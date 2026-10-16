'use client';
import { MdLocationOn } from 'react-icons/md';
import RecordsPage from '@/components/RecordsPage';
import InputField from '@/components/Inputs/InputField';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import styles from '@/app/(pages)/(private)/AdminPage.module.css';
import { useLocationsPage } from '@/hooks/pages/(private)/Locations/useLocationsPage';
import type { LocationProps, CreateLocationDto, UpdateLocationDto } from '@/@Types/LocationsTypes';

export default function Locations(): React.ReactElement {
    const { editLocation, createLocation, deleteLocation, openModal, locations, loading, refetch, nameRef, newNameRef } = useLocationsPage();

    return (
        <RecordsPage<LocationProps>
            icon={<MdLocationOn />}
            rowIcon={<MdLocationOn />}
            title="Locais"
            description="Salas, auditórios e laboratórios onde os eventos acontecem. A agenda evita dois eventos no mesmo local e horário."
            nouns={{ one: 'local', many: 'locais', newLabel: 'Novo local' }}
            records={locations}
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

    function handleEdit(record: LocationProps): void {
        openModal({
            icon: <MdEdit />,
            title: 'Editar local',
            message: (
                <form className={styles.form}>
                    <InputField ref={nameRef} label="Nome do local" defaultValue={record.name} autoFocus />
                </form>
            ),
            confirmLabel: 'Salvar local',
            onConfirm: async () => {
                const dto: UpdateLocationDto = { name: nameRef.current?.value };
                await editLocation(record.id, dto);
                refetch();
            },
        });
    }

    function handleDelete(record: LocationProps): void {
        openModal({
            icon: <MdDelete />,
            title: 'Excluir local',
            message: <p>Você tem certeza que deseja excluir o local <strong>{record.name}</strong>? Essa ação não pode ser desfeita.</p>,
            confirmLabel: 'Sim, excluir',
            onConfirm: async () => {
                await deleteLocation(record.id);
                refetch();
            },
        });
    }
}
