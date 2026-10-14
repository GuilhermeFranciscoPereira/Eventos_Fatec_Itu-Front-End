import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { getApiErrorMessage } from '@/utils/apiErrorMessage';

type useDeleteLocationProps = {
    (id: number): Promise<void>;
};

export function useDeleteLocation(): useDeleteLocationProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/locations/delete/${id}`, {
            method: 'DELETE',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(getApiErrorMessage(err, 'Falha ao excluir local.'));
        }

        showToast({ message: 'Local excluído!', type: 'success' });
    }, [showToast]);
}
