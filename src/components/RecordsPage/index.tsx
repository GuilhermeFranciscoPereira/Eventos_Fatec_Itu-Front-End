'use client';
import { useCallback, useMemo } from 'react';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Buttons/Button';
import IconButton from '@/components/Buttons/IconButton';
import SearchInput from '@/components/Inputs/SearchInput';
import { Table, TableToolbar } from '@/components/Table';
import StatCard, { StatGrid } from '@/components/StatCard';
import { useTableSearch } from '@/hooks/components/useTableSearch';
import { MdAdd, MdDelete, MdEdit, MdHistory, MdNewReleases } from 'react-icons/md';
import styles from '@/app/(pages)/(private)/AdminPage.module.css';
import { isWithinLastDays, relativeDay, splitDateTime } from '@/utils/formatDate';

export type SimpleRecord = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

type RecordsPageProps<T extends SimpleRecord> = {
    icon: React.ReactNode;
    rowIcon: React.ReactNode;
    title: string;
    description: string;
    nouns: { one: string; many: string; newLabel: string };
    records: T[];
    loading: boolean;
    onCreate: () => void;
    onEdit: (record: T) => void;
    onDelete: (record: T) => void;
};

export default function RecordsPage<T extends SimpleRecord>({ icon, rowIcon, title, description, nouns, records, loading, onCreate, onEdit, onDelete }: RecordsPageProps<T>): React.ReactElement {
    const getSearchText = useCallback((record: T) => [record.name], []);
    const { query, setQuery, filtered } = useTableSearch(records, getSearchText);

    const stats = useMemo(() => {
        const recent = records.filter(record => isWithinLastDays(record.createdAt, 30)).length;
        const lastUpdated = records.reduce<T | null>((latest, record) => (!latest || record.updatedAt > latest.updatedAt ? record : latest), null);
        return { recent, lastUpdated };
    }, [records]);

    const schema = [
        {
            id: 'name', header: 'Nome', variant: 'primary' as const, accessor: (record: T) => (
                <div className={styles.cellMain}>
                    <span className={styles.cellIcon} aria-hidden>{rowIcon}</span>
                    <div className={styles.cellTexts}>
                        <span className={styles.cellTitle}>{record.name}</span>
                        <span className={styles.cellMeta}>ID #{record.id}</span>
                    </div>
                </div>
            )
        },
        {
            id: 'createdAt', header: 'Criado em', accessor: (record: T) => {
                const { date, time } = splitDateTime(record.createdAt);
                return <span className={styles.dateCell}>{date}<span>às {time}</span></span>;
            }
        },
        {
            id: 'updatedAt', header: 'Última edição', accessor: (record: T) => {
                const { date, time } = splitDateTime(record.updatedAt);
                return <span className={styles.dateCell}>{date}<span>às {time}</span></span>;
            }
        },
        {
            id: 'actions', header: 'Ações', variant: 'actions' as const, accessor: () => null, cellRenderer: (record: T) => (
                <>
                    <IconButton label={`Editar ${record.name}`} tone="info" onClick={() => onEdit(record)}><MdEdit /></IconButton>
                    <IconButton label={`Excluir ${record.name}`} tone="danger" onClick={() => onDelete(record)}><MdDelete /></IconButton>
                </>
            ),
        },
    ];

    return (
        <main className={styles.page}>
            <PageHeader
                icon={icon}
                title={title}
                description={description}
                actions={<Button icon={<MdAdd />} onClick={onCreate}>{nouns.newLabel}</Button>}
            />

            <StatGrid>
                <StatCard icon={icon} label={`Total de ${nouns.many}`} value={records.length} loading={loading && !records.length} />
                <StatCard icon={<MdNewReleases />} tone="success" label="Criados nos últimos 30 dias" value={stats.recent} loading={loading && !records.length} />
                <StatCard
                    icon={<MdHistory />}
                    tone="info"
                    label="Última edição"
                    value={stats.lastUpdated ? relativeDay(stats.lastUpdated.updatedAt) : '—'}
                    hint={stats.lastUpdated?.name}
                    loading={loading && !records.length}
                />
            </StatGrid>

            <TableToolbar count={`${filtered.length} de ${records.length}`}>
                <SearchInput value={query} onChange={setQuery} placeholder={`Buscar ${nouns.one} pelo nome`} label={`Buscar ${nouns.one}`} />
            </TableToolbar>

            <Table<T>
                records={filtered}
                schema={schema}
                getIdentifier={record => record.id}
                hiddenOnMobile={['updatedAt']}
                loading={loading}
                caption={title}
                emptyState={query
                    ? { title: 'Nada encontrado', description: `Nenhum resultado para "${query}". Tente outro termo.` }
                    : { title: `Nenhum registro de ${nouns.many} ainda`, description: 'Cadastre o primeiro para que ele apareça nos eventos.', action: <Button icon={<MdAdd />} onClick={onCreate}>{nouns.newLabel}</Button> }}
            />
        </main>
    );
}
