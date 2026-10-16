import styles from '@/components/PageHeader/PageHeader.module.css';

type PageHeaderProps = {
    icon?: React.ReactNode;
    eyebrow?: string;
    title: string;
    description?: React.ReactNode;
    actions?: React.ReactNode;
};

export default function PageHeader({ icon, eyebrow = 'Área administrativa', title, description, actions }: PageHeaderProps): React.ReactElement {
    return (
        <header className={styles.pageHeader}>
            <div className={styles.titleBlock}>
                {icon && <span className={styles.iconTile} aria-hidden>{icon}</span>}
                <div className={styles.texts}>
                    {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
                    <h1 className={styles.title}>{title}</h1>
                    {description && <p className={styles.description}>{description}</p>}
                </div>
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </header>
    );
}
