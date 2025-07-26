'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export type UserProps = {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
};

export function useGetAllUsers() {
    const router = useRouter();
    const [users, setUsers] = useState<UserProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, { credentials: 'include' });
            if (res.status === 403) router.push('/');
            if (!res.ok) throw new Error('Falha ao buscar usuários');
            const data = await res.json();
            setUsers(data);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(`Erro em useGetAllUsers(): ${msg}`);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchUsers() }, [fetchUsers]);

    return { users, loading, error, refetch: fetchUsers };
}
