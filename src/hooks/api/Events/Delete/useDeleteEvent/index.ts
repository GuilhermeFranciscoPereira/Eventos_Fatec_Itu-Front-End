import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { getApiErrorMessage } from '@/utils/apiErrorMessage';

type useDeleteEventProps = {
    (id: number): Promise<void>;
};

export function useDeleteEvent(): useDeleteEventProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/events/delete/${id}`, {
            method: 'DELETE',
            csrf: true,
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(getApiErrorMessage(err, 'Falha ao excluir evento.'));
        }
        showToast({ message: 'Evento deletado!', type: 'success' });
    },
        [showToast],
    );
}
