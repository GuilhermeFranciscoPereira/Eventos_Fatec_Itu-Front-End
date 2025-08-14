import { useRouter } from 'next/navigation';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
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
            let response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories`, {
                credentials: 'include',
            });
            if (response.status === 401) {
                try {
                    await getMe();
                    response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories`, { credentials: 'include' });
                }
                catch (err: unknown) {
                    console.log('Error in: useCodeInputValidation() <---> Erro:', err instanceof Error ? err.message : String(err));
                    return router.push('/');
                }
            }
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
