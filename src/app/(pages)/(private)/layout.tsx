import type { Metadata } from 'next';
import styles from '@/app/(pages)/(private)/AdminPage.module.css';

export const metadata: Metadata = {
    title: 'Área administrativa',
    robots: { index: false, follow: false },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }): React.ReactNode {
    return <div className={styles.adminShell}>{children}</div>;
}
