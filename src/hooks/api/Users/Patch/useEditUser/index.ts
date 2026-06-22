import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { UpdateUserDto } from '@/@Types/UsersTypes';
import { useToastStore } from '@/stores/useToastStore';

type useEditUserProps = {
    (id: number, dto: UpdateUserDto): Promise<void>;
}

export function useEditUser(): useEditUserProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, dto: UpdateUserDto) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/users/patch/${id}`, {
            method: 'PATCH',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha em useEditUser()');
        }
        showToast({ message: 'Usuário editado!', type: 'success' });
        return response.json();
    }, [showToast]);
}
