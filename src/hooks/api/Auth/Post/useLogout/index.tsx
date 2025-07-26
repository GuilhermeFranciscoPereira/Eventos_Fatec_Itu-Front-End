'use client';
import { useCallback } from 'react';
import { useUserStore } from '@/stores/User/userStore';
import { useModalStore } from '@/stores/Modal/modalStore';
import { useToastStore } from '@/stores/Toast/toastStore';
import { useRouter } from 'next/navigation';

export function useLogout(): () => void {
    const router = useRouter();
    const openModal = useModalStore((s) => s.openModal);
    const showToast = useToastStore((s) => s.showToast);

    const executeLogout = useCallback(async () => {
        try {
            const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then((r) => r.json());
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            });
            if (!response.ok) {
                showToast({ message: 'Falha no logout, tente novamente!', type: 'Error' });
                return;
            }
            router.push('/');
            showToast({ message: 'Logout realizado com sucesso!', type: 'Success' });
            useUserStore.getState().setUser(null);
        } catch (err: unknown) {
            showToast({ message: 'Falha no componente useLogout, entre em contato com o desenvolvedor.', type: 'Error' });
            const msg = err instanceof Error ? err.message : String(err);
            console.log('Error in: useLogout() <---> Erro:', msg);
        }
    }, [showToast, router]);

    const handleLogout = useCallback(() => {
        openModal({
            title: 'Confirmação de Logout',
            message: <p>Tem certeza que deseja sair?</p>,
            confirmLabel: 'Sim, eu quero sair',
            onConfirm: executeLogout,
        });
    }, [openModal, executeLogout]);

    return handleLogout;
}
