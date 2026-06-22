import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';

type useDeleteCarouselProps = {
    (id: number): Promise<void>;
}

export function useDeleteCarousel(): useDeleteCarouselProps {
    const showToast = useToastStore(s => s.showToast);

    return useCallback(async (id: number) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/delete/${id}`, {
            method: 'DELETE',
            csrf: true,
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }
        showToast({ message: 'Imagem excluída!', type: 'success' });
    }, [showToast]);
}
