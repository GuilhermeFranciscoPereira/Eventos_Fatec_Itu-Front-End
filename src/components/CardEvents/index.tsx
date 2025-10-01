'use client';
import Link from 'next/link';
import Filters from '@/components/Filters';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useCallback, useMemo, useState } from 'react';
import { EventPublicResponse } from '@/@Types/EventTypes';
import ImageCloudinary from '@/components/ImageCloudinary';
import styles from '@/components/CardEvents/CardEvents.module.css';
import { useGetAllEventsPublic } from '@/hooks/api/Events/Get/useGetAllEvents';

type CardEventsProps = {
    excludeId?: number;
    showFilters?: boolean;
    categoryId?: number | null;
};

export default function CardEvents({ excludeId, showFilters = true, categoryId = null }: CardEventsProps): React.ReactElement {
    const { datas } = useGetAllEventsPublic();

    const [filters, setFilters] = useState<{
        name?: string;
        startDate?: string;
        endDate?: string;
        categoryId?: number;
    }>({});

    const handleFilterChange = useCallback((f: typeof filters) => { setFilters(f); }, []);

    const filtered = useMemo(() => {
        return datas.filter((e: EventPublicResponse) => {
            if (categoryId !== null && categoryId !== undefined && e.categoryId !== categoryId) return false;
            if (typeof excludeId === 'number' && e.id === excludeId) return false;
            if (showFilters) {
                if (filters.name && !e.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
                const evDate = new Date(e.startDate);

                if (filters.startDate) {
                    const s = new Date(filters.startDate);
                    if (!isNaN(s.getTime()) && evDate < s) return false;
                }

                if (filters.endDate) {
                    const f = new Date(filters.endDate);
                    if (!isNaN(f.getTime()) && evDate > f) return false;
                }

                if (typeof filters.categoryId === 'number' && e.categoryId !== filters.categoryId) return false;
            }

            return true;
        });
    }, [datas, categoryId, excludeId, showFilters, filters]);

    const hasItems = filtered.length > 0;

    return (
        <>
            {showFilters
                ? <Filters onFilterChange={handleFilterChange} />
                : (hasItems && <h2 className={styles.otherEventsH2}>Outros eventos que podem te interessar:</h2>)
            }

            {hasItems && (
                <section className={styles.cardEventsSection}>
                    {filtered.map((event: EventPublicResponse) => (
                        <article key={event.id} className={styles.card}>
                            <div className={styles.cardInt}>
                                {event.isRestricted && <span className={styles.badge}>Fatecano</span>}

                                <div className={styles.previewWrapper}>
                                    <ImageCloudinary
                                        src={event.imageUrl}
                                        alt={event.name}
                                        sizes="(max-width: 769px) 50vw, 300px"
                                    />
                                </div>

                                <div className={styles.cardData}>
                                    <p className={styles.title}>{event.name}</p>
                                    <p>Data:{' '}{new Date(event.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} - {[event.startTime, event.endTime].map((t) => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })).join(' às ')}</p>
                                    <p className={styles.local}>Local: <span>{event.customLocation ?? event.location.replace(/_/g, ' ').toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())}</span></p>
                                    <p>Palestrante: {event.speakerName}</p>
                                    <Link href={`/EventDetail/${event.id}`}>
                                        <ButtonRay text="Ver Mais" type="button" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </>
    );
}
