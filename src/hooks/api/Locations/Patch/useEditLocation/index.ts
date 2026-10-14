import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { useToastStore } from '@/stores/useToastStore';
import { UpdateLocationDto } from '@/@Types/LocationsTypes';
import { getApiErrorMessage } from '@/utils/apiErrorMessage';

type useEditLocationProps = {
    (id: number, dto: UpdateLocationDto): Promise<void>;
};

export function useEditLocation(): useEditLocationProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id: number, dto: UpdateLocationDto) => {
        const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/locations/patch/${id}`, {
            method: 'PATCH',
            csrf: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(getApiErrorMessage(err, 'Falha ao atualizar local.'));
        }

        showToast({ message: 'Local atualizado!', type: 'success' });
        return response.json();
    }, [showToast]);
}
