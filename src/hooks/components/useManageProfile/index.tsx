import { useCallback, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useUserStore } from '@/stores/useUserStore';
import { useModalStore } from '@/stores/useModalStore';
import InputField from '@/components/Inputs/InputField';
import InputImage from '@/components/Inputs/InputImage';
import { useEditPersonalProfile } from '@/hooks/api/Users/Patch/useEditPersonalProfile';

const formStyle: React.CSSProperties = { display: 'grid', gap: '0.75rem' };

export function useManageProfile(): () => void {
    const user = useUserStore(s => s.user);
    const photoRef = useRef<File | null>(null);
    const editProfile = useEditPersonalProfile();
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const openModal = useModalStore(s => s.openModal);

    return useCallback(() => {
        photoRef.current = null;
        openModal({
            icon: <FaUserCircle />,
            title: 'Gerenciar perfil',
            message: (
                <form style={formStyle}>
                    <InputField ref={nameRef} label="Nome" defaultValue={user?.name} />
                    <InputField ref={emailRef} label="E-mail" defaultValue={user?.email} />
                    <div style={{ marginTop: '0.75rem' }}>
                        <InputImage
                            id="profile-photo"
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
                await editProfile({
                    name: nameRef.current?.value,
                    email: emailRef.current?.value,
                    photo: photoRef.current ?? undefined,
                });
            },
        });
    }, [openModal, editProfile, user]);
}
