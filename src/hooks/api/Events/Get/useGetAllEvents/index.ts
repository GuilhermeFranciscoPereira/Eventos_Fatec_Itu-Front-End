import { useRouter } from 'next/navigation';
import { EventProps } from '@/@Types/EventTypes';
import { useState, useEffect, useCallback } from 'react';

type useGetAllEventsProps = {
    events: EventProps[];
    loading: boolean;
    refetch: () => Promise<void>;
};

export function useGetAllEvents(): useGetAllEventsProps {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [events, setEvents] = useState<EventProps[]>([]);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events`, { credentials: 'include' });
            if (response.status === 403) return router.push('/');
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Falha ao carregar eventos');
            }
            setEvents((await response.json()) as EventProps[]);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log('Error in: useGetAllEvents() <---> Erro:', msg);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, refetch: fetchEvents };
}
