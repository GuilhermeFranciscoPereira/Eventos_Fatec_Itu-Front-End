import { useState, useLayoutEffect, useCallback } from 'react';

type useButtonDarkModeProps = {
    checked: boolean;
    toggle: () => void;
};

export default function useButtonDarkMode(): useButtonDarkModeProps {
    const [isDark, setIsDark] = useState<boolean>(false);

    useLayoutEffect(() => {
        const stored: string | null = localStorage.getItem('theme');
        const preferDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initDark: boolean = stored === 'dark' ? true : stored === 'light' ? false : preferDark;
        setIsDark(initDark);
        document.documentElement.classList.toggle('DarkTheme', initDark);
    }, []);

    const toggle = useCallback(() => {
        setIsDark(prev => {
            const next: boolean = !prev;
            document.documentElement.classList.toggle('DarkTheme', next);
            localStorage.setItem('theme', next ? 'dark' : 'light');
            return next;
        });
    }, []);

    return { checked: !isDark, toggle };
}