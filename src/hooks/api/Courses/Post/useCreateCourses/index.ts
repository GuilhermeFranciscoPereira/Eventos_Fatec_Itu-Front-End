import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';

export type CreateCourseDto = { name: string };

type useCreateCourseProps = {
    (dto: CreateCourseDto): Promise<void>;
}

export function useCreateCourse(): useCreateCourseProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (dto: CreateCourseDto) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/courses/create`, {
            method: 'POST',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
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
