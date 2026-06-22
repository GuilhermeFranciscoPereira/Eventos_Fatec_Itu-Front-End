import type { UserJwtProps } from '@/@Types/UserJwtProps';

type ApiFetchOptions = RequestInit & {
    csrf?: boolean;
    retryOnUnauthorized?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_URL_API;
let refreshPromise: Promise<boolean> | null = null;

export async function getCsrfToken(): Promise<string> {
    const response = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
    if (!response.ok) throw new Error('Falha ao carregar token CSRF');
    const data = (await response.json()) as { csrfToken: string };
    return data.csrfToken;
}

async function setAuthenticatedUser(user: UserJwtProps | null): Promise<void> {
    if (typeof window === 'undefined') return;
    const { useUserStore } = await import('@/stores/useUserStore');
    useUserStore.getState().setUser(user);
}

async function loadAuthenticatedUser(): Promise<UserJwtProps | null> {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) return null;
    return (await response.json()) as UserJwtProps;
}

async function executeRefresh(): Promise<boolean> {
    try {
        const csrfToken = await getCsrfToken();
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-CSRF-Token': csrfToken },
        });

        return response.ok;
    } catch {
        return false;
    }
}

export async function refreshSession(syncUser = true): Promise<boolean> {
    if (!refreshPromise) {
        refreshPromise = executeRefresh().finally(() => {
            refreshPromise = null;
        });
    }

    const refreshed = await refreshPromise;

    if (syncUser) {
        const user = refreshed ? await loadAuthenticatedUser() : null;
        await setAuthenticatedUser(user);
    }

    return refreshed;
}

export async function apiFetch(input: string, options: ApiFetchOptions = {}): Promise<Response> {
    const { csrf = false, retryOnUnauthorized = true, headers, ...init } = options;
    const requestHeaders = new Headers(headers);

    if (csrf && !requestHeaders.has('X-CSRF-Token')) {
        requestHeaders.set('X-CSRF-Token', await getCsrfToken());
    }

    const requestInit: RequestInit = {
        ...init,
        credentials: 'include',
        headers: requestHeaders,
    };

    const response = await fetch(input, requestInit);

    if (response.status !== 401 || !retryOnUnauthorized) return response;

    const refreshed = await refreshSession();
    if (!refreshed) return response;

    const retryHeaders = new Headers(requestHeaders);
    if (csrf) retryHeaders.set('X-CSRF-Token', await getCsrfToken());

    return fetch(input, {
        ...requestInit,
        headers: retryHeaders,
    });
}
