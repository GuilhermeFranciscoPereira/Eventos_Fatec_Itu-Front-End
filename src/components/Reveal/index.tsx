'use client';
import { createElement, useEffect, useRef, useState } from 'react';
import styles from '@/components/Reveal/Reveal.module.css';

type RevealProps = {
    as?: 'div' | 'section' | 'article' | 'li' | 'header';
    delay?: number;
    className?: string;
    children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'>;

export default function Reveal({ as = 'div', delay = 0, className, children, style, ...rest }: RevealProps): React.ReactElement {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return createElement(as, {
        ...rest,
        ref,
        className: `${styles.reveal} ${visible ? styles.visible : ''} ${className ?? ''}`.trim(),
        style: { ...style, '--reveal-delay': `${delay}ms` } as React.CSSProperties,
    }, children);
}
