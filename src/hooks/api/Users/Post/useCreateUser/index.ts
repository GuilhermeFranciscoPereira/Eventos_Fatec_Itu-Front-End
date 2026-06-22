import { useCallback } from 'react';
import { apiFetch } from '@/hooks/api/client';
import { CreateUserDto } from '@/@Types/UsersTypes';
import { useToastStore } from '@/stores/useToastStore';

type useCreateUserProps = {
  (dto: CreateUserDto): Promise<void>;
}

export function useCreateUser(): useCreateUserProps {
  const showToast = useToastStore((s) => s.showToast);

  return useCallback(async (dto: CreateUserDto) => {
    const response: Response = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/users/create`, {
      method: 'POST',
      csrf: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Falha ao registrar usuário');
    } 
   showToast({ message: 'Usuário criado!', type: 'success' });
    return response.json();
  }, [showToast]);
}
