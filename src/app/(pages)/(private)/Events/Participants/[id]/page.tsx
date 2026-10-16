'use client';
import { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import PageHeader from '@/components/PageHeader';
import UserAvatar from '@/components/UserAvatar';
import Button from '@/components/Buttons/Button';
import SearchInput from '@/components/Inputs/SearchInput';
import { printSection } from '@/utils/printSection';
import { Table, TableToolbar } from '@/components/Table';
import StatCard, { StatGrid } from '@/components/StatCard';
import { TbFileTypePdf, TbPrinter } from 'react-icons/tb';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import { splitDateTime } from '@/utils/formatDate';
import type { ParticipantProps } from '@/@Types/ParticipantsTypes';
import { downloadSectionAsPdf } from '@/utils/downloadSectionAsPdf';
import { useTableSearch } from '@/hooks/components/useTableSearch';
import adminStyles from '@/app/(pages)/(private)/AdminPage.module.css';
import { useGetEventById } from '@/hooks/api/Events/Get/useGetEventById';
import { useEditParticipant } from '@/hooks/api/Participants/Patch/useEditParticipant';
import { useGetAllParticipants } from '@/hooks/api/Participants/Get/useGetAllParticipants';
import styles from '@/app/(pages)/(private)/Events/Participants/[id]/Participants.module.css';
import { MdGroups, MdHowToReg, MdPersonOff, MdInsights } from 'react-icons/md';

const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });

export default function Participants(): React.ReactElement {
    const { id } = useParams();
    const eventId = Number(id);
    const updateParticipant = useEditParticipant();
    const { event } = useGetEventById(eventId);
    const { participants, loading, refetch } = useGetAllParticipants(eventId);
    const getSearchText = useCallback((p: ParticipantProps) => [p.name, p.email, p.ra], []);
    const { query, setQuery, filtered } = useTableSearch(participants, getSearchText);

    const stats = useMemo(() => {
        const present = participants.filter(p => p.isPresent).length;
        return {
            present,
            absent: participants.length - present,
            rate: participants.length ? Math.round((present / participants.length) * 100) : 0,
        };
    }, [participants]);
    const firstLoad = loading && !participants.length;

    const schemaTable = [
        {
            id: 'name', header: 'Participante', variant: 'primary' as const, accessor: (p: ParticipantProps) => (
                <div className={adminStyles.cellMain}>
                    <UserAvatar name={p.name} size="sm" />
                    <div className={adminStyles.cellTexts}>
                        <span className={adminStyles.cellTitle}>{p.name}</span>
                        <span className={adminStyles.cellMeta}>{p.email}</span>
                    </div>
                </div>
            )
        },
        {
            id: 'ra',
            header: 'RA',
            accessor: (participant: ParticipantProps) => participant.ra
                ? <span className={styles.ra}>{participant.ra}</span>
                : <span className={`${adminStyles.chip} ${adminStyles.chipNeutral}`}>Visitante</span>,
        },
        {
            id: 'createdAt',
            header: 'Inscrito em',
            accessor: (p: ParticipantProps) => {
                const { date, time } = splitDateTime(p.createdAt);
                return <span className={adminStyles.dateCell}>{date}<span>às {time}</span></span>;
            },
        },
        {
            id: 'isPresent',
            header: 'Presença',
            accessor: () => null,
            cellRenderer: (p: ParticipantProps) => (
                <span className={`${styles.presence} ${p.isPresent ? styles.presenceOn : ''}`}>
                    <InputCheckbox
                        checked={p.isPresent}
                        aria-label={`Presença de ${p.name}`}
                        onChange={async () => {
                            await updateParticipant(p.id, !p.isPresent);
                            refetch();
                        }}
                    />
                    <span>{p.isPresent ? 'Presente' : 'Ausente'}</span>
                </span>
            ),
        },
    ];

    const eventDate = event ? dayFormatter.format(new Date(event.startDate)) : null;

    return (
        <main className={adminStyles.page}>
            <Button href="/Events" variant="ghost" size="sm" icon={<IoArrowBack />} className={styles.back}>Voltar para eventos</Button>

            <PageHeader
                icon={<MdGroups />}
                eyebrow="Lista de presença"
                title={event?.name ?? 'Participantes do evento'}
                description={event ? `${eventDate} · ${event.locationName.toLowerCase() === 'outros' ? event.customLocation : event.locationName} · com ${event.speakerName}` : 'Marque a presença de cada inscrito e exporte a lista.'}
                actions={(
                    <>
                        <Button variant="secondary" icon={<TbFileTypePdf />} onClick={() => downloadSectionAsPdf('idParticipantsTable', `Lista_de_Presença`)}>Exportar PDF</Button>
                        <Button variant="secondary" icon={<TbPrinter />} onClick={() => printSection('idParticipantsTable')}>Imprimir</Button>
                    </>
                )}
            />

            <StatGrid>
                <StatCard icon={<MdGroups />} label="Inscritos" value={participants.length} hint={event ? `de ${event.maxParticipants} vagas` : undefined} loading={firstLoad} />
                <StatCard icon={<MdHowToReg />} tone="success" label="Presentes" value={stats.present} loading={firstLoad} />
                <StatCard icon={<MdPersonOff />} tone="neutral" label="Ausentes" value={stats.absent} loading={firstLoad} />
                <StatCard icon={<MdInsights />} tone="info" label="Taxa de presença" value={`${stats.rate}%`} loading={firstLoad} />
            </StatGrid>

            <TableToolbar count={`${filtered.length} de ${participants.length}`}>
                <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nome, e-mail ou RA" label="Buscar participante" />
            </TableToolbar>

            <div id='idParticipantsTable'>
                <Table<ParticipantProps>
                    records={filtered}
                    schema={schemaTable}
                    getIdentifier={(p) => p.id}
                    hiddenOnMobile={['createdAt']}
                    loading={loading}
                    caption="Participantes"
                    emptyState={query
                        ? { title: 'Nenhum participante encontrado', description: `Nenhum resultado para "${query}".` }
                        : { title: 'Ainda não há inscritos', description: 'Assim que alguém se inscrever pela página do evento, aparece aqui.' }}
                />
            </div>
        </main>
    );
}
