import Link from 'next/link';
import styles from '@/components/Buttons/IconButton/IconButton.module.css';

type IconButtonTone = 'neutral' | 'info' | 'success' | 'danger' | 'brand';

type IconButtonProps = {
    label: string;
    tone?: IconButtonTone;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
};

export default function IconButton({ label, tone = 'neutral', href, onClick, disabled, children }: IconButtonProps): React.ReactElement {
    const className = `${styles.iconButton} ${styles[tone]}`;

    if (href) {
        return (
            <Link href={href} className={className} aria-label={label} data-tooltip={label}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={className} aria-label={label} data-tooltip={label} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
