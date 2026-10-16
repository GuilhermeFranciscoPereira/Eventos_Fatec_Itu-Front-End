import { memo, useMemo } from 'react';
import EmptyState from '@/components/EmptyState';
import styles from '@/components/Table/Table.module.css';

type ColumnSchema<T> = {
    id: string;
    header: string;
    accessor: (item: T) => React.ReactNode;
    cellRenderer?: (item: T) => React.ReactNode;
    variant?: 'primary' | 'actions';
    align?: 'left' | 'center' | 'right';
}

type TableEmptyState = {
    icon?: React.ReactNode;
    title: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
};

type TableProps<T> = {
    records: T[];
    hiddenOnMobile?: string[];
    schema: ColumnSchema<T>[];
    getIdentifier?: (item: T, index: number) => string | number;
    loading?: boolean;
    emptyState?: TableEmptyState;
    caption?: string;
}

const SKELETON_ROWS = 5;

export function TableToolbar({ children, count }: { children: React.ReactNode; count?: React.ReactNode }): React.ReactElement {
    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarControls}>{children}</div>
            {count !== undefined && <span className={styles.toolbarCount}>{count}</span>}
        </div>
    );
}

export const Table = memo(function Table<T>({ schema, records, hiddenOnMobile, getIdentifier = (_item: T, idx: number): string | number => idx, loading = false, emptyState, caption }: TableProps<T>): React.ReactElement {
    const cellClass = useMemo(() => {
        const map = new Map<string, string>();
        schema.forEach(col => {
            map.set(col.id, [
                styles.cell,
                hiddenOnMobile?.includes(col.id) ? styles.hideMobile : '',
                col.variant === 'primary' ? styles.primaryCell : '',
                col.variant === 'actions' ? styles.actionsCell : '',
                col.align ? styles[`align-${col.align}`] : '',
            ].filter(Boolean).join(' '));
        });
        return map;
    }, [schema, hiddenOnMobile]);

    const headerRow = useMemo(() => (
        <tr className={styles.headerRow}>
            {schema.map((col) => (
                <th key={col.id} scope="col" className={cellClass.get(col.id)}>
                    {col.header}
                </th>
            ))}
        </tr>
    ), [schema, cellClass]);

    const bodyRows = useMemo(() => records.map((record, rowIndex) => (
        <tr key={getIdentifier(record, rowIndex)} className={styles.row} style={{ '--row-index': Math.min(rowIndex, 12) } as React.CSSProperties}>
            {schema.map((col) => (
                <td key={col.id} className={cellClass.get(col.id)} data-label={col.header}>
                    {col.variant === 'actions'
                        ? <div className={styles.actionsGroup}>{col.cellRenderer ? col.cellRenderer(record) : col.accessor(record)}</div>
                        : col.cellRenderer ? col.cellRenderer(record) : col.accessor(record)}
                </td>
            ))}
        </tr>
    )), [records, schema, getIdentifier, cellClass]);

    const skeletonRows = useMemo(() => Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`} className={styles.skeletonRow} aria-hidden>
            {schema.map((col, colIndex) => (
                <td key={col.id} className={cellClass.get(col.id)}>
                    <span className={styles.skeleton} style={{ width: `${55 + ((rowIndex * 7 + colIndex * 13) % 40)}%` }} />
                </td>
            ))}
        </tr>
    )), [schema, cellClass]);

    const isEmpty = !loading && records.length === 0;

    return (
        <div className={`${styles.container} ${loading && records.length > 0 ? styles.refreshing : ''}`} aria-busy={loading}>
            {loading && records.length > 0 && <span className={styles.progress} aria-hidden />}
            <div className={styles.wrapper}>
                {isEmpty ? (
                    <EmptyState
                        icon={emptyState?.icon}
                        title={emptyState?.title ?? 'Nenhum item por aqui ainda'}
                        description={emptyState?.description}
                        action={emptyState?.action}
                    />
                ) : (
                    <table className={styles.table}>
                        {caption && <caption className="visuallyHidden">{caption}</caption>}
                        <thead>{headerRow}</thead>
                        <tbody>{loading && records.length === 0 ? skeletonRows : bodyRows}</tbody>
                    </table>
                )}
            </div>
        </div>
    )

}) as <T>(props: TableProps<T>) => React.ReactElement;
