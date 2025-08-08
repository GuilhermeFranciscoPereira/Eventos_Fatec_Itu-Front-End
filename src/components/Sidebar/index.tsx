'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { SlLogout } from 'react-icons/sl';
import type { IconType } from 'react-icons';
import ButtonRay from '../Buttons/ButtonRay';
import InputDefault from '../Inputs/InputDefault';
import { useUserStore } from '@/stores/useUserStore';
import { UserRoleTypes } from '@/@Types/UserJwtProps';
import { useModalStore } from '@/stores/useModalStore';
import { useLogout } from '@/hooks/api/Auth/Post/useLogout';
import styles from '@/components/Sidebar/Sidebar.module.css';
import { GiKnightBanner, GiPartyPopper } from 'react-icons/gi';
import useSidebar from '@/hooks/components/Sidebar/useSidebar';
import { FaHome, FaUserEdit, FaLayerGroup, FaUserCircle } from 'react-icons/fa';
import { useEditPersonalProfile } from '@/hooks/api/Users/Patch/useEditPersonalProfile';

const navItems: readonly { Icon: IconType; label: string, href: string, role: UserRoleTypes[] | 'all' }[] = [
    { Icon: FaHome, label: 'Tela inicial', href: '/', role: 'all' },
    { Icon: GiKnightBanner, label: 'Gerenciar Carrossel', href: '/Carousel', role: ['ADMIN', 'COORDENADOR'] },
    { Icon: FaLayerGroup, label: 'Gerenciar Categorias', href: '/Categories', role: ['ADMIN', 'COORDENADOR'] },
    { Icon: GiPartyPopper, label: 'Gerenciar Eventos', href: '/Events', role: ['ADMIN', 'COORDENADOR', 'AUXILIAR'] },
    { Icon: FaUserEdit, label: 'Gerenciar Usuários', href: '/Users', role: ['ADMIN'] },
] as const;

export default function Sidebar(): React.ReactElement {
    const handleLogout = useLogout();
    const editProfile = useEditPersonalProfile();
    const nameRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const user = useUserStore((state) => state.user);
    const { isClosed, reset, toggle } = useSidebar();
    const openModal = useModalStore(s => s.openModal);

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
                        .filter(item =>
                            item.role === 'all' ||
                            (Array.isArray(item.role) && user && item.role.includes(user.role))
                        )
                        .map(({ Icon, label, href }) => (
                            <li key={label}>
                                <Link href={href} className={styles.navLink} onClick={toggle}>
                                    <Icon aria-hidden="true" focusable="false" />
                                    <span>{label}</span>
                                </Link>
                            </li>
                        ))}
                    {user && (
                        <li>
                            <button
                                type="button"
                                className={styles.navLink}
                                onClick={handleManageProfile}
                            >
                                <FaUserCircle aria-hidden focusable={false} />
                                <span>Gerenciar Perfil</span>
                            </button>
                        </li>
                    )}
                </ul>
            </nav>

            {user ?
                <div className={styles.profile}>
                    <Image
                        src={user.imageUrl ?? <FaUserCircle size={35} />}
                        alt="Foto de perfil do usuário"
                        width={35}
                        height={35}
                        className={styles.avatar}
                        loading="lazy"
                    />
                    <div className={styles.info}>
                        <p>{user.name}</p>
                        <small>{user.email}</small>
                    </div>
                    <div className={styles.logout} onClick={handleLogout}>
                        <SlLogout />
                    </div>
                </div>
                :
                <Link href={'/Login'} onClick={toggle}>
                    <div className={styles.profile}>
                        <ButtonRay text='Login' type='button' />
                    </div>
                </Link>
            }
        </aside>
    )

    function handleManageProfile(): void {
        openModal({
            icon: <FaUserCircle size={32} />,
            title: 'Gerenciar perfil',
            message: (
                <form className={styles.profileForm}>
                    <InputDefault
                        ref={nameRef}
                        label="Nome"
                        defaultValue={user?.name}
                    />
                    <div className={styles.formGroup}>
                        <label>Foto de perfil</label>
                        <input
                            ref={fileRef}
                            className={styles.fileInput}
                            type="file"
                            accept="image/*"
                        />
                    </div>
                </form>
            ),
            confirmLabel: 'Salvar',
            onConfirm: async () => {
                const dto = {
                    name: nameRef.current!.value,
                    photo: fileRef.current?.files?.[0] ?? undefined
                };
                await editProfile(dto);
            }
        });
    }
};
