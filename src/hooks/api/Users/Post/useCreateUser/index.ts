import { useCallback } from 'react';
import { CreateUserDto } from '@/@Types/UsersTypes';
import { useToastStore } from '@/stores/Toast/toastStore';

type useCreateUserProps = {
  (dto: CreateUserDto): Promise<void>;
}

export function useCreateUser(): useCreateUserProps {
  const showToast = useToastStore((s) => s.showToast);

  return useCallback(async (dto: CreateUserDto) => {
    const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/create`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Falha ao registrar usuário');
    }
    showToast({ message: 'Usuário criado com sucesso!', type: 'Success' });
    return response.json();
  }, [showToast]);
}
