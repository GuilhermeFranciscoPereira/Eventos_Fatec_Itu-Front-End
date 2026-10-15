import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { getApiErrorMessage } from '@/utils/apiErrorMessage';
import type { AuditLogDetail } from '@/@Types/AuditTypes';

export function useGetAuditLogById(): (id: number) => Promise<AuditLogDetail> {
    return useCallback(async (id: number) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/audit/${id}`);
        const body = await response.json();
        if (!response.ok) throw new Error(getApiErrorMessage(body, 'Não foi possível carregar os detalhes deste registro.'));
        return body as AuditLogDetail;
    }, []);
}
