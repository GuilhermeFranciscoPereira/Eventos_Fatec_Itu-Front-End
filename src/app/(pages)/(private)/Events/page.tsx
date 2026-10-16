'use client';
import { useCallback, useMemo, useState } from 'react';
import { TiGroup } from 'react-icons/ti';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Buttons/Button';
import { GiPartyPopper } from 'react-icons/gi';
import IconButton from '@/components/Buttons/IconButton';
import SearchInput from '@/components/Inputs/SearchInput';
import { Table, TableToolbar } from '@/components/Table';
import StatCard, { StatGrid } from '@/components/StatCard';
import type { EventProps } from '@/@Types/EventTypes';
import { nowInEventClock } from '@/utils/formatDate';
import ImageCloudinary from '@/components/ImageCloudinary';
import { useTableSearch } from '@/hooks/components/useTableSearch';
import adminStyles from '@/app/(pages)/(private)/AdminPage.module.css';
import styles from '@/app/(pages)/(private)/Events/Events.module.css';
import { useEventsPage } from '@/hooks/pages/(private)/Events/useEventsPage';
import { MdEdit, MdDelete, MdAssignmentAdd, MdOpenInNew, MdUpcoming, MdToday, MdEventAvailable } from 'react-icons/md';

type EventStatus = 'finished' | 'live' | 'today' | 'full' | 'scheduled';
type StatusFilter = 'all' | 'upcoming' | 'finished';

const STATUS_INFO: Record<EventStatus, { label: string; className: string }> = {
    live: { label: 'Acontecendo', className: adminStyles.chipSuccess },
    today: { label: 'Hoje', className: adminStyles.chipWarning },
    full: { label: 'Lotado', className: adminStyles.chipBrand },
    scheduled: { label: 'Agendado', className: adminStyles.chipInfo },
    finished: { label: 'Encerrado', className: adminStyles.chipNeutral },
};

const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

function getStatus(event: EventProps, now: number): EventStatus {
    const start = new Date(event.startTime).getTime();
    const end = new Date(event.endTime).getTime();
    if (end < now) return 'finished';
    if (start <= now) return 'live';
    if (new Date(event.startDate).toISOString().slice(0, 10) === new Date(now).toISOString().slice(0, 10)) return 'today';
    if (event.currentParticipants !== undefined && event.currentParticipants >= event.maxParticipants) return 'full';
    return 'scheduled';
}

