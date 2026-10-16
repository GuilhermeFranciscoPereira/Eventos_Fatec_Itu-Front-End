import Link from 'next/link';
import Image from 'next/image';
import styles from '@/components/Footer/Footer.module.css';
import { MdAccessTime, MdLocationOn, MdPhone } from 'react-icons/md';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const SOCIALS = [
    { href: 'https://instagram.com/fatecitu', label: 'Instagram', Icon: FaInstagram },
    { href: 'https://facebook.com/fatecitu', label: 'Facebook', Icon: FaFacebookF },
    { href: 'https://br.linkedin.com/school/fatec-itu/', label: 'LinkedIn', Icon: FaLinkedinIn },
] as const;

const LINKS = [
    { href: 'https://fatecitu.cps.sp.gov.br/', label: 'Site da Fatec Itu' },
    { href: 'https://siga.cps.sp.gov.br/sigaaluno/applogin.aspx', label: 'Siga' },
    { href: 'https://fatecitu.cps.sp.gov.br/academico/calendario-academico/', label: 'Calendário acadêmico' },
    { href: 'https://fatecitu.cps.sp.gov.br/academico/estagios/', label: 'Estágios' },
] as const;

export default function Footer(): React.ReactElement {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brandColumn}>
                    <Image
                        src="/assets/images/Logo_FatecItu_WithoutBackground.png"
                        alt="Logo da faculdade Fatec Itu"
                        width={120}
                        height={60}
                        className={styles.brandLogo}
                    />
                    <p className={styles.brandText}>
                        Agenda oficial de eventos da Fatec Itu – Dom Amaury Castanho: palestras, workshops e atividades abertas a alunos e à comunidade.
                    </p>
                    <nav className={styles.socialNav} aria-label="Redes sociais da Fatec Itu">
                        {SOCIALS.map(({ href, label, Icon }) => (
                            <Link key={label} href={href} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={label}>
                                <Icon aria-hidden />
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className={styles.column}>
                    <strong className={styles.columnTitle}>Contato</strong>
                    <ul className={styles.infoList}>
                        <li><MdPhone aria-hidden /> <a href="tel:+551140131872">(11) 4013-1872</a></li>
                        <li><MdAccessTime aria-hidden /> Seg. a Sex. das 08h às 22h</li>
                        <li><MdLocationOn aria-hidden /> Av. Tiradentes, 1211 - Parque Industrial, Itu - SP, 13309-640</li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <strong className={styles.columnTitle}>Links úteis</strong>
                    <ul className={styles.linkList}>
                        {LINKS.map(({ href, label }) => (
                            <li key={label}>
                                <Link href={href} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>{label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`${styles.column} ${styles.govColumn}`}>
                    <Image
                        src="/assets/images/footer/logo_SP.svg"
                        alt="Logo do governo do estado de São Paulo"
                        width={150}
                        height={28}
                        className={styles.govLogo}
                    />
                    <span className={styles.institution}>Centro Paula Souza - Faculdade de Tecnologia de Itu</span>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <span>© {new Date().getFullYear()} Fatec Itu – Dom Amaury Castanho</span>
                <Link
                    href="https://github.com/GuilhermeFranciscoPereira/Eventos_Fatec_Itu-Back-End"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.credits}
                >
                    <FaGithub aria-hidden /> Sistema desenvolvido por alunos
                </Link>
            </div>
        </footer>
    );
}
