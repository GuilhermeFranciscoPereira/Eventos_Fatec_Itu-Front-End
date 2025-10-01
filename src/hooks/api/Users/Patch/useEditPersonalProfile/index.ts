import { useCallback } from 'react';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { useUserStore } from '@/stores/useUserStore';
import { useToastStore } from '@/stores/useToastStore';

type UpdateProfileDto = {
    name?: string;
    email?: string;
    photo?: File;
};

type useEditPersonalProfile = {
    (dto: UpdateProfileDto): Promise<void>
};

export function useEditPersonalProfile(): useEditPersonalProfile {
    const showToast = useToastStore(s => s.showToast);

    return useCallback(async (dto: UpdateProfileDto) => {
        const form = new FormData();
        if (dto.name) form.append('name', dto.name);
        if (dto.email) form.append('email', dto.email);
        if (dto.photo) form.append('photo', dto.photo);

        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/profile`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'X-CSRF-Token': csrfToken },
            body: form
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao atualizar perfil');
        }
        showToast({ message: 'Perfil atualizado!', type: 'success' });
        const updated = await getMe();
        useUserStore.getState().setUser(updated);
    }, [showToast]);
}
