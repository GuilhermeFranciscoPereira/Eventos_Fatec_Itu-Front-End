import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';

type useDeleteCourseProps = {
    (id: number): Promise<void>;
}

export function useDeleteCourse(): useDeleteCourseProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/courses/delete/${id}`, {
            method: 'DELETE',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao deletar curso, erro em: useDeleteCourse()');
        }
        showToast({ message: 'Curso excluído!', type: 'success' });
    }, [showToast]);
}
