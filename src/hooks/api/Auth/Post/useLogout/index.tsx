import { useCallback } from 'react';
import { SlLogout } from 'react-icons/sl';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/hooks/api/client';
import { useUserStore } from '@/stores/useUserStore';
import { useModalStore } from '@/stores/useModalStore';
import { useToastStore } from '@/stores/useToastStore';

type useLogout = {
    (): void;
}

export function useLogout(): useLogout {
    const router = useRouter();
    const openModal = useModalStore((s) => s.openModal);
    const showToast = useToastStore((s) => s.showToast);

    const executeLogout = useCallback(async () => {
        try {
            const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/logout`, {
                method: 'POST',
                csrf: true,
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                showToast({ message: 'Falha no logout, tente novamente!', type: 'error' });
                return;
            }
            router.push('/');
            showToast({ message: 'Logout realizado, até breve!', type: 'success' });
            useUserStore.getState().setUser(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log('Error in: useLogout() <---> Erro:', msg);
        }
    }, [showToast, router]);

    const handleLogout = useCallback(() => {
        openModal({
            title: 'Confirmação de Logout',
            message: <p>Tem certeza que deseja sair?</p>,
            icon: <SlLogout size={28}/>,
            confirmLabel: 'Sim, eu quero sair',
            onConfirm: executeLogout,
        });
    }, [openModal, executeLogout]);

    return handleLogout;
}
