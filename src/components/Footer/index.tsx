import Link from 'next/link';
import styles from '@/components/Footer/Footer.module.css';
import Image from 'next/image';

export default function Footer(): React.ReactElement {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerSection}>
                <ul className={styles.footerList}>
                    <li><strong>Fatec Itu – Dom Amaury Castanho</strong></li>
                    <li>Telefone: (11) 4013-1872</li>
                    <li>Horário de funcionamento: Seg. a Sex. das 08h às 22h</li>
                    <li>Av. Tiradentes, 1211 - Parque Industrial, Itu - SP - CEP: 13309-640</li>
                </ul>
            </div>

            <div className={styles.footerSection}>
                <strong>Links áreas dos alunos:</strong>
                <nav className={styles.footerNav}>
                    <Link
                        href="https://siga.cps.sp.gov.br/sigaaluno/applogin.aspx"
                        className={styles.footerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Siga
                    </Link>
                    <Link
                        href="https://fatecitu.cps.sp.gov.br/"
                        className={styles.footerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Fatec Itu
                    </Link>
                    <Link
                        href="https://fatecitu.cps.sp.gov.br/cps-carreiras/"
                        className={styles.footerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        CPS Carreira
                    </Link>
                </nav>
            </div>

            <div className={styles.footerSectionRight}>
                <Image
                    src="/assets/images/footer/logo_SP.svg"
                    alt="Logo do governo do estado de São Paulo"
                    width={0}
                    height={0}
                    sizes="140px"
                    style={{ width: '140px', height: 'auto', display: 'block' }}
                    quality={100}
                />
                <div className={styles.footerInstitution}>
                    Centro Paula Souza - Faculdade de Tecnologia de Itu - Fatec Itu
                </div>
                <div className={styles.footerCredits}>
                    Sistema desenvolvido por alunos - Repositório: <Link href='https://github.com/GuilhermeFranciscoPereira/Eventos_Fatec_Itu-Back-End' target='_blank'>Clique aqui</Link>
                </div>
            </div>
        </footer>
    );
}
