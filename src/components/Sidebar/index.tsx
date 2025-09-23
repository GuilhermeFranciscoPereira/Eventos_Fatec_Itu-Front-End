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
import { FaHome, FaUserEdit, FaLayerGroup, FaUserCircle } from 'react-icons/fa';
import { useEditPersonalProfile } from '@/hooks/api/Users/Patch/useEditPersonalProfile';

const navItems: readonly { Icon: IconType; label: string; href: string; role: UserRoleTypes[] | 'all' }[] = [
    { Icon: FaHome, label: 'Tela inicial', href: '/', role: 'all' },
    { Icon: GiKnightBanner, label: 'Gerenciar Carrossel', href: '/Carousel', role: ['ADMIN', 'COORDENADOR'] },
    { Icon: FaLayerGroup, label: 'Gerenciar Categorias', href: '/Categories', role: ['ADMIN', 'COORDENADOR'] },
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
    const [isClosed, setIsClosed] = useState(false);
    const openModal = useModalStore(s => s.openModal);
    const reset = useCallback(() => setIsClosed(false), []);
    const toggle = useCallback(() => setIsClosed(v => !v), []);

    return (
        <aside className={`${styles.sidebar} ${isClosed ? styles.closed : ''}`} aria-label="Barra lateral" onMouseLeave={typeof window !== 'undefined' && window.innerWidth > 480 ? reset : undefined}>
            <div className={styles.logo} role="button" aria-label="Abrir menu" tabIndex={0}>
                <svg viewBox="0 0 32 32" className={styles.xAnimated} aria-hidden onClick={toggle}>
                    <path
                        className={styles.lineTopBottom}
                        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                    />
                    <path className={styles.line} d="M7 16 27 16" />
                </svg>
                <span>Fatec Itu</span>
            </div>

            <nav className={styles.nav}>
                <ul className={styles.list}>
                    {navItems
                        .filter(i => i.role === 'all' || (Array.isArray(i.role) && user && i.role.includes(user.role)))
                        .map(({ Icon, label, href }) => {
                            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                            return (
                                <li key={href} className={`${styles.item} ${active ? styles.active : ''}`}>
                                    <Link href={href} className={styles.navLink} onClick={toggle}>
                                        <Icon aria-hidden focusable={false} />
                                        <span>{label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    {user && (
                        <li className={styles.item}>
                            <button type="button" className={styles.navLink} onClick={handleManageProfile}>
                                <FaUserCircle aria-hidden focusable={false} />
                                <span>Gerenciar Perfil</span>
                            </button>
                        </li>
                    )}
                </ul>
            </nav>

            {user ? (
                <div className={styles.Profile}>
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
            ) : (
                <Link href="/Login" className={styles.loginWrap} onClick={toggle}>
                    <div className={styles.loginCompact}>
                        <ButtonRay text="Login" type="button" />
                    </div>
                    <div className={styles.loginClosed} />
                </Link>
            )}
        </aside>
    );

    function handleManageProfile(): void {
        openModal({
            icon: <FaUserCircle size={32} />,
            title: 'Gerenciar perfil',
            message: (
                <form className={styles.profileForm}>
                    <InputDefault ref={nameRef} label="Nome" defaultValue={user?.name} />
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
                const dto = { name: nameRef.current!.value, photo: photoRef.current ?? undefined };
                await editProfile(dto);
            }
        });
    }
}
