import { useCallback } from 'react';
import { Location } from '@/@Types/EventTypes';

type useGetAvailabilityDatesProps = {
    (location: Location): Promise<string[]>;
};

export function useGetAvailabilityDates(): useGetAvailabilityDatesProps {
    return useCallback(async (loc: Location) => {
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/availability/dates?location=${encodeURIComponent(loc)}`, { credentials: 'include' });
        if (!response.ok) {
            const err = await response.json();
            console.log(err)
            throw new Error(err.message || 'Falha ao buscar datas disponíveis');
        }
        return (await response.json()) as string[];
    }, []);
}
