'use client';
import { useCallback } from 'react';

type UpdateUserDto = {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
};

export function useEditUser() {
    return useCallback(async (id: number, dto: UpdateUserDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/patch/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha em useEditUser()');
        }
        return response.json();
    }, []);
}
