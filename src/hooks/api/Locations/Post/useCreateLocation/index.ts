import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { CreateLocationDto } from '@/@Types/LocationsTypes';

type useCreateLocationProps = {
    (dto: CreateLocationDto): Promise<void>;
};

export function useCreateLocation(): useCreateLocationProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (dto: CreateLocationDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/locations/create`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao criar novo local');
        }

        showToast({ message: 'Local salvo!', type: 'success' });
        return response.json();
    }, [showToast]);
}