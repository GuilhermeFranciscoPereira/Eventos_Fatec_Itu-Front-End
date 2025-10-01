import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';

export type CreateCourseDto = { name: string };

type useCreateCourseProps = {
    (dto: CreateCourseDto): Promise<void>;
}

export function useCreateCourse(): useCreateCourseProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (dto: CreateCourseDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/courses/create`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao criar novo curso, erro em: useCreateCourse');
        }
        showToast({ message: 'Curso criado!', type: 'success' });
        return response.json();
    }, [showToast]);
}
