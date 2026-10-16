'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SlLogout } from 'react-icons/sl';
import { FaUserCircle } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { IoChevronDown } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import UserAvatar from '@/components/UserAvatar';
import { useUserStore } from '@/stores/useUserStore';
import { useLogout } from '@/hooks/api/Auth/Post/useLogout';
import styles from '@/components/Header/Header.module.css';
import ButtonDarkMode from '@/components/Buttons/ButtonDarkMode';
import { useManageProfile } from '@/hooks/components/useManageProfile';
import { filterNavigationByRole, isTreeActive, type NavItem, navigationItems } from '@/utils/navigationData';

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrador',
    COORDENADOR: 'Coordenador',
    AUXILIAR: 'Auxiliar docente',
};

function RenderNavLink({
    item,
    className
}: {
    item: NavItem;
    className: string;
}): React.ReactElement | null {
    if (item.href) {
        return (
            <Link href={item.href} className={className}>
                <span>{item.label}</span>
            </Link>
        );
    }

    if (item.externalHref) {
        return (
            <a
                href={item.externalHref}
                className={className}
                target={item.blank ? '_blank' : undefined}
                rel={item.blank ? 'noopener noreferrer' : undefined}
            >
                <span>{item.label}</span>
            </a>
        );
    }

    return null;
}

function DesktopNavItem({ item, pathname }: {
    item: NavItem;
    pathname: string;
}): React.ReactElement | null {
    const active = isTreeActive(pathname, item);
    const hasChildren = !!item.children?.length;

    if (!hasChildren) {
        return (
            <li className={styles.navItem}>
                <RenderNavLink item={item} className={`${styles.navLink} ${active ? styles.active : ''}`} />
            </li>
        );
    }

    return (
        <li className={`${styles.navItem} ${styles.hasDropdown}`}>
            <button type="button" className={`${styles.navLink} ${active ? styles.active : ''}`} aria-haspopup="true">
                <span>{item.label}</span>
                <IoChevronDown className={styles.chevron} aria-hidden />
            </button>

            <div className={styles.dropdown}>
                <ul className={styles.dropdownList}>
                    {item.children?.map(child => {
                        const childHasChildren = !!child.children?.length;
                        const childActive = isTreeActive(pathname, child);

                        if (childHasChildren) {
                            return (
                                <li key={child.label} className={styles.dropdownItem}>
                                    <button type="button" className={`${styles.dropdownLink} ${childActive ? styles.active : ''}`}>
                                        <span>{child.label}</span>
                                        <span className={styles.dropdownArrow}>›</span>
                                    </button>

                                    <div className={styles.subDropdown}>
                                        <ul className={styles.dropdownList}>
                                            {child.children?.map(subChild => {
                                                const subChildActive = isTreeActive(pathname, subChild);

                                                return (
                                                    <li key={subChild.label} className={styles.dropdownItem}>
                                                        <RenderNavLink
                                                            item={subChild}
                                                            className={`${styles.dropdownLink} ${subChildActive ? styles.active : ''}`}
                                                        />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </li>
                            );
                        }

                        return (
                            <li key={child.label} className={styles.dropdownItem}>
                                <RenderNavLink
                                    item={child}
                                    className={`${styles.dropdownLink} ${childActive ? styles.active : ''}`}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </li>
    );
}

function UserMenu(): React.ReactElement | null {
    const handleLogout = useLogout();
    const manageProfile = useManageProfile();
    const user = useUserStore(s => s.user);
    const menuRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!open) return;
        function onPointerDown(event: MouseEvent): void {
            if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
        }
        function onKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape') setOpen(false);
        }
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    if (!user) return null;

    return (
        <div className={styles.userMenu} ref={menuRef}>
            <button
                type="button"
                className={`${styles.userButton} ${open ? styles.userButtonOpen : ''}`}
                onClick={() => setOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`Menu do usuário ${user.name}`}
            >
                <UserAvatar name={user.name} imageUrl={user.imageUrl} size="sm" />
                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                <IoChevronDown className={styles.chevron} aria-hidden />
            </button>

            {open && (
                <div className={styles.userDropdown} role="menu">
                    <div className={styles.userCard}>
                        <UserAvatar name={user.name} imageUrl={user.imageUrl} size="lg" />
                        <div className={styles.userCardTexts}>
                            <strong>{user.name}</strong>
                            <span>{user.email}</span>
                            <span className={styles.roleBadge}>{ROLE_LABELS[user.role] ?? user.role}</span>
                        </div>
                    </div>
                    <button type="button" role="menuitem" className={styles.userMenuItem} onClick={() => { setOpen(false); manageProfile(); }}>
                        <FaUserCircle aria-hidden /> Gerenciar perfil
                    </button>
                    <button type="button" role="menuitem" className={`${styles.userMenuItem} ${styles.logoutItem}`} onClick={() => { setOpen(false); handleLogout(); }}>
                        <SlLogout aria-hidden /> Sair
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Header(): React.ReactElement {
    const pathname = usePathname();
    const user = useUserStore(s => s.user);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const desktopItems = filterNavigationByRole(navigationItems, user?.role);

    useEffect(() => {
        const onScroll = (): void => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.headerContent}>
                <Link href="/" className={styles.logoLink} aria-label="Ir para a página inicial">
                    <Image
                        height={50}
                        width={100}
                        src="/assets/images/Logo_FatecItu_WithoutBackground.png"
                        alt="Logo da faculdade Fatec Itu"
                        className={styles.logo}
                        priority
                    />
                </Link>

                <nav className={styles.desktopNav} aria-label="Menu principal">
                    <ul className={styles.desktopNavList}>
                        {desktopItems.map(item => (
                            <DesktopNavItem key={item.label} item={item} pathname={pathname} />
                        ))}
                    </ul>
                </nav>

                <div className={styles.actions}>
                    {user ? (
                        <UserMenu />
                    ) : (
                        <Link href="/Login" className={styles.authLink}>
                            <span>Entrar</span>
                        </Link>
                    )}
                    <ButtonDarkMode />
                </div>
            </div>
        </header>
    );
}
