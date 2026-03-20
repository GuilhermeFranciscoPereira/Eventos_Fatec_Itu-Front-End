import { useCallback } from 'react';
import { AvailabilityTime } from '@/@Types/EventTypes';

type useGetAvailabilityTimesProps = {
    (locationId: number, date: string, exceptId?: number): Promise<AvailabilityTime[]>;
};

export function useGetAvailabilityTimes(): useGetAvailabilityTimesProps {
    return useCallback(async (locationId, date, exceptId) => {
        const url = new URL(`${process.env.NEXT_PUBLIC_URL_API}/events/availability/times`);
        url.searchParams.set('locationId', String(locationId));
        url.searchParams.set('date', date);
        if (exceptId !== undefined) url.searchParams.set('exceptId', String(exceptId));

        const response: Response = await fetch(url.toString(), { credentials: 'include' });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao buscar horários disponíveis');
        }
        return (await response.json()) as AvailabilityTime[];
    }, []);
}