import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';

type useDeleteCourseProps = {
    (id: number): Promise<void>;
}

export function useDeleteCourse(): useDeleteCourseProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/courses/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao deletar curso, erro em: useDeleteCourse()');
        }
        showToast({ message: 'Curso excluído!', type: 'success' });
    }, [showToast]);
}
