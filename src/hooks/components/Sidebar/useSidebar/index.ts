import { useState, useCallback } from 'react';

type useSidebarProps = {
    isClosed: boolean;
    toggle: () => void;
    reset: () => void;
}

export default function useSidebar(): useSidebarProps {
    const [isClosed, setIsClosed] = useState<boolean>(false);

    const toggle = useCallback((): void => {
        setIsClosed((prev: boolean): boolean => !prev);
    }, []);

    const reset = useCallback((): void => {
        setIsClosed(false);
    }, []);

    return { isClosed, toggle, reset };
}