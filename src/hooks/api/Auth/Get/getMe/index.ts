import { UserJwtProps } from '@/@Types/UserJwtProps';

export async function getMe(): Promise<UserJwtProps | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) return null;
        const user = (await response.json()) as UserJwtProps;
        return user;
    } catch (err: unknown) {
        console.log('Error in: useCodeInputValidation() <---> Erro:', err instanceof Error ? err.message : String(err));
        return null;
    }
}
