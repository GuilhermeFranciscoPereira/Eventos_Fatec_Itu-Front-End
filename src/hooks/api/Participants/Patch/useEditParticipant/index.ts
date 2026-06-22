import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';

type UseEditParticipantProps = (id: number, isPresent: boolean) => Promise<void>;

export function useEditParticipant(): UseEditParticipantProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, isPresent: boolean) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/participants/patch/${id}`, {
            method: 'PATCH',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPresent }),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao atualizar participante');
        }
        showToast({ message: 'Presença atualizada!', type: 'success' });
    }, [showToast]);
}
