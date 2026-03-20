'use client';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { TiGroup } from 'react-icons/ti';
import { Table } from '@/components/Table';
import { EventProps } from '@/@Types/EventTypes';
import { useUserStore } from '@/stores/useUserStore';
import { useModalStore } from '@/stores/useModalStore';
import ImageCloudinary from '@/components/ImageCloudinary';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import styles from '@/app/(pages)/(private)/Events/Events.module.css';
import { useGetAllEvents } from '@/hooks/api/Events/Get/useGetAllEvents';
import { useDeleteEvent } from '@/hooks/api/Events/Delete/useDeleteEvent';

export default function Events(): React.ReactElement {
    const deleteEvent = useDeleteEvent();
    const user = useUserStore((state) => state.user);
    const openModal = useModalStore((s) => s.openModal);
    const { events, loading, refetch } = useGetAllEvents();

    const schema = [
        {
            id: 'preview', header: 'Preview', accessor: (c: EventProps) => (
                <div className={styles.previewWrapper}>
                    <ImageCloudinary src={c.imageUrl} alt={c.name} sizes="100px" />
                </div>
            )
        },
        { id: 'name', header: 'Nome', accessor: (e: EventProps) => e.name },
        {
            id: 'dateTime',
            header: 'Data e horário',
            accessor: (e: EventProps) => {
                const date = new Date(e.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

                const start = new Date(e.startTime).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                });

                const end = new Date(e.endTime).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                });

                return `${date} às ${start} - ${end}`;
            },
        },
        {
            id: 'location',
            header: 'Local',
            accessor: (e: EventProps) =>
                e.locationName.toLowerCase() === 'outros' ? e.customLocation : e.locationName
        },
        {
            id: 'actions',
            header: 'Ações',
            accessor: () => null,
            cellRenderer: (e: EventProps) => (
                <div className={styles.actions}>
                    <Link href={`/Events/Participants/${e.id}`}>
                        <TiGroup
                            size={20}
                            className={styles.icon}
                        />
                    </Link>
                    {
                        user?.role !== 'AUXILIAR' &&
                        <>
                            <Link href={`/Events/${e.id}`}>
                                <MdEdit
                                    size={20}
                                    className={styles.icon}
                                />
                            </Link>
                            <MdDelete
                                size={20}
                                className={styles.icon}
                                onClick={() => handleDelete(e)}
                            />
                        </>
                    }
                </div>
            ),
        },
    ];

    return (
        <main className={styles.eventsPage}>
            <header className={styles.eventsPageHeader}>
                <h1>Gerenciamento de Eventos</h1>
                {
                    user?.role !== 'AUXILIAR' &&
                    <Link href={`/Events/new`}>
                        <button className={styles.createBtn}>
                            <MdAssignmentAdd /> Novo Evento
                        </button>
                    </Link>
                }
            </header>

            {loading && <Loader />}

            <Table<EventProps>
                records={events}
                schema={schema}
                getIdentifier={(e) => e.id}
                hiddenOnMobile={['name', 'dateTime', 'location']}
            />
        </main>
    );

    function handleDelete(e: EventProps): void {
        openModal({
            icon: <MdDelete size={32} color="red" />,
            title: 'Confirmar exclusão',
            message: (
                <p>
                    Tem certeza que deseja excluir o evento <strong>{e.name}</strong>?
                </p>
            ),
            confirmLabel: 'Sim, excluir',
            onConfirm: async () => {
                await deleteEvent(e.id);
                refetch();
            },
        });
    }
}
