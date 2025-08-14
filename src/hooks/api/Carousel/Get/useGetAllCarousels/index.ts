import { useRouter } from 'next/navigation';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { useCallback, useState, useEffect } from 'react';
import { CarouselProps, CarouselPublicResponse } from '@/@Types/CarouselTypes';

type useGetAllCarouselsProps = {
    loading: boolean;
    records: CarouselProps[];
    refetch: () => Promise<void>;
}

type useGetAllCarouselsPublicProps = {
    records: CarouselPublicResponse[];
    refetch: () => Promise<void>;
};

export function useGetAllCarousels(): useGetAllCarouselsProps {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [records, setRecords] = useState<CarouselProps[]>([]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        let response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel`, {
            credentials: 'include', headers: { 'X-CSRF-Token': csrfToken }
        });
        if (response.status === 401) {
            try {
                await getMe();
                response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel`, { credentials: 'include', headers: { 'X-CSRF-Token': csrfToken } });
            }
            catch (err: unknown) {
                console.log('Error in: useCodeInputValidation() <---> Erro:', err instanceof Error ? err.message : String(err));
                return router.push('/');
            }
        }
        const data = await response.json();
        setRecords(data);
        setLoading(false);
    }, [router]);

    useEffect(() => { fetchAll() }, [fetchAll]);

    return { loading, records, refetch: fetchAll };
}

export function useGetAllCarouselsPublic(): useGetAllCarouselsPublicProps {
    const [records, setRecords] = useState<CarouselPublicResponse[]>([]);

    const fetchAll = useCallback(async () => {
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/publicAllCarousel`);
        if (!response.ok) {
            console.log('Erro ao carregar carrossel público:', response.status);
            return;
        }
        const data = (await response.json()) as CarouselPublicResponse[];
        setRecords(data);
    }, []);

    useEffect(() => { fetchAll() }, [fetchAll]);

    return { records, refetch: fetchAll };
} 