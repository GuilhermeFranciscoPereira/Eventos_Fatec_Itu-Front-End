import { useRouter } from 'next/navigation';
import { CarouselProps } from '@/@Types/CarouselTypes';
import { useCallback, useState, useEffect } from 'react';

type useGetAllCarouselsProps = {
    loading: boolean;
    records: CarouselProps[];
    refetch: () => Promise<void>;
}

export function useGetAllCarousels(): useGetAllCarouselsProps {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [records, setRecords] = useState<CarouselProps[]>([]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel`, {
            credentials: 'include', headers: { 'X-CSRF-Token': csrfToken }
        });
        if (response.status === 403) return router.push('/');
        const data = await response.json();
        setRecords(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchAll() }, [fetchAll]);

    return { loading, records, refetch: fetchAll };
}
