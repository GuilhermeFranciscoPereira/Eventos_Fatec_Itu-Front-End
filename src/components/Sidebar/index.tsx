'use client';

import Link from 'next/link';
import { SlLogout } from 'react-icons/sl';
import { FaUserCircle } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import UserAvatar from '@/components/UserAvatar';
import { useUserStore } from '@/stores/useUserStore';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useLogout } from '@/hooks/api/Auth/Post/useLogout';
import styles from '@/components/Sidebar/Sidebar.module.css';
import { useManageProfile } from '@/hooks/components/useManageProfile';
import { filterNavigationByRole, isTreeActive, type NavItem, navigationItems } from '@/utils/navigationData';

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrador',
    COORDENADOR: 'Coordenador',
    AUXILIAR: 'Auxiliar docente',
};

function MobileLink({
    item,
    className,
    onClick
}: {
    item: NavItem;
    className: string;
    onClick: () => void;
}): React.ReactElement | null {
    if (item.href) {
        return (
            <Link
                href={item.href}
                className={`${className} ${item.Icon ? styles.mobileTreeLinkWithIcon : styles.mobileTreeLinkWithoutIcon}`}
                onClick={onClick}
            >
                {item.Icon ? <item.Icon aria-hidden focusable={false} /> : null}
                <span>{item.label}</span>
            </Link>
        );
    }

    if (item.externalHref) {
        return (
            <a
                href={item.externalHref}
                className={`${className} ${item.Icon ? styles.mobileTreeLinkWithIcon : styles.mobileTreeLinkWithoutIcon}`}
                target={item.blank ? '_blank' : undefined}
                rel={item.blank ? 'noopener noreferrer' : undefined}
                onClick={onClick}
            >
                {item.Icon ? <item.Icon aria-hidden focusable={false} /> : null}
                <span>{item.label}</span>
            </a>
        );
    }

    return null;
}

function MobileNavTree({
    items,
    pathname,
    closeMobile
}: {
    items: NavItem[];
    pathname: string;
    closeMobile: () => void;
}): React.ReactElement {
    return (
        <ul className={styles.mobileTree}>
            {items.map(item => {
                const active = isTreeActive(pathname, item);
                const hasChildren = !!item.children?.length;

                if (hasChildren) {
                    return (
                        <li key={item.label} className={styles.mobileTreeItem}>
                            <details className={styles.mobileDetails} open={active}>
                                <summary className={`${styles.mobileSummary} ${active ? styles.active : ''}`}>
                                    <span>{item.label}</span>
                                </summary>
                                <MobileNavTree items={item.children || []} pathname={pathname} closeMobile={closeMobile} />
                            </details>
                        </li>
                    );
                }

                return (
                    <li key={item.label} className={styles.mobileTreeItem}>
                        <MobileLink
                            item={item}
                            className={`${styles.mobileTreeLink} ${active ? styles.active : ''}`}
                            onClick={closeMobile}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export default function Sidebar(): React.ReactElement {
    const pathname = usePathname();
    const handleLogout = useLogout();
    const manageProfile = useManageProfile();
    const user = useUserStore(s => s.user);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const closeMobile = useCallback(() => setIsMobileOpen(false), []);
    const toggleMobile = useCallback(() => setIsMobileOpen(v => !v), []);
    const mobileItems = filterNavigationByRole(navigationItems, user?.role);

    useEffect(() => {
        if (!isMobileOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (event: KeyboardEvent): void => { if (event.key === 'Escape') setIsMobileOpen(false); };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isMobileOpen]);

    return (
        <>
            <button
                type="button"
                aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isMobileOpen}
                className={`${styles.menuBtn} ${isMobileOpen ? styles.menuOpen : ''}`}
                onClick={toggleMobile}
            >
                <svg viewBox="0 0 32 32" className={styles.xAnimated} aria-hidden>
                    <path
                        className={styles.lineTopBottom}
                        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                    />
                    <path className={styles.line} d="M7 16 27 16" />
                </svg>
            </button>

            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`} aria-label="Barra lateral">
                <div className={styles.header}>
                    <span className={styles.brandTitle}>
                        <span className={styles.brandRed}>F</span>atec <span className={styles.brandRed}>I</span>tu
                    </span>
                    <span className={styles.brandSub}>Agenda de eventos</span>
                </div>

                {user && (
                    <div className={styles.userCard}>
                        <UserAvatar name={user.name} imageUrl={user.imageUrl} size="lg" />
                        <div className={styles.userMeta}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userEmail}>{user.email}</span>
                            <span className={styles.userRole}>{ROLE_LABELS[user.role] ?? user.role}</span>
                        </div>
                    </div>
                )}

                <nav className={styles.nav}>
                    <MobileNavTree items={mobileItems} pathname={pathname} closeMobile={closeMobile} />
                </nav>

                {user ? (
                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.footerAction}
                            onClick={() => {
                                closeMobile();
                                manageProfile();
                            }}
                        >
                            <FaUserCircle aria-hidden focusable={false} />
                            <span>Gerenciar perfil</span>
                        </button>
                        <button type="button" className={`${styles.footerAction} ${styles.logout}`} onClick={() => { closeMobile(); handleLogout(); }}>
                            <SlLogout aria-hidden focusable={false} />
                            <span>Sair</span>
                        </button>
                    </div>
                ) : (
                    <div className={styles.loginArea}>
                        <Link href="/Login" className={styles.loginWrap} onClick={closeMobile}>
                            <ButtonRay text="Entrar" type="button" />
                        </Link>
                    </div>
                )}
            </aside>

            {isMobileOpen ? <button type="button" aria-label="Fechar menu" className={styles.backdrop} onClick={closeMobile} /> : null}
        </>
    );
}
