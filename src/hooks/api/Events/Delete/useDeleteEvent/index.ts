import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';

type useDeleteEventProps = {
    (id: number): Promise<void>;
};

export function useDeleteEvent(): useDeleteEventProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'X-CSRF-Token': csrfToken },
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao excluir evento');
        }
        showToast({ message: 'Evento deletado com sucesso!', type: 'Success' });
    },
        [showToast],
    );
}
