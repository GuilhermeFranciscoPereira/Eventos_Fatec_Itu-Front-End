'use client';
import Link from 'next/link';
import Filters from '@/components/Filters';
import { useCallback, useState } from 'react';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { EventPublicResponse } from '@/@Types/EventTypes';
import ImageCloudinary from '@/components/ImageCloudinary';
import styles from '@/components/CardEvents/CardEvents.module.css';
import { useGetAllEventsPublic } from '@/hooks/api/Events/Get/useGetAllEvents';

export default function CardEvents(): React.ReactElement {
    const { datas } = useGetAllEventsPublic();

    const [filters, setFilters] = useState<{
        name?: string;
        startDate?: string;
        endDate?: string;
        categoryId?: number;
    }>({});

    const handleFilterChange = useCallback((f: typeof filters) => { setFilters(f); }, []);

    const filtered = datas.filter((e) => {
        if (filters.name && !e.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.startDate && new Date(e.startDate) < new Date(filters.startDate)) return false;
        if (filters.endDate && new Date(e.startDate) > new Date(filters.endDate)) return false;
        if (
            filters.categoryId !== undefined &&
            filters.categoryId !== null &&
            e.categoryId !== filters.categoryId
        ) { return false }
        return true;
    });

    return (
        <>
            <Filters onFilterChange={handleFilterChange} />

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
                                <p> Data:{' '}{new Date(event.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                <p> Horário:{' '} {[event.startTime, event.endTime].map((t) => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })).join(' - ')}</p>
                                <p>Local: {event.customLocation ?? event.location.replace(/_/g, ' ')}</p>
                                <p>Palestrante: {event.speakerName}</p>
                                <Link href={`/EventDetail/${event.id}`}>
                                    <ButtonRay text="Ver mais sobre" type="button" />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </>
    );
}
