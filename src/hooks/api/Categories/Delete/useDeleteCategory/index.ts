'use client';
import { useCallback } from 'react';

export type CategoryProps = { id: number; name: string };

export function useDeleteCategory() {
    return useCallback(async (id: number) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(r => r.json());
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Falha ao deletar categoria, erro em: useDeleteCategory()');
        }
    }, []);
}
