'use client';
import { useRouter } from 'next/navigation';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { useToastStore } from '@/stores/useToastStore';
import { useState, useEffect, useCallback } from 'react';
import { ParticipantProps } from '@/@Types/ParticipantsTypes';

type UseGetParticipantsReturn = {
    participants: ParticipantProps[];
    loading: boolean;
    refetch: () => Promise<void>;
};

export function useGetAllParticipants(eventId: number): UseGetParticipantsReturn {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const showToast = useToastStore((s) => s.showToast);
    const [participants, setParticipants] = useState<ParticipantProps[]>([]);

    const fetchParticipants = useCallback(async () => {
        setLoading(true);
        try {
            let response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/participants/event/${eventId}`, { credentials: 'include' });
            if (response.status === 401) {
                try {
                    await getMe();
                    response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/participants/event/${eventId}`, { credentials: 'include' });
                }
                catch (err: unknown) {
                    console.log('Error in: useCodeInputValidation() <---> Erro:', err instanceof Error ? err.message : String(err));
                    return router.push('/');
                }
            }
            if (!response.ok) throw new Error('Falha para carregar as categorias');
            setParticipants(await response.json());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showToast({ message: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [eventId, showToast, router]);

    useEffect(() => { fetchParticipants() }, [fetchParticipants]);

    return { participants, loading, refetch: fetchParticipants };
}
