import { useCallback } from 'react';
import { useUserStore } from '@/stores/User/userStore';

export function useLogout(): () => Promise<void> {
    const logout = useCallback(async () => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then((r) => r.json());

        try {
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
    }, []);

    return logout;
}
