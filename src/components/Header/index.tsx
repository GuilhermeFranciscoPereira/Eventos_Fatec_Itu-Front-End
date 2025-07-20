import Image from 'next/image';
import ButtonDarkMode from '../Buttons/ButtonDarkMode';
import styles from '@/components/Header/Header.module.css';

export default function Header(): React.ReactElement {
    return (
        <header className={styles.header}>
            <Image src="/assets/images/Logo_FatecItu_WithoutBackground.png" alt='Logo da faculdade Fatec Itu' height={50} width={100} quality={100} />
            <ButtonDarkMode />
        </header>
    )
}