export default function Events(): React.ReactElement {
    const { deleteEvent, user, openModal, getEventLocation, events, loading, refetch } = useEventsPage();
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const canManage = user?.role !== 'AUXILIAR';
    const [now] = useState<number>(() => nowInEventClock());

    const byStatus = useMemo(() => events.filter(event => {
        if (statusFilter === 'all') return true;
        const finished = getStatus(event, now) === 'finished';
        return statusFilter === 'finished' ? finished : !finished;
    }), [events, statusFilter, now]);

    const getSearchText = useCallback((event: EventProps) => [event.name, event.speakerName, getEventLocation(event)], [getEventLocation]);
    const { query, setQuery, filtered } = useTableSearch(byStatus, getSearchText);

    const stats = useMemo(() => {
        const statuses = events.map(event => getStatus(event, now));
        return {
            upcoming: statuses.filter(status => status !== 'finished').length,
            today: statuses.filter(status => status === 'today' || status === 'live').length,
            finished: statuses.filter(status => status === 'finished').length,
        };
    }, [events, now]);
    const firstLoad = loading && !events.length;

    const schemaTable = [
        {
            id: 'event', header: 'Evento', variant: 'primary' as const, accessor: (e: EventProps) => (
                <div className={styles.eventCell}>
                    <div className={styles.thumb}>
                        <ImageCloudinary src={e.imageUrl} alt="" sizes="(max-width: 640px) 100vw, 220px" className={styles.thumbImage} />
                    </div>
                    <div className={adminStyles.cellTexts}>
                        <span className={adminStyles.cellTitle}>{e.name}</span>
                        <span className={adminStyles.cellMeta}>com {e.speakerName}</span>
                    </div>
                </div>
            )
        },
        {
            id: 'dateTime', header: 'Data e horário', accessor: (e: EventProps) => {
                const startDate = dayFormatter.format(new Date(e.startDate));
                const endDate = e.endDate ? dayFormatter.format(new Date(e.endDate)) : null;
                return (
                    <span className={adminStyles.dateCell}>
                        {endDate && endDate !== startDate ? `${startDate} – ${endDate}` : startDate}
                        <span>{timeFormatter.format(new Date(e.startTime))} às {timeFormatter.format(new Date(e.endTime))}</span>
                    </span>
                );
            }
        },
        { id: 'location', header: 'Local', accessor: (e: EventProps) => getEventLocation(e) },
        {
            id: 'seats', header: 'Inscrições', accessor: (e: EventProps) => {
                const current = e.currentParticipants ?? 0;
                const percent = e.maxParticipants ? Math.min(100, Math.round((current / e.maxParticipants) * 100)) : 0;
                return (
                    <div className={adminStyles.progressCell}>
                        <div className={adminStyles.progressBar} aria-hidden><span style={{ width: `${percent}%` }} /></div>
                        <span className={adminStyles.progressLabel}>{current} de {e.maxParticipants} ({percent}%)</span>
                    </div>
                );
            }
        },
        {
            id: 'status', header: 'Situação', accessor: (e: EventProps) => {
                const status = getStatus(e, now);
                return <span className={`${adminStyles.chip} ${adminStyles.chipDot} ${STATUS_INFO[status].className} ${status === 'live' ? styles.livePulse : ''}`}>{STATUS_INFO[status].label}</span>;
            }
        },
        {
            id: 'actions',
            header: 'Ações',
            variant: 'actions' as const,
            accessor: () => null,
            cellRenderer: (e: EventProps) => (
                <>
                    <IconButton label="Participantes" tone="brand" href={`/Events/Participants/${e.id}`}><TiGroup /></IconButton>
                    <IconButton label="Ver página pública" href={`/EventDetail/${e.id}`}><MdOpenInNew /></IconButton>
                    {canManage && (
                        <>
                            <IconButton label="Editar" tone="info" href={`/Events/${e.id}`}><MdEdit /></IconButton>
                            <IconButton label="Excluir" tone="danger" onClick={() => handleDelete(e)}><MdDelete /></IconButton>
                        </>
                    )}
                </>
            ),
        },
    ];

    return (
        <main className={adminStyles.page}>
            <PageHeader
                icon={<GiPartyPopper />}
                title="Eventos"
                description="Crie, edite e acompanhe os eventos da agenda: inscrições, situação e lista de presença."
                actions={canManage ? <Button href="/Events/new" icon={<MdAssignmentAdd />}>Novo evento</Button> : undefined}
            />

            <StatGrid>
                <StatCard icon={<GiPartyPopper />} label="Total de eventos" value={events.length} loading={firstLoad} />
                <StatCard icon={<MdUpcoming />} tone="info" label="Próximos e em andamento" value={stats.upcoming} loading={firstLoad} />
                <StatCard icon={<MdToday />} tone="warning" label="Acontecendo hoje" value={stats.today} loading={firstLoad} />
                <StatCard icon={<MdEventAvailable />} tone="neutral" label="Encerrados" value={stats.finished} loading={firstLoad} />
            </StatGrid>

            <TableToolbar count={`${filtered.length} de ${events.length}`}>
                <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nome, palestrante ou local" label="Buscar evento" />
                <div className={styles.segmented} role="group" aria-label="Filtrar por situação">
                    {([['all', 'Todos'], ['upcoming', 'Próximos'], ['finished', 'Encerrados']] as const).map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            className={statusFilter === value ? styles.segmentActive : ''}
                            aria-pressed={statusFilter === value}
                            onClick={() => setStatusFilter(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </TableToolbar>

            <Table<EventProps>
                records={filtered}
                schema={schemaTable}
                getIdentifier={(e) => e.id}
                hiddenOnMobile={['location', 'seats']}
                loading={loading}
                caption="Eventos"
                emptyState={query || statusFilter !== 'all'
                    ? { title: 'Nenhum evento encontrado', description: 'Ajuste a busca ou o filtro de situação.' }
                    : { title: 'Nenhum evento cadastrado', description: 'Crie o primeiro evento para ele aparecer na agenda pública.', action: canManage ? <Button href="/Events/new" icon={<MdAssignmentAdd />}>Novo evento</Button> : undefined }}
            />
        </main>
    );

    // Below we have the modal to delete

    function handleDelete(e: EventProps): void {
        openModal({
            icon: <MdDelete />,
            title: 'Confirmar exclusão',
            message: (
                <p>
                    Tem certeza que deseja excluir o evento <strong>{e.name}</strong>? As inscrições dele também serão removidas.
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
