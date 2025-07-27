'use client';
import { useCallback } from 'react';

export type UpdateCategoryDto = { name?: string };

export function useEditCategory() {
    return useCallback(async (id: number, dto: UpdateCategoryDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(r => r.json());
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Falha ao atualizar categoria, erro em: useEditCategory()');
        }
        return res.json();
    }, []);
}
