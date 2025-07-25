import { useState } from 'react';
import { createRef, FormEvent, useMemo } from 'react';

export default function useCodeInputValidation(validateFn: (code: string) => Promise<void>) {
    const length = 6;
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useMemo(() => Array.from({ length }, () => createRef<HTMLInputElement>()), []);

    function shift(idx: number, dir: 1 | -1) {
        const next = idx + dir;
        inputRefs[next]?.current?.focus();
    }

    function recalc() {
        setCode(inputRefs.map(r => r.current?.value ?? '').join(''));
    }

    function handleInput(idx: number, v: string) {
        if (v) shift(idx, 1);
        recalc();
    }

    function handleKey(idx: number, key: string, val: string) {
        if (key === 'Backspace' && !val) shift(idx, -1);
    }

    function clearAll() {
        inputRefs.forEach(r => { if (r.current) r.current.value = ''; });
        inputRefs[0]?.current?.focus();
        setCode('');
        setError(null);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (code.length !== length) return;
        setLoading(true);
        setError(null);
        try {
            await validateFn(code);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || 'Erro na validação');
            console.log('Error in: useCodeInputValidation() <---> Erro:', msg);
        } finally {
            setLoading(false);
        }
    }

    return { inputRefs, handleInput, handleKey, clearAll, handleSubmit, loading, error, isComplete: code.length === length };
}