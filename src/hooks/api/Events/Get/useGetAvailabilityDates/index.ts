import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';

type useGetAvailabilityDatesProps = {
    (locationId: number): Promise<string[]>;
};

export function useGetAvailabilityDates(): useGetAvailabilityDatesProps {
    return useCallback(async (locationId: number) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/events/availability/dates?locationId=${encodeURIComponent(locationId)}`);
        if (!response.ok) {
            const err = await response.json();
            console.log(err);
            throw new Error(err.message || 'Falha ao buscar datas disponíveis');
        }
        return (await response.json()) as string[];
    }, []);
}
