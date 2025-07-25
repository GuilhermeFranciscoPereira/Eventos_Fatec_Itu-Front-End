'use client';
import { useCallback } from 'react';
import { useUserStore } from '@/stores/User/userStore';
import { useModalStore } from '@/stores/Modal/modalStore';

export function useLogout(): () => void {
    const setUser = useUserStore((s) => s.setUser);
    const openModal = useModalStore((s) => s.openModal);

    const logoutFlow = useCallback(async () => {
        try {
            const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then((r) => r.json());
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            });
            if (!response.ok) {
                console.error('Logout falhou:', await response.text());
                return;
            }
            useUserStore.getState().setUser(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log('Error in: useLogout() <---> Erro:', msg);
        }
    }, [setUser]);

    const handleLogout = useCallback(() => {
        openModal({
            title: 'Confirmação de Logout',
            message: <p>Tem certeza que deseja sair?</p>,
            confirmLabel: 'Sim, eu quero sair',
            onConfirm: logoutFlow,
        });
    }, [openModal, logoutFlow]);

    return handleLogout;
}
