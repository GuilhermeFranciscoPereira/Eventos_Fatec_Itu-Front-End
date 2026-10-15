import { useRouter } from 'next/navigation';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '@/utils/apiErrorMessage';
import type { AuditFilters, AuditLogPage } from '@/@Types/AuditTypes';

type useGetAuditLogsProps = {
    data: AuditLogPage;
    loading: boolean;
    refetch: () => Promise<void>;
};

export const AUDIT_PAGE_SIZE = 20;

const EMPTY_PAGE: AuditLogPage = { items: [], total: 0, page: 1, pageSize: AUDIT_PAGE_SIZE, totalPages: 1 };

export function useGetAuditLogs(filters: AuditFilters, page: number): useGetAuditLogsProps {
    const router = useRouter();
    const showToast = useToastStore(s => s.showToast);
    const [data, setData] = useState<AuditLogPage>(EMPTY_PAGE);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), pageSize: String(AUDIT_PAGE_SIZE) });
            if (filters.search.trim()) params.set('search', filters.search.trim());
            if (filters.outcome) params.set('outcome', filters.outcome);
            if (filters.resource) params.set('resource', filters.resource);
            if (filters.from) params.set('from', filters.from);
            if (filters.to) params.set('to', filters.to);

            const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/audit?${params.toString()}`);
            if (response.status === 401) {
                router.push('/');
                return;
            }
            if (response.status === 403) {
                showToast({ message: 'Somente administradores podem ver a auditoria.', type: 'error' });
                router.push('/');
                return;
            }
            const body = await response.json();
            if (!response.ok) throw new Error(getApiErrorMessage(body, 'Falha ao buscar os registros de auditoria'));
            setData(body as AuditLogPage);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showToast({ message: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [filters, page, router, showToast]);

    useEffect(() => { fetchLogs() }, [fetchLogs]);

    return { data, loading, refetch: fetchLogs };
}
