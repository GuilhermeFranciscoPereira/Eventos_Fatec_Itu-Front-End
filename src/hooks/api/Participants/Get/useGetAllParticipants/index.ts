'use client';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/hooks/api/client';
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
            const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/participants/event/${eventId}`);
            if (response.status === 401) {
                router.push('/');
                return;
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
