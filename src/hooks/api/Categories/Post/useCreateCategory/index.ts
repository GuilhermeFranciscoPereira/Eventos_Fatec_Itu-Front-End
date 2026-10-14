import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { getApiErrorMessage } from '@/utils/apiErrorMessage';

export type CreateCategoryDto = { name: string };

type useCreateCategoryProps = {
    (dto: CreateCategoryDto): Promise<void>;
}

export function useCreateCategory(): useCreateCategoryProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (dto: CreateCategoryDto) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/categories/create`, {
            method: 'POST',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(getApiErrorMessage(err, 'Falha ao criar categoria.'));
        }
        showToast({ message: 'Categoria salva!', type: 'success' });
        return response.json();
    }, [showToast]);
}
