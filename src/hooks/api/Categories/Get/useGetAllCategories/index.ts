import { useRouter } from 'next/navigation';
import { CategoryProps } from '@/@Types/CategoriesTypes';
import { useState, useEffect, useCallback } from 'react';

type useGetAllCategoriesProps = {
    categories: CategoryProps[];
    loading: boolean;
    refetch: () => Promise<void>;
}

export function useGetAllCategories(): useGetAllCategoriesProps {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<CategoryProps[]>([]);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories`, {
                credentials: 'include',
            });
            if (response.status === 403) return router.push('/');
            if (!response.ok) throw new Error('Falha para carregar as categorias');
            setCategories(await response.json());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log(msg);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    return { categories, loading, refetch: fetchCategories };
}
