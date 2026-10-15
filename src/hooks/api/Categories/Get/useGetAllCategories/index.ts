import { useRouter } from 'next/navigation';
import { useToastStore } from '@/stores/useToastStore';
import { apiFetch } from '@/hooks/api/client';
import { CategoryProps, CategoryPublicResponse } from '@/@Types/CategoriesTypes';
import { useState, useEffect, useCallback } from 'react';

type useGetAllCategoriesProps = {
    categories: CategoryProps[];
    loading: boolean;
    refetch: () => Promise<void>;
}

export function useGetAllCategories(): useGetAllCategoriesProps {
    const router = useRouter();
    const showToast = useToastStore(s => s.showToast);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<CategoryProps[]>([]);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/categories`);
            if (response.status === 401) {
                router.push('/');
                return;
            }
            if (!response.ok) throw new Error('Falha para carregar as categorias');
            setCategories(await response.json());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showToast({ message: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [router, showToast]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    return { categories, loading, refetch: fetchCategories };
}

export function useGetAllCategoriesPublic() {
    const [datas, setDatas] = useState<CategoryPublicResponse[]>([]);

    const fetchAll = useCallback(async () => {
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/categories/publicAllCategories`);
        if (!response.ok) {
            return;
        }
        const data = (await response.json()) as CategoryPublicResponse[];
        setDatas(data);
    }, []);

    useEffect(() => { fetchAll() }, [fetchAll]);

    return { datas };
}
