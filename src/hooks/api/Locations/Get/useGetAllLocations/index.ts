import { useRouter } from 'next/navigation';
import { useToastStore } from '@/stores/useToastStore';
import { apiFetch } from '@/hooks/api/client';
import { LocationProps, LocationPublicResponse } from '@/@Types/LocationsTypes';
import { useState, useEffect, useCallback } from 'react';

type useGetAllLocationsProps = {
    locations: LocationProps[];
    loading: boolean;
    refetch: () => Promise<void>;
};

export function useGetAllLocations(): useGetAllLocationsProps {
    const router = useRouter();
    const showToast = useToastStore(s => s.showToast);
    const [loading, setLoading] = useState<boolean>(true);
    const [locations, setLocations] = useState<LocationProps[]>([]);

    const fetchLocations = useCallback(async () => {
        setLoading(true);
        try {
            const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/locations`);

            if (response.status === 401) {
                router.push('/');
                return;
            }

            if (!response.ok) throw new Error('Falha para carregar os locais');
            setLocations(await response.json());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showToast({ message: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [router, showToast]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return { locations, loading, refetch: fetchLocations };
}

export function useGetAllLocationsPublic() {
    const [datas, setDatas] = useState<LocationPublicResponse[]>([]);

    const fetchAll = useCallback(async () => {
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/locations/publicAllLocations`);
        if (!response.ok) {
            return;
        }
        const data = (await response.json()) as LocationPublicResponse[];
        setDatas(data);
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return { datas };
}
