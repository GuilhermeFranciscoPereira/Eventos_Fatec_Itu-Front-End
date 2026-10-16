import { useRouter } from 'next/navigation';
import { useToastStore } from '@/stores/useToastStore';
import { apiFetch } from '@/hooks/api/client';
import { useState, useEffect, useCallback } from 'react';
import { EventProps, EventPublicResponse } from '@/@Types/EventTypes';
import { getApiErrorMessage } from '@/utils/apiErrorMessage';

type useGetAllEventsProps = {
    events: EventProps[];
    loading: boolean;
    refetch: () => Promise<void>;
};

type useGetAllEventsPublicProps = {
    datas: EventPublicResponse[];
    loading: boolean;
    refetch: () => Promise<void>;
}

export function useGetAllEvents(): useGetAllEventsProps {
    const router = useRouter();
    const showToast = useToastStore(s => s.showToast);
    const [loading, setLoading] = useState<boolean>(true);
    const [events, setEvents] = useState<EventProps[]>([]);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/events`);
            if (response.status === 401) {
                router.push('/');
                return;
            }
            if (!response.ok) {
                const err = await response.json();
                throw new Error(getApiErrorMessage(err, 'Falha ao carregar eventos.'));
            }
            setEvents((await response.json()) as EventProps[]);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showToast({ message: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [router, showToast]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, refetch: fetchEvents };
}

export function useGetAllEventsPublic(): useGetAllEventsPublicProps {
    const [datas, setDatas] = useState<EventPublicResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAll = useCallback(async () => {
        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/publicAllEvents`);
            if (!response.ok) {
                return;
            }
            const data = (await response.json()) as EventPublicResponse[];
            setDatas(data);
        } catch {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll() }, [fetchAll]);

    return { datas, loading, refetch: fetchAll };
}
