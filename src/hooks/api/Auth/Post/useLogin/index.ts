'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { UserRoleProps } from '@/@Types/UserRoleProps';
import { useUserStore } from '@/stores/User/userStore';
import { useToastStore } from '@/stores/Toast/toastStore';

type useLoginProps = {
  emailRef: React.RefObject<HTMLInputElement | null>;
  passwordRef: React.RefObject<HTMLInputElement | null>;
  loading: boolean;
  errors: { email?: string; password?: string };
  stage: 'request' | 'confirm';
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

type useTwoFactorProps = {
  submitCode: (code: string) => Promise<void>;
  loading: boolean;
  error: string | null
}

export function useLogin(): useLoginProps {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stage, setStage] = useState<'request' | 'confirm'>('request');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const raw = {
      email: emailRef.current?.value.trim() ?? '',
      password: passwordRef.current?.value ?? '',
    };

    if (!raw.email) {
      setErrors({ email: 'Preencha seu e-mail' });
      setLoading(false);
      return;
    }

    if (!raw.password) {
      setErrors({ password: 'Preencha sua senha' });
      setLoading(false);
      return;
    }

    try {
      const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

      const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/request-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        credentials: 'include',
        body: JSON.stringify(raw),
      });
      const payload = await response.json();

      if (!response.ok && !payload.requires2FA) {
        throw new Error(payload.message || 'Erro ao efetuar login');
      }

      if (payload.requires2FA || payload.message?.toLowerCase().includes('2fa')) {
        setStage('confirm');
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrors({ password: msg });
      console.log('Error in: useLogin() <---> Erro:', msg);
    } finally {
      setLoading(false);
    }
  }

  return { emailRef, passwordRef, loading, errors, stage, handleSubmit };
}

export function useTwoFactor(): useTwoFactorProps {
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function submitCode(code: string): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then((r) => r.json());

      const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (!response.ok) { throw new Error(data.message || 'Falha na validação do código 2FA') };

      const user: UserRoleProps | null = await getMe();
      if (user) { useUserStore.getState().setUser(user) };
      showToast({ message: 'Login realizado com sucesso, seja bem-vindo!', type: 'Success' });
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.log('Error in: useTwoFactor() <---> Erro:', msg);
    } finally {
      setLoading(false);
    }
  }

  return { submitCode, loading, error };
}