import { useCallback } from 'react';
import { UpdateEventDto } from '@/@Types/EventTypes';
import { useToastStore } from '@/stores/useToastStore';

type useEditEventProps = {
    (id: number, dto: UpdateEventDto): Promise<void>;
};

export function useEditEvent(): useEditEventProps {
    const showToast = useToastStore((s) => s.showToast);

    return useCallback(async (id, dto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

        let response: Response;

        if (dto.image) {
            const form = new FormData();
            Object.entries(dto).forEach(([k, v]) => { if (v !== undefined && k !== 'image') form.append(k, String(v)) });
            form.append('image', dto.image);

            response = await fetch(
                `${process.env.NEXT_PUBLIC_URL_API}/events/patch/${id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'X-CSRF-Token': csrfToken },
                    body: form,
                },
            );
        } else {
            response = await fetch(
                `${process.env.NEXT_PUBLIC_URL_API}/events/patch/${id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify(dto),
                },
            );
        }

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Falha ao atualizar evento');
        }
        showToast({ message: 'Evento atualizado com sucesso!', type: 'Success' });
    },
        [showToast],
    );
}
