import { memo, useMemo } from 'react';
import { MdScreenRotation } from 'react-icons/md';
import styles from '@/components/Table/Table.module.css';

type ColumnSchema<T> = {
    id: string;
    header: string;
    accessor: (item: T) => React.ReactNode;
    cellRenderer?: (item: T) => React.ReactNode;
}

type TableProps<T> = {
    records: T[];
    hiddenOnMobile?: string[];
    schema: ColumnSchema<T>[];
    getIdentifier?: (item: T, index: number) => string | number;
}

export const Table = memo(function Table<T>({ schema, records, hiddenOnMobile, getIdentifier = (_item: T, idx: number): string | number => idx }: TableProps<T>): React.ReactElement {
    const headerRow = useMemo(() => (
        <tr className={styles.headerRow}>
            {schema.map((col) => (
                <th key={col.id} className={` ${styles.cell} ${hiddenOnMobile && hiddenOnMobile.includes(col.id) ? styles.hideMobile : ''}`}>
                    {col.header}
                </th>
            ))}
        </tr>
    ), [schema, hiddenOnMobile])

    const bodyRows = useMemo(() => records.map((record, rowIndex) => (
        <tr key={getIdentifier(record, rowIndex)} className={styles.row}>
            {schema.map((col) => (
                <td key={col.id} className={` ${styles.cell} ${hiddenOnMobile && hiddenOnMobile.includes(col.id) ? styles.hideMobile : ''}`}>
                    {col.cellRenderer ? col.cellRenderer(record) : col.accessor(record)}
                </td>
            ))}
        </tr>
    )), [records, schema, getIdentifier, hiddenOnMobile])

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {!(records.length > 0) ? (
                    <div className={styles.noRecords}>Nenhum item disponível</div>
                ) : (
                    <table className={styles.table}>
                        <thead>{headerRow}</thead>
                        <tbody>{bodyRows}</tbody>
                    </table>
                )}
            </div>
            <div className={styles.mobileNotice}>
                <MdScreenRotation size={40} />
                <p>Vire o dispositivo para ver todos os dados</p>
            </div>
        </div>
    )

}) as <T>(props: TableProps<T>) => React.ReactElement;
