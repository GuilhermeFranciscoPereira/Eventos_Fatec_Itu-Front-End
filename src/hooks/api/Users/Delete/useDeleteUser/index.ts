import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';

type useDeleteUserProps = {
    (id: number): Promise<void>
}

export function useDeleteUser(): useDeleteUserProps {
    const showToast = useToastStore((s) => s.showToast);
    
    return useCallback(async (id: number) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/users/delete/${id}`, {
            method: 'DELETE',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao excluir usuário');
        }
        showToast({ message: 'Usuário deletado!', type: 'success' });
    }, [showToast]);
}
