import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';

export type CreateCategoryDto = { name: string };

type useCreateCategoryProps = {
    (dto: CreateCategoryDto): Promise<void>;
}

export function useCreateCategory(): useCreateCategoryProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (dto: CreateCategoryDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories/create`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao criar nova categoria, erro em: useCreateCategory');
        }
        showToast({ message: 'Categoria salva!', type: 'success' });
        return response.json();
    }, [showToast]);
}
