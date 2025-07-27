import { useCallback } from 'react';
import { useToastStore } from '@/stores/Toast/toastStore';
import { UpdateCategoryDto } from '@/@Types/CategoriesTypes';

type useEditCategoryProps = {
    (id: number, dto: UpdateCategoryDto): Promise<void>
}

export function useEditCategory(): useEditCategoryProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, dto: UpdateCategoryDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories/patch/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao atualizar categoria, erro em: useEditCategory()');
        }
        showToast({ message: 'Categoria atualizada com sucesso!', type: 'Success' });
        return response.json();
    }, [showToast]);
}
