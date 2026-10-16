import Link from 'next/link';
import styles from '@/components/Buttons/Button/Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type CommonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    fullWidth?: boolean;
    className?: string;
    children: React.ReactNode;
};

type ButtonAsButton = CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { href?: undefined };
type ButtonAsLink = CommonProps & { href: string; target?: string; rel?: string; onClick?: () => void; 'aria-label'?: string };

function buildClasses({ variant = 'primary', size = 'md', fullWidth = false, className }: CommonProps): string {
    return [styles.button, styles[variant], styles[size], fullWidth ? styles.fullWidth : '', className ?? ''].filter(Boolean).join(' ');
}

function Content({ icon, iconRight, children }: Pick<CommonProps, 'icon' | 'iconRight' | 'children'>): React.ReactElement {
    return (
        <>
            {icon && <span className={styles.icon} aria-hidden>{icon}</span>}
            <span className={styles.label}>{children}</span>
            {iconRight && <span className={`${styles.icon} ${styles.iconRight}`} aria-hidden>{iconRight}</span>}
        </>
    );
}

export default function Button(props: ButtonAsButton | ButtonAsLink): React.ReactElement {
    if (props.href !== undefined) {
        const { href, target, rel, onClick, icon, iconRight, children } = props;
        return (
            <Link href={href} target={target} rel={rel} onClick={onClick} className={buildClasses(props)} aria-label={props['aria-label']}>
                <Content icon={icon} iconRight={iconRight}>{children}</Content>
            </Link>
        );
    }

    const { variant, size, icon, iconRight, fullWidth, className, children, type = 'button', ...buttonProps } = props;
    return (
        <button type={type} className={buildClasses({ variant, size, fullWidth, className, children })} {...buttonProps}>
            <Content icon={icon} iconRight={iconRight}>{children}</Content>
        </button>
    );
}
