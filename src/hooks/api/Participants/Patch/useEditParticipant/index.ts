import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';

type UseEditParticipantProps = (id: number, isPresent: boolean) => Promise<void>;

export function useEditParticipant(): UseEditParticipantProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, isPresent: boolean) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/participants/patch/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({ isPresent }),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao atualizar participante');
        }
        showToast({ message: 'Presença atualizada!', type: 'success' });
    }, [showToast]);
}
