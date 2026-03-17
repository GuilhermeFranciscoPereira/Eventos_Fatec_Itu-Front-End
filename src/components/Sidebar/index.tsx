'use client';

import Link from 'next/link';
import { SlLogout } from 'react-icons/sl';
import { FaUserCircle } from 'react-icons/fa';
import { useRef, useState, useCallback } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useModalStore } from '@/stores/useModalStore';
import InputImage from '@/components/Inputs/InputImage';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputDefault from '@/components/Inputs/InputDefault';
import { useLogout } from '@/hooks/api/Auth/Post/useLogout';
import styles from '@/components/Sidebar/Sidebar.module.css';
import { useEditPersonalProfile } from '@/hooks/api/Users/Patch/useEditPersonalProfile';
import { filterNavigationByRole, isTreeActive, type NavItem, navigationItems } from '@/components/NavigationData';
import { usePathname } from 'next/navigation';

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
    const user = useUserStore(s => s.user);
    const photoRef = useRef<File | null>(null);
    const editProfile = useEditPersonalProfile();
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const openModal = useModalStore(s => s.openModal);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const closeMobile = useCallback(() => setIsMobileOpen(false), []);
    const toggleMobile = useCallback(() => setIsMobileOpen(v => !v), []);
    const mobileItems = filterNavigationByRole(navigationItems, user?.role);

    return (
        <>
            <button
                type="button"
                aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
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
                    <div className={styles.logoRow}>
                        <span className={styles.brandTitle}>
                            <span className={styles.brandRed}>F</span>atec <span className={styles.brandRed}>I</span>tu
                        </span>
                    </div>

                    <div className={styles.brandInfo}>
                        <span className={styles.brandSub}>{user?.email || 'Visitante'}</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <MobileNavTree items={mobileItems} pathname={pathname} closeMobile={closeMobile} />

                    {user && (
                        <div className={styles.profileActionWrap}>
                            <button
                                type="button"
                                className={styles.profileAction}
                                onClick={() => {
                                    handleManageProfile();
                                    closeMobile();
                                }}
                            >
                                <FaUserCircle aria-hidden focusable={false} />
                                <span>Gerenciar Perfil</span>
                            </button>
                        </div>
                    )}
                </nav>

                {user ? (
                    <div className={styles.footer}>
                        <div className={styles.userBox}>
                            <div className={styles.avatar}>
                                {user.imageUrl ? (
                                    <ImageCloudinary src={user.imageUrl} alt="Foto de perfil do usuário" />
                                ) : (
                                    <div className={styles.avatarFallback}>{user?.name.slice(0, 1).toUpperCase() || '?'}</div>
                                )}
                            </div>

                            <div className={styles.userMeta}>
                                <span className={styles.userName}>{user.name}</span>
                                <span className={styles.userRole}>{user.role}</span>
                            </div>

                            <button className={styles.logout} onClick={handleLogout} aria-label="Sair">
                                <SlLogout />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.loginArea}>
                        <Link href="/Login" className={styles.loginWrap} onClick={closeMobile}>
                            <ButtonRay text="Login" type="button" />
                        </Link>
                    </div>
                )}
            </aside>

            {isMobileOpen ? <button type="button" aria-label="Fechar menu" className={styles.backdrop} onClick={closeMobile} /> : null}
        </>
    );

    function handleManageProfile(): void {
        openModal({
            icon: <FaUserCircle size={32} />,
            title: 'Gerenciar perfil',
            message: (
                <form className={styles.profileForm}>
                    <InputDefault ref={nameRef} label="Nome" defaultValue={user?.name} />
                    <InputDefault ref={emailRef} label="E-mail" defaultValue={user?.email} />
                    <br />
                    <div className={styles.formGroup}>
                        <InputImage
                            initialUrl={user?.imageUrl ?? null}
                            onChange={file => {
                                photoRef.current = file;
                            }}
                        />
                    </div>
                </form>
            ),
            confirmLabel: 'Salvar',
            onConfirm: async () => {
                const dto = {
                    name: nameRef.current!.value,
                    email: emailRef.current!.value,
                    photo: photoRef.current ?? undefined
                };

                await editProfile(dto);
            }
        });
    }
}