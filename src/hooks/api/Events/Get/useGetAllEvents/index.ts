import { useRouter } from 'next/navigation';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { useState, useEffect, useCallback } from 'react';
import { EventProps, EventPublicResponse } from '@/@Types/EventTypes';

type useGetAllEventsProps = {
    events: EventProps[];
    loading: boolean;
    refetch: () => Promise<void>;
};

type useGetAllEventsPublicProps = {
    datas: EventPublicResponse[];
    refetch: () => Promise<void>;
}

export function useGetAllEvents(): useGetAllEventsProps {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [events, setEvents] = useState<EventProps[]>([]);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            let response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events`, {
                credentials: 'include'
            });
            if (response.status === 401) {
                try {
                    await getMe();
                    response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events`, { credentials: 'include' });
                }
                catch (err: unknown) {
                    console.log('Error in: useCodeInputValidation() <---> Erro:', err instanceof Error ? err.message : String(err));
                    return router.push('/');
                }
            }
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

export function useGetAllEventsPublic(): useGetAllEventsPublicProps {
    const [datas, setDatas] = useState<EventPublicResponse[]>([]);

    const fetchAll = useCallback(async () => {
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/publicAllEvents`);
        if (!response.ok) {
            console.log('Erro ao carregar eventos públicos:', response.status);
            return;
        }
        const data = (await response.json()) as EventPublicResponse[];
        setDatas(data);
    }, []);

    useEffect(() => { fetchAll() }, [fetchAll]);

    return { datas, refetch: fetchAll };
}
