'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export type CategoryProps = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export function useGetAllCategories() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryProps[]>([]);

    const fetchCategories = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories`, {
                credentials: 'include',
            });
            if (response.status === 403) return router.push('/');
            if (!response.ok) throw new Error('Falha para carregar as categorias');
            setCategories(await response.json());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    return { categories, loading, error, refetch: fetchCategories };
}
