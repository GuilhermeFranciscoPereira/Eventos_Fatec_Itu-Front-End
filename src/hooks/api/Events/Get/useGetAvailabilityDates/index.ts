import { useCallback } from 'react';

type useGetAvailabilityDatesProps = {
    (locationId: number): Promise<string[]>;
};

export function useGetAvailabilityDates(): useGetAvailabilityDatesProps {
    return useCallback(async (locationId: number) => {
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/availability/dates?locationId=${encodeURIComponent(locationId)}`, { credentials: 'include' });
        if (!response.ok) {
            const err = await response.json();
            console.log(err);
            throw new Error(err.message || 'Falha ao buscar datas disponíveis');
        }
        return (await response.json()) as string[];
    }, []);
}