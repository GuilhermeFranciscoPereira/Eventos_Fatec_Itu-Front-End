import { useState, useEffect } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import type { Course, EventPublicResponse, Semester } from '@/@Types/EventTypes';

type useEventDetailProps = {
    event: EventPublicResponse | null;
    loading: boolean;
}

export function useEventDetail(id: number): useEventDetailProps {
    const [event, setEvent] = useState<EventPublicResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const showToast = useToastStore(s => s.showToast);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/${id}`);
                if (!response.ok) throw new Error(`Status: ${response.status}`);
                const data = (await response.json()) as EventPublicResponse;
                setEvent(data);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                showToast({ message: `Falha ao carregar evento: ${msg}`, type: 'Error' });
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id, showToast]);


    return { event, loading };
}
