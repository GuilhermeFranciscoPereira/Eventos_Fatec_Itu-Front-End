'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SlLogout } from 'react-icons/sl';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/api/Auth/Post/useLogout';
import { useUserStore } from '@/stores/useUserStore';
import styles from '@/components/Header/Header.module.css';
import ButtonDarkMode from '@/components/Buttons/ButtonDarkMode';
import { filterNavigationByRole, isTreeActive, type NavItem, navigationItems } from '@/components/NavigationData';

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

function DesktopNavItem({
    item,
    pathname
}: {
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
            <button type="button" className={`${styles.navLink} ${active ? styles.active : ''}`}>
                <span>{item.label}</span>
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

export default function Header(): React.ReactElement {
    const pathname = usePathname();
    const handleLogout = useLogout();
    const user = useUserStore(s => s.user);
    const desktopItems = filterNavigationByRole(navigationItems, user?.role);

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link href="/" className={styles.logoLink} aria-label="Ir para a página inicial">
                    <Image
                        height={50}
                        width={100}
                        quality={100}
                        src="/assets/images/Logo_FatecItu_WithoutBackground.png"
                        alt="Logo da faculdade Fatec Itu"
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
                        <button type="button" className={styles.authButton} onClick={handleLogout} aria-label="Sair">
                            <SlLogout />
                            <span>Sair</span>
                        </button>
                    ) : (
                        <Link href="/Login" className={styles.authLink}>
                            <span>Login</span>
                        </Link>
                    )}
                    <ButtonDarkMode />
                </div>
            </div>
        </header>
    );
}