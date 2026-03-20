import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { UpdateLocationDto } from '@/@Types/LocationsTypes';

type useEditLocationProps = {
    (id: number, dto: UpdateLocationDto): Promise<void>;
};

export function useEditLocation(): useEditLocationProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, dto: UpdateLocationDto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/locations/patch/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao atualizar local');
        }

        showToast({ message: 'Local atualizado!', type: 'success' });
        return response.json();
    }, [showToast]);
}