import { useMemo, useState } from 'react';

function normalize(text: string): string {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function useTableSearch<T>(records: T[], getSearchText: (record: T) => Array<string | null | undefined>) {
    const [query, setQuery] = useState<string>('');

    const filtered = useMemo(() => {
        const term = normalize(query);
        if (!term) return records;
        return records.filter(record => getSearchText(record).some(value => value && normalize(value).includes(term)));
    }, [records, query, getSearchText]);

    return { query, setQuery, filtered };
}
