import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const GAP_PX = 6;
const VIEWPORT_MARGIN_PX = 12;
const MAX_HEIGHT_REM = 18;
const MIN_COMFORTABLE_HEIGHT_REM = 12;

type FloatingPlacement = 'bottom' | 'top';

export function useFloatingDropdown(anchorRef: React.RefObject<HTMLElement | null>, isOpen: boolean, minWidthRem: number) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pendingFocusRef = useRef<1 | -1 | null>(null);
    const [style, setStyle] = useState<React.CSSProperties | null>(null);
    const [placement, setPlacement] = useState<FloatingPlacement>('bottom');

    const updatePosition = useCallback((): void => {
        const anchor = anchorRef.current;
        if (!anchor) return;

        const rect = anchor.getBoundingClientRect();
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom - GAP_PX - VIEWPORT_MARGIN_PX;
        const spaceAbove = rect.top - GAP_PX - VIEWPORT_MARGIN_PX;
        const preferredHeight = MAX_HEIGHT_REM * rem;
        const contentHeight = dropdownRef.current?.scrollHeight;
        const neededHeight = contentHeight ? Math.min(preferredHeight, contentHeight) : Math.min(preferredHeight, MIN_COMFORTABLE_HEIGHT_REM * rem);
        const openUp = spaceBelow < neededHeight && spaceAbove > spaceBelow;
        const width = Math.min(Math.max(rect.width, minWidthRem * rem), viewportWidth - VIEWPORT_MARGIN_PX * 2);
        const left = Math.min(Math.max(rect.left, VIEWPORT_MARGIN_PX), viewportWidth - width - VIEWPORT_MARGIN_PX);

        setPlacement(openUp ? 'top' : 'bottom');
        setStyle({
            left,
            width,
            maxHeight: Math.max(Math.min(preferredHeight, openUp ? spaceAbove : spaceBelow), 0),
            ...(openUp ? { bottom: viewportHeight - rect.top + GAP_PX } : { top: rect.bottom + GAP_PX }),
        });
    }, [anchorRef, minWidthRem]);

    useLayoutEffect(() => {
        if (!isOpen) {
            setStyle(null);
            return;
        }

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        document.addEventListener('animationend', updatePosition, true);
        document.addEventListener('transitionend', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
            document.removeEventListener('animationend', updatePosition, true);
            document.removeEventListener('transitionend', updatePosition, true);
        };
    }, [isOpen, updatePosition]);

    const isMounted = style !== null;

    useLayoutEffect(() => {
        if (isMounted) updatePosition();
    }, [isMounted, updatePosition]);

    useEffect(() => {
        if (!isMounted || !pendingFocusRef.current) return;
        moveOptionFocus(dropdownRef.current, pendingFocusRef.current);
        pendingFocusRef.current = null;
    }, [isMounted]);

    const focusOptionOnOpen = useCallback((direction: 1 | -1): void => {
        pendingFocusRef.current = direction;
    }, []);

    return { dropdownRef, style, placement, focusOptionOnOpen };
}

export function moveOptionFocus(container: HTMLElement | null, direction: 1 | -1): void {
    if (!container) return;
    const options = Array.from(container.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
    if (!options.length) return;

    const current = options.indexOf(document.activeElement as HTMLButtonElement);
    const next = current === -1 ? (direction === 1 ? 0 : options.length - 1) : (current + direction + options.length) % options.length;
    options[next].focus();
}
