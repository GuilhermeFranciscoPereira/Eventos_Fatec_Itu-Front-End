'use client';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { TiGroup } from 'react-icons/ti';
import { Table } from '@/components/Table';
import type { EventProps } from '@/@Types/EventTypes';
import ImageCloudinary from '@/components/ImageCloudinary';
import { MdEdit, MdDelete, MdAssignmentAdd } from 'react-icons/md';
import styles from '@/app/(pages)/(private)/Events/Events.module.css';
import { useEventsPage } from '@/hooks/pages/(private)/Events/useEventsPage';

export default function Events(): React.ReactElement {
    const { deleteEvent, user, openModal, formatEventDateTime, getEventLocation, events, loading, refetch } = useEventsPage();

    const schemaTable = [
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
            accessor: formatEventDateTime
        },
        {
            id: 'location',
            header: 'Local',
            accessor: getEventLocation
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
                schema={schemaTable}
                getIdentifier={(e) => e.id}
                hiddenOnMobile={['name', 'dateTime', 'location']}
            />
        </main>
    );

    // Below we have the modal to delete

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
