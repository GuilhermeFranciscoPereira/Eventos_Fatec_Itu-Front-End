import Image from 'next/image';
import { MdEventAvailable, MdQrCode2, MdVerifiedUser } from 'react-icons/md';
import styles from '@/components/AuthShell/AuthShell.module.css';

type AuthShellProps = {
    illustration: string;
    illustrationAlt: string;
    children: React.ReactNode;
};

const HIGHLIGHTS = [
    { Icon: MdEventAvailable, text: 'Crie e acompanhe os eventos da faculdade' },
    { Icon: MdQrCode2, text: 'Controle de presença e certificados automáticos' },
    { Icon: MdVerifiedUser, text: 'Acesso protegido com verificação em duas etapas' },
] as const;

export default function AuthShell({ illustration, illustrationAlt, children }: AuthShellProps): React.ReactElement {
    return (
        <main className={styles.authPage}>
            <section className={styles.brandPanel}>
                <Image
                    src={illustration}
                    alt={illustrationAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={styles.brandImage}
                    priority
                />
                <div className={styles.brandOverlay}>
                    <span className={styles.brandEyebrow}>Área dos colaboradores</span>
                    <ul className={styles.highlights}>
                        {HIGHLIGHTS.map(({ Icon, text }) => (
                            <li key={text}><span><Icon aria-hidden /></span>{text}</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className={styles.formPanel}>
                <div className={styles.formCard}>
                    {children}
                    <div className={styles.cardLogo}>
                        <Image
                            alt="Logo da faculdade Fatec Itu"
                            src="/assets/images/Logo_FatecItu_WithoutBackground.png"
                            width={110}
                            height={55}
                            className={styles.logo}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
