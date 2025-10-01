import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';

type useDeleteCarouselProps = {
    (id: number): Promise<void>;
}

export function useDeleteCarousel(): useDeleteCarouselProps {
    const showToast = useToastStore(s => s.showToast);

    return useCallback(async (id: number) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'X-CSRF-Token': csrfToken }
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }
        showToast({ message: 'Imagem excluída!', type: 'success' });
    }, [showToast]);
}
