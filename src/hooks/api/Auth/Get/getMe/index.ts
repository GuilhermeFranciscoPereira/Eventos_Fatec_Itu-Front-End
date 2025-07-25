import { UserRoleProps } from '@/@Types/UserRoleProps';

export async function getMe(): Promise<UserRoleProps | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) return null;
        const user = (await response.json()) as UserRoleProps;
        return user;
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log('Error in: useCodeInputValidation() <---> Erro:', msg);
        return null;
    }
}
