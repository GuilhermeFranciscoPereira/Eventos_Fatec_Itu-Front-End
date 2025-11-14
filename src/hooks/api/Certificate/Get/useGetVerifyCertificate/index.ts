'use client';
import { useState, useEffect, useCallback } from 'react';
import { CertificateVerifyResponse } from '@/@Types/CertificateTypes';

type UseGetVerifyCertificateReturn = {
    data: CertificateVerifyResponse | null;
    loading: boolean;
    refetch: (token?: string) => Promise<void>;
};

export function useGetVerifyCertificate(token: string): UseGetVerifyCertificateReturn {
    const [data, setData] = useState<CertificateVerifyResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async (tkn?: string) => {
        setLoading(true);
        try {
            const tk = tkn ?? token;
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/certificates/verify/${tk}`, { cache: 'no-store' });
            if (response.status === 404) {
                setData(null);
                return;
            }
            if (!response.ok) throw new Error('Falha ao validar certificado');
            setData(await response.json());
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return { data, loading, refetch: fetchData };
}
