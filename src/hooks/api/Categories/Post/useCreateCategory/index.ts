'use client';
import { useCallback } from 'react';

export type CreateCategoryDto = { name: string };

export function useCreateCategory() {
    return useCallback(async (dto: CreateCategoryDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(r => r.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao criar nova categoria, erro em: useCreateCategory');
        }
        return response.json();
    }, []);
}
