import { useCallback } from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { CreateParticipantDto } from '@/@Types/ParticipantsTypes';

type UseCreateParticipant = (dto: CreateParticipantDto) => Promise<void>;

export function useCreateParticipant(): UseCreateParticipant {
    const showToast = useToastStore(s => s.showToast);

    return useCallback(async (dto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/participants/create`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error((Array.isArray(err.message) ? err.message[0] : String(err.message ?? 'Falha ao inscrever participante').split(',')[0]).trim());
        }
        showToast({ message: 'Inscrição realizada, verifique o seu e-mail!', type: 'success' });
    }, [showToast]);
}
