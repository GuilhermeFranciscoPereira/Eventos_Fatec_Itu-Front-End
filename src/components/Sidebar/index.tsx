'use client';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import ButtonRay from '@/components/Buttons/ButtonRay/index';
import styles from '@/components/Sidebar/Sidebar.module.css';
import { GiKnightBanner, GiPartyPopper } from 'react-icons/gi';
import { FaHome, FaUserEdit, FaLayerGroup } from 'react-icons/fa';
import { useSidebar } from '@/hooks/components/Sidebar/useSidebar';

const navItems: readonly { Icon: IconType; label: string, href: string }[] = [
    { Icon: FaHome, label: 'Tela inicial', href: '/' },
    { Icon: GiKnightBanner, label: 'Gerenciar Banners', href: '/teste1' },
    { Icon: FaLayerGroup, label: 'Gerenciar Categorias', href: '/teste2' },
    { Icon: GiPartyPopper, label: 'Gerenciar Eventos', href: '/teste3' },
    { Icon: FaUserEdit, label: 'Gerenciar Usuários', href: '/teste4' },
] as const;

export default function Sidebar(): React.ReactElement {
    const { isClosed, reset, toggle } = useSidebar();

    return (
        <aside className={`${styles.sidebar} ${isClosed ? styles.closed : ''}`} onMouseLeave={reset}>
            <div className={styles.logo} onClick={toggle}>
                <svg viewBox="0 0 32 32" className={styles.xAnimated}>
                    <path
                        className={styles.lineTopBottom}
                        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                    />
                    <path className={styles.line} d="M7 16 27 16" />
                </svg>
                <span>Fatec Itu</span>
            </div>

            <nav>
                <ul>
                    {navItems
                        .map(({ Icon, label, href }) => (
                            <li key={label}>
                                <Link href={href} className={styles.navLink} onClick={toggle}>
                                    <Icon aria-hidden="true" focusable="false" />
                                    <span>{label}</span>
                                </Link>
                            </li>
                        ))}
                </ul>
            </nav>

            <Link href={'/Login'}>
                <ButtonRay text='Login' type='button' />
            </Link>
        </aside>
    )
};