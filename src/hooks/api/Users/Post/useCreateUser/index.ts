'use client';
import { useCallback } from 'react';

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export function useCreateUser() {
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
    return response.json();
  }, []);
}
