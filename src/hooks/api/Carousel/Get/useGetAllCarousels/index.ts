import { useRouter } from 'next/navigation';
import { apiFetch } from '@/hooks/api/client';
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
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel`);
        if (response.status === 401) {
            router.push('/');
            setLoading(false);
            return;
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
