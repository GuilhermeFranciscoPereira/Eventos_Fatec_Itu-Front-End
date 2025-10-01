import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { CreateCarouselDto } from '@/@Types/CarouselTypes';

type useCreateCarouselProps = {
    (dto: CreateCarouselDto): Promise<void>;
}

export function useCreateCarousel(): useCreateCarouselProps {
    const showToast = useToastStore(s => s.showToast);

    return useCallback(async (dto: CreateCarouselDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        const form = new FormData();
        form.append('name', dto.name);
        form.append('order', String(dto.order));
        form.append('isActive', String(dto.isActive));
        form.append('image', dto.image);

        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carousel/create`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-CSRF-Token': csrfToken },
            body: form
        });
        if (!response.ok) throw new Error((await response.json()).message);
        showToast({ message: 'Imagem adicionada!', type: 'success' });
    }, [showToast]);
}
