import { useCallback } from 'react';
import { useToastStore } from '@/stores/Toast/toastStore';

type useDeleteUserProps = {
    (id: number): Promise<void>
}

export function useDeleteUser(): useDeleteUserProps {
    const showToast = useToastStore((s) => s.showToast);
    
    return useCallback(async (id: number) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao excluir usuário');
        }
        showToast({ message: 'Usuário deletado com sucesso!', type: 'Success' });
    }, [showToast]);
}
