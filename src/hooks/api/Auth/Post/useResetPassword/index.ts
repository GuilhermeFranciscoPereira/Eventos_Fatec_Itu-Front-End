import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type usePasswordResetRequestProps = {
    emailRef: React.RefObject<HTMLInputElement | null>;
    handleRequest: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loading: boolean;
    error: string | null;
    stage: "request" | "confirm";
}

type usePasswordResetConfirmProps = {
    newPasswordRef: React.RefObject<HTMLInputElement | null>;
    confirmPasswordRef: React.RefObject<HTMLInputElement | null>;
    handleConfirm: (code: string) => Promise<void>;
    loading: boolean;
}

export function usePasswordResetRequest(): usePasswordResetRequestProps {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [stage, setStage] = useState<'request' | 'confirm'>('request');
    const emailRef: React.RefObject<HTMLInputElement | null> = useRef(null);

    const handleRequest = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const email = emailRef.current?.value.trim() ?? '';
        if (!email) {
            setError('Preencha seu e-mail');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

            const resp = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/request-reset-password`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
                body: JSON.stringify({ email })
            });
            const data = await resp.json();
            if (!resp.ok) {
                setError(data.message || `Erro ${resp.status}`);
                return;
            }
            setStage('confirm');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            console.log('Error in: usePasswordResetRequest() <---> Erro:', msg);
        } finally {
            setLoading(false);
        }
    };

    return { emailRef, handleRequest, loading, error, stage };
}

export function usePasswordResetConfirm(): usePasswordResetConfirmProps {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const newPasswordRef: React.RefObject<HTMLInputElement | null> = useRef(null);
    const confirmPasswordRef: React.RefObject<HTMLInputElement | null> = useRef(null);

    const handleConfirm = async (code: string): Promise<void> => {
        const newPwd = newPasswordRef.current?.value ?? '';
        const confirmPwd = confirmPasswordRef.current?.value ?? '';
        if (!newPwd) { throw new Error('Nova senha vazia') };
        if (newPwd !== confirmPwd) {
            const msg = 'As senhas não são iguais';
            throw new Error(msg);
        }

        setLoading(true);

        try {
            const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(res => res.json());

            const resp = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/reset-password`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
                body: JSON.stringify({ code, newPassword: newPwd })
            });
            const data = await resp.json();
            if (!resp.ok) {
                throw new Error(data.message || 'Código inválido');
            }
            router.push('/Login');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log('Error in: usePasswordResetConfirm() <---> Erro:', msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { newPasswordRef, confirmPasswordRef, handleConfirm, loading };
}
