'use client';
import { useCallback } from 'react';

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export function useRegisterUser() {
  return useCallback(async (dto: RegisterDto) => {
    const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());
    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/register`, {
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
