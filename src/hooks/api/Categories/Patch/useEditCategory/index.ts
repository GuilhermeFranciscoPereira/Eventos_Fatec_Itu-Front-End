import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { UpdateCategoryDto } from '@/@Types/CategoriesTypes';

type useEditCategoryProps = {
    (id: number, dto: UpdateCategoryDto): Promise<void>
}

export function useEditCategory(): useEditCategoryProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, dto: UpdateCategoryDto) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/categories/patch/${id}`, {
            method: 'PATCH',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao atualizar categoria, erro em: useEditCategory()');
        }
        showToast({ message: 'Categoria atualizada!', type: 'success' });
        return response.json();
    }, [showToast]);
}
