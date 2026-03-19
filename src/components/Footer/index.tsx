import Link from 'next/link';
import Image from 'next/image';
import styles from '@/components/Footer/Footer.module.css';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

export default function Footer(): React.ReactElement {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.leftColumn}>
                    <ul className={styles.infoList}>
                        <li>
                            <strong>Fatec Itu – Dom Amaury Castanho</strong>
                        </li>
                        <li>Telefone: (11) 4013-1872</li>
                        <li>Horário de funcionamento: Seg. a Sex. das 08h às 22h</li>
                        <li>Av. Tiradentes, 1211 - Parque Industrial, Itu - SP - CEP: 13309-640</li>
                    </ul>
                </div>

                <div className={styles.centerColumn}>
                    <strong className={styles.socialTitle}>Nossas redes sociais:</strong>

                    <nav className={styles.socialNav} aria-label="Redes sociais da Fatec Itu">
                        <Link
                            href="https://instagram.com/fatecitu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <FaInstagram size={16} />
                            <span>Instagram</span>
                        </Link>

                        <Link
                            href="https://facebook.com/fatecitu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <FaFacebookF size={16} />
                            <span>Facebook</span>
                        </Link>

                        <Link
                            href="https://br.linkedin.com/school/fatec-itu/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <FaLinkedinIn size={16} />
                            <span>LinkedIn</span>
                        </Link>
                    </nav>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/assets/images/footer/logo_SP.svg"
                            alt="Logo do governo do estado de São Paulo"
                            width={140}
                            height={56}
                            className={styles.logo}
                            quality={100}
                        />
                    </div>

                    <div className={styles.institution}>
                        Centro Paula Souza - Faculdade de Tecnologia de Itu - Fatec Itu
                    </div>

                    <div className={styles.credits}>
                        <span>Sistema desenvolvido por alunos - Repositório: </span>
                        <Link
                            href="https://github.com/GuilhermeFranciscoPereira/Eventos_Fatec_Itu-Back-End"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.creditsLink}
                        >
                            Clique aqui
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}