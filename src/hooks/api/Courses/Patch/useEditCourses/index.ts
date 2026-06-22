import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { UpdateCourseDto } from '@/@Types/CoursesTypes';

type useEditCourseProps = {
    (id: number, dto: UpdateCourseDto): Promise<void>
}

export function useEditCourse(): useEditCourseProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, dto: UpdateCourseDto) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/courses/patch/${id}`, {
            method: 'PATCH',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao atualizar curso, erro em: useEditCourse()');
        }
        showToast({ message: 'Curso atualizado!', type: 'success' });
        return response.json();
    }, [showToast]);
}
