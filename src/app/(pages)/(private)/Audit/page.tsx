'use client';
import Loader from '@/components/Loader';
import { FaEye } from 'react-icons/fa';
import { Table } from '@/components/Table';
import { MdRefresh, MdFilterAltOff } from 'react-icons/md';
import AuditDetailModal from '@/components/AuditDetailModal';
import type { AuditLogSummary, AuditOutcome } from '@/@Types/AuditTypes';
import styles from '@/app/(pages)/(private)/Audit/Audit.module.css';
import { useAuditPage } from '@/hooks/pages/(private)/Audit/useAuditPage';
import { actionLabel, formatBrasiliaDateTime, OUTCOME_LABELS, RESOURCE_LABELS, resourceLabel } from '@/utils/auditLabels';

const OUTCOME_OPTIONS: Array<{ value: '' | AuditOutcome; label: string }> = [
    { value: '', label: 'Todos' },
    { value: 'SUCCESS', label: OUTCOME_LABELS.SUCCESS },
    { value: 'ERROR', label: OUTCOME_LABELS.ERROR },
    { value: 'DENIED', label: OUTCOME_LABELS.DENIED },
];

// Lets long e-mails wrap before the @ instead of in the middle of a word.
function BreakableEmail({ email }: { email: string }): React.ReactElement {
    const at = email.indexOf('@');
    if (at <= 0) return <>{email}</>;
    return <>{email.slice(0, at)}<wbr />{email.slice(at)}</>;
}

export default function Audit(): React.ReactElement {
    const { data, loading, refetch, page, setPage, filters, updateFilter, clearFilters, searchInput, setSearchInput, hasFilters, detail, openDetail, closeDetail } = useAuditPage();
    const firstItem = data.total ? (data.page - 1) * data.pageSize + 1 : 0;
    const lastItem = Math.min(data.page * data.pageSize, data.total);

    const schemaTable = [
        {
            id: 'when', header: 'Quando', accessor: (log: AuditLogSummary) => {
                const [date, time] = formatBrasiliaDateTime(log.createdAt).split(', ');
                return (
                    <span className={`${styles.stack} ${styles.noWrap}`}>
                        <strong>{date}</strong>
                        <span className={styles.muted}>{time}</span>
                    </span>
                );
            }
        },
        {
            id: 'actor', header: 'Responsável', accessor: (log: AuditLogSummary) => (
                <span className={styles.stack}>
                    <strong>{log.actorName ?? 'Visitante (sem login)'}</strong>
                    <span className={styles.muted}>{log.actorEmail ? <BreakableEmail email={log.actorEmail} /> : 'Acesso público'}</span>
                </span>
            )
        },
        {
            id: 'what', header: 'O que aconteceu', accessor: (log: AuditLogSummary) => (
                <span className={styles.stack}>
                    <span>{log.summary}</span>
                    <span className={styles.muted}>{actionLabel(log.action)}</span>
                    {/* The result column is hidden on phones, so the result shows up here. */}
                    <span className={`${styles.badge} ${styles[`badge${log.outcome}`]} ${styles.mobileOnly}`}>{OUTCOME_LABELS[log.outcome]}</span>
                </span>
            )
        },
        {
            id: 'target', header: 'Registro afetado', accessor: (log: AuditLogSummary) => (
                <span className={styles.stack}>
                    <strong>{resourceLabel(log.resource)}</strong>
                    {(log.targetLabel || log.targetId) && (
                        <span className={styles.muted}>{log.targetLabel ?? 'Registro'}{log.targetId ? ` (ID: ${log.targetId})` : ''}</span>
                    )}
                </span>
            )
        },
        {
            id: 'outcome', header: 'Resultado', accessor: (log: AuditLogSummary) => (
                <span className={`${styles.badge} ${styles[`badge${log.outcome}`]}`}>{OUTCOME_LABELS[log.outcome]}</span>
            )
        },
        {
            id: 'detail', header: 'Detalhe', accessor: () => null, cellRenderer: (log: AuditLogSummary) => (
                <span className={styles.eyeCell}>
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => openDetail(log.id)}
                        aria-label={`Ver detalhes do registro ${log.id}`}
                        title="Ver detalhes"
                    >
                        <FaEye aria-hidden />
                    </button>
                </span>
            )
        },
    ];

    return (
        <main className={styles.auditPage}>
            <header className={styles.auditPageHeader}>
                <div>
                    <h1>Auditoria</h1>
                    <p className={styles.subtitle}>Quem fez o quê, quando e com qual resultado. Senhas, códigos e tokens nunca são registrados.</p>
                </div>
                <button type="button" className={styles.refreshBtn} onClick={() => void refetch()}>
                    <MdRefresh aria-hidden /> Atualizar
                </button>
            </header>

            <form className={styles.filters} onSubmit={(e) => e.preventDefault()} role="search" aria-label="Filtrar registros de auditoria">
                <label className={`${styles.field} ${styles.fieldSearch}`}>
                    <span>Buscar</span>
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Responsável, ação ou registro"
                        maxLength={120}
                    />
                </label>

                <label className={styles.field}>
                    <span>Resultado</span>
                    <select value={filters.outcome} onChange={(e) => updateFilter('outcome', e.target.value as '' | AuditOutcome)}>
                        {OUTCOME_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </label>

                <label className={styles.field}>
                    <span>Área</span>
                    <select value={filters.resource} onChange={(e) => updateFilter('resource', e.target.value)}>
                        <option value="">Todas</option>
                        {Object.entries(RESOURCE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </label>

                <label className={styles.field}>
                    <span>De</span>
                    <input type="date" value={filters.from} max={filters.to || undefined} onChange={(e) => updateFilter('from', e.target.value)} />
                </label>

                <label className={styles.field}>
                    <span>Até</span>
                    <input type="date" value={filters.to} min={filters.from || undefined} onChange={(e) => updateFilter('to', e.target.value)} />
                </label>

                <button type="button" className={styles.clearBtn} onClick={clearFilters} disabled={!hasFilters}>
                    <MdFilterAltOff aria-hidden /> Limpar filtros
                </button>
            </form>

            {loading && <Loader />}

            <Table<AuditLogSummary>
                records={data.items}
                schema={schemaTable}
                getIdentifier={(log) => log.id}
                hiddenOnMobile={['actor', 'target', 'outcome']}
            />

            <nav className={styles.pagination} aria-label="Paginação da auditoria">
                <p aria-live="polite">
                    {data.total ? `Mostrando ${firstItem}–${lastItem} de ${data.total.toLocaleString('pt-BR')} registros` : 'Nenhum registro encontrado'}
                </p>
                <div className={styles.pageControls}>
                    <button type="button" onClick={() => setPage(page - 1)} disabled={page <= 1 || loading}>Anterior</button>
                    <span>Página {data.page} de {data.totalPages}</span>
                    <button type="button" onClick={() => setPage(page + 1)} disabled={page >= data.totalPages || loading}>Próxima</button>
                </div>
            </nav>

            <AuditDetailModal open={detail.open} loading={detail.loading} log={detail.log} error={detail.error} onClose={closeDetail} />
        </main>
    );
}
