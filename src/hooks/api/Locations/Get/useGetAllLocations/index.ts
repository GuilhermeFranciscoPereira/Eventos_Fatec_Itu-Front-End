import { useRouter } from 'next/navigation';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { LocationProps, LocationPublicResponse } from '@/@Types/LocationsTypes';
import { useState, useEffect, useCallback } from 'react';

type useGetAllLocationsProps = {
    locations: LocationProps[];
    loading: boolean;
    refetch: () => Promise<void>;
};

export function useGetAllLocations(): useGetAllLocationsProps {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [locations, setLocations] = useState<LocationProps[]>([]);

    const fetchLocations = useCallback(async () => {
        setLoading(true);
        try {
            let response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/locations`, {
                credentials: 'include',
            });

            if (response.status === 401) {
                try {
                    await getMe();
                    response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/locations`, {
                        credentials: 'include',
                    });
                } catch (err: unknown) {
                    console.log('Error in: useGetAllLocations() <---> Erro:', err instanceof Error ? err.message : String(err));
                    return router.push('/');
                }
            }

            if (!response.ok) throw new Error('Falha para carregar os locais');
            setLocations(await response.json());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log(msg);
        } finally {
            setLoading(false);
        }
    }, [router]);

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
            console.log('Erro ao carregar locais públicos:', response.status);
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