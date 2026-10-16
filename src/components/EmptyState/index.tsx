import { MdInbox } from 'react-icons/md';
import styles from '@/components/EmptyState/EmptyState.module.css';

type EmptyStateProps = {
    icon?: React.ReactNode;
    title: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    compact?: boolean;
};

export default function EmptyState({ icon = <MdInbox />, title, description, action, compact = false }: EmptyStateProps): React.ReactElement {
    return (
        <div className={`${styles.emptyState} ${compact ? styles.compact : ''}`} role="status">
            <span className={styles.iconHalo} aria-hidden>
                <span className={styles.icon}>{icon}</span>
            </span>
            <strong className={styles.title}>{title}</strong>
            {description && <p className={styles.description}>{description}</p>}
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}
