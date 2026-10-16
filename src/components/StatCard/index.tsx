import styles from '@/components/StatCard/StatCard.module.css';

type StatTone = 'brand' | 'success' | 'info' | 'warning' | 'neutral';

type StatCardProps = {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    hint?: React.ReactNode;
    tone?: StatTone;
    loading?: boolean;
};

export function StatGrid({ children }: { children: React.ReactNode }): React.ReactElement {
    return <section className={styles.statGrid} aria-label="Resumo">{children}</section>;
}

export default function StatCard({ icon, label, value, hint, tone = 'brand', loading = false }: StatCardProps): React.ReactElement {
    return (
        <article className={`${styles.statCard} ${styles[tone]}`}>
            <span className={styles.icon} aria-hidden>{icon}</span>
            <div className={styles.texts}>
                <span className={styles.label}>{label}</span>
                {loading ? <span className={styles.skeleton} aria-label="Carregando" /> : <strong className={styles.value}>{value}</strong>}
                {hint && !loading && <span className={styles.hint}>{hint}</span>}
            </div>
        </article>
    );
}
