import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';

type useDeleteCategoryProps = {
    (id: number): Promise<void>;
}

export function useDeleteCategory(): useDeleteCategoryProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao deletar categoria, erro em: useDeleteCategory()');
        }
        showToast({ message: 'Categoria excluída!', type: 'success' });
    }, [showToast]);
}
