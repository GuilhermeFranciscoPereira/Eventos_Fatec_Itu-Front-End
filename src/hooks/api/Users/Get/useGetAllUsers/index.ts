import { useRouter } from 'next/navigation';
import { UserProps } from '@/@Types/UsersTypes';
import { useState, useEffect, useCallback } from 'react';

type useGetAllUsersProps = {
    users: UserProps[];
    loading: boolean;
    refetch: () => Promise<void>;
}

export function useGetAllUsers(): useGetAllUsersProps {
    const router = useRouter();
    const [users, setUsers] = useState<UserProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, { credentials: 'include' });
            if (response.status === 403) return router.push('/');
            if (!response.ok) throw new Error('Falha ao buscar usuários');
            const data = await response.json();
            setUsers(data);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log(`Erro em useGetAllUsers(): ${msg}`);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchUsers() }, [fetchUsers]);

    return { users, loading, refetch: fetchUsers };
}
