import { useCallback } from 'react';
import { UpdateUserDto } from '@/@Types/UsersTypes';
import { useToastStore } from '@/stores/useToastStore';

type useEditUserProps = {
    (id: number, dto: UpdateUserDto): Promise<void>;
}

export function useEditUser(): useEditUserProps {
    const showToast = useToastStore((s) => s.showToast);

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
        showToast({ message: 'Usuário editado com sucesso!', type: 'Success' });
        return response.json();
    }, [showToast]);
}
