import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { CreateLocationDto } from '@/@Types/LocationsTypes';

type useCreateLocationProps = {
    (dto: CreateLocationDto): Promise<void>;
};

export function useCreateLocation(): useCreateLocationProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (dto: CreateLocationDto) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/locations/create`, {
            method: 'POST',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
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
