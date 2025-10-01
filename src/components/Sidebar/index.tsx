'use client';
import Link from 'next/link';
import { SlLogout } from 'react-icons/sl';
import type { IconType } from 'react-icons';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import { useRef, useState, useCallback } from 'react';
import { UserRoleTypes } from '@/@Types/UserJwtProps';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useModalStore } from '@/stores/useModalStore';
import InputImage from '@/components/Inputs/InputImage';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputDefault from '@/components/Inputs/InputDefault';
import { useLogout } from '@/hooks/api/Auth/Post/useLogout';
import styles from '@/components/Sidebar/Sidebar.module.css';
import { GiKnightBanner, GiPartyPopper } from 'react-icons/gi';
import { useEditPersonalProfile } from '@/hooks/api/Users/Patch/useEditPersonalProfile';
import { FaHome, FaUserEdit, FaLayerGroup, FaUserCircle, FaBook } from 'react-icons/fa';

const navItems: readonly { Icon: IconType; label: string; href: string; role: UserRoleTypes[] | 'all' }[] = [
    { Icon: FaHome, label: 'Tela inicial', href: '/', role: 'all' },
    { Icon: GiKnightBanner, label: 'Gerenciar Carrossel', href: '/Carousel', role: ['ADMIN', 'COORDENADOR'] },
    { Icon: FaLayerGroup, label: 'Gerenciar Categorias', href: '/Categories', role: ['ADMIN', 'COORDENADOR'] },
    { Icon: FaBook, label: 'Gerenciar Cursos', href: '/Courses', role: ['ADMIN', 'COORDENADOR'] },
    { Icon: GiPartyPopper, label: 'Gerenciar Eventos', href: '/Events', role: ['ADMIN', 'COORDENADOR', 'AUXILIAR'] },
    { Icon: FaUserEdit, label: 'Gerenciar Usuários', href: '/Users', role: ['ADMIN'] }
] as const;

export default function Sidebar(): React.ReactElement {
    const pathname = usePathname();
    const handleLogout = useLogout();
    const user = useUserStore(s => s.user);
    const photoRef = useRef<File | null>(null);
    const editProfile = useEditPersonalProfile();
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const openModal = useModalStore(s => s.openModal);
    const [isClosed, setIsClosed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const resetDesktop = useCallback(() => setIsClosed(false), []);
    const toggleDesktop = useCallback(() => setIsClosed(v => !v), []);
    const closeMobile = useCallback(() => setIsMobileOpen(false), []);
    const toggleMobile = useCallback(() => setIsMobileOpen(v => !v), []);

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

            <aside
                className={`${styles.sidebar} ${isClosed ? styles.closed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}
                aria-label="Barra lateral"
                onMouseLeave={typeof window !== 'undefined' && window.innerWidth > 480 ? resetDesktop : undefined}
            >
                <div className={styles.header}>
                    <div className={styles.logoRow}>
                        <svg viewBox="0 0 32 32" className={styles.xAnimated} aria-hidden onClick={toggleDesktop}>
                            <path
                                className={styles.lineTopBottom}
                                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                            />
                            <path className={styles.line} d="M7 16 27 16" />
                        </svg>
                        <span className={styles.brandTitle}>
                            <span className={styles.brandRed}>F</span>atec <span className={styles.brandRed}>I</span>tu
                        </span>
                    </div>

                    <div className={styles.brandInfo}>
                        <span className={styles.brandSub}>{user?.email || 'Visitante'}</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.list}>
                        {navItems
                            .filter(i => i.role === 'all' || (Array.isArray(i.role) && user && i.role.includes(user.role)))
                            .map(({ Icon, label, href }) => {
                                const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                                return (
                                    <li key={href} className={`${styles.item} ${active ? styles.active : ''}`}>
                                        <Link href={href} className={styles.navLink} onClick={closeMobile}>
                                            <Icon aria-hidden focusable={false} />
                                            <span>{label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        {user && (
                            <li className={styles.item}>
                                <button type="button" className={styles.navLink} onClick={() => { handleManageProfile(); closeMobile(); }}>
                                    <FaUserCircle aria-hidden focusable={false} />
                                    <span>Gerenciar Perfil</span>
                                </button>
                            </li>
                        )}
                    </ul>
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
                const dto = { name: nameRef.current!.value, email: emailRef.current!.value, photo: photoRef.current ?? undefined };
                await editProfile(dto);
            }
        });
    }
}
