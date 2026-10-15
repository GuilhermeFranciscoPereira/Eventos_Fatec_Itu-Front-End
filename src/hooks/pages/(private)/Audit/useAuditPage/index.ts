import { useCallback, useEffect, useRef, useState } from 'react';
import type { AuditFilters, AuditLogDetail } from '@/@Types/AuditTypes';
import { useGetAuditLogs } from '@/hooks/api/Audit/Get/useGetAuditLogs';
import { useGetAuditLogById } from '@/hooks/api/Audit/Get/useGetAuditLogById';

export const EMPTY_AUDIT_FILTERS: AuditFilters = { search: '', outcome: '', resource: '', from: '', to: '' };

const SEARCH_DELAY_MS = 400;

type DetailState = {
    open: boolean;
    loading: boolean;
    log: AuditLogDetail | null;
    error: string | null;
};

export function useAuditPage() {
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState<AuditFilters>(EMPTY_AUDIT_FILTERS);
    const [searchInput, setSearchInput] = useState<string>('');
    const [detail, setDetail] = useState<DetailState>({ open: false, loading: false, log: null, error: null });
    const { data, loading, refetch } = useGetAuditLogs(filters, page);
    const getAuditLogById = useGetAuditLogById();
    const requestedId = useRef<number | null>(null);

    // Waits for a pause in typing so each key press does not hit the API.
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setFilters(current => (current.search === searchInput ? current : { ...current, search: searchInput }));
            setPage(1);
        }, SEARCH_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [searchInput]);

    const updateFilter = useCallback(<K extends keyof AuditFilters>(key: K, value: AuditFilters[K]) => {
        setFilters(current => ({ ...current, [key]: value }));
        setPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setSearchInput('');
        setFilters(EMPTY_AUDIT_FILTERS);
        setPage(1);
    }, []);

    const openDetail = useCallback(async (id: number) => {
        requestedId.current = id;
        setDetail({ open: true, loading: true, log: null, error: null });
        try {
            const log = await getAuditLogById(id);
            if (requestedId.current === id) setDetail({ open: true, loading: false, log, error: null });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (requestedId.current === id) setDetail({ open: true, loading: false, log: null, error: msg });
        }
    }, [getAuditLogById]);

    const closeDetail = useCallback(() => {
        requestedId.current = null;
        setDetail({ open: false, loading: false, log: null, error: null });
    }, []);

    const hasFilters = Boolean(searchInput || filters.outcome || filters.resource || filters.from || filters.to);

    return { data, loading, refetch, page, setPage, filters, updateFilter, clearFilters, searchInput, setSearchInput, hasFilters, detail, openDetail, closeDetail };
}
