import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { UpdateCourseDto } from '@/@Types/CoursesTypes';

type useEditCourseProps = {
    (id: number, dto: UpdateCourseDto): Promise<void>
}

export function useEditCourse(): useEditCourseProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, dto: UpdateCourseDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/courses/patch/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
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
