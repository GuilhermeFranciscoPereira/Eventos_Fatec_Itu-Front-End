'use client';

import Link from 'next/link';
import Filters from '@/components/Inputs/FiltersHome';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useCallback, useMemo, useState } from 'react';
import { EventPublicResponse } from '@/@Types/EventTypes';
import ImageCloudinary from '@/components/ImageCloudinary';
import styles from '@/components/CardEvents/CardEvents.module.css';
import { useGetAllEventsPublic } from '@/hooks/api/Events/Get/useGetAllEvents';
import { useGetAllCategoriesPublic } from '@/hooks/api/Categories/Get/useGetAllCategories';

type CardEventsProps = {
    excludeId?: number;
    showFilters?: boolean;
    categoryId?: number | null;
};

type FiltersState = {
    name?: string;
    startDate?: string;
    endDate?: string;
    categoryId?: number;
};

export default function CardEvents({
    excludeId,
    showFilters = true,
    categoryId = null,
}: CardEventsProps): React.ReactElement | null {
    const { datas } = useGetAllEventsPublic();
    const { datas: categories } = useGetAllCategoriesPublic();

    const [filters, setFilters] = useState<FiltersState>({});

    const handleFilterChange = useCallback((f: FiltersState) => {
        setFilters(f);
    }, []);

    const formatDate = useCallback((date: string): string => {
        return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR');
    }, []);

    const filtered = useMemo(() => {
        return datas.filter((e: EventPublicResponse) => {
            if (categoryId !== null && categoryId !== undefined && e.categoryId !== categoryId) return false;
            if (typeof excludeId === 'number' && e.id === excludeId) return false;

            if (showFilters) {
                if (filters.name && !e.name.toLowerCase().includes(filters.name.toLowerCase())) return false;

                const evDate = new Date(e.startDate);

                if (filters.startDate) {
                    const start = new Date(`${filters.startDate}T00:00:00`);
                    if (!isNaN(start.getTime()) && evDate < start) return false;
                }

                if (filters.endDate) {
                    const end = new Date(`${filters.endDate}T23:59:59`);
                    if (!isNaN(end.getTime()) && evDate > end) return false;
                }

                if (typeof filters.categoryId === 'number' && e.categoryId !== filters.categoryId) return false;
            }

            return true;
        });
    }, [datas, categoryId, excludeId, showFilters, filters]);

    const hasItems = filtered.length > 0;

    const hasActiveFilters = useMemo(() => {
        return Boolean(filters.name || filters.startDate || filters.endDate || filters.categoryId);
    }, [filters]);

    const emptyMessage = useMemo(() => {
        if (!showFilters || !hasActiveFilters) {
            return 'Nenhum evento disponível no momento.';
        }

        const parts: string[] = [];

        if (filters.name) {
            parts.push(`nome "${filters.name}"`);
        }

        if (filters.categoryId) {
            const category = categories.find((item) => item.id === filters.categoryId);
            if (category) {
                parts.push(`categoria "${category.name}"`);
            }
        }

        if (filters.startDate && filters.endDate) {
            parts.push(`data de ${formatDate(filters.startDate)} até ${formatDate(filters.endDate)}`);
        } else if (filters.startDate) {
            parts.push(`a partir de ${formatDate(filters.startDate)}`);
        } else if (filters.endDate) {
            parts.push(`até ${formatDate(filters.endDate)}`);
        }

        if (!parts.length) {
            return 'Nenhum evento disponível no momento.';
        }

        return `Nenhum evento encontrado para o filtro: ${parts.join(', ')}.`;
    }, [showFilters, hasActiveFilters, filters, categories, formatDate]);

    if (!showFilters && !hasItems) {
        return null;
    }

    return (
        <>
            {showFilters ? (
                <Filters onFilterChange={handleFilterChange} />
            ) : (
                hasItems && <h2 className={styles.otherEventsH2}>Outros eventos que podem te interessar:</h2>
            )}

            {hasItems ? (
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
                                    <p>
                                        Data:{' '}
                                        {new Date(event.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} -{' '}
                                        {[event.startTime, event.endTime]
                                            .map((t) =>
                                                new Date(t).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    timeZone: 'UTC',
                                                }),
                                            )
                                            .join(' às ')}
                                    </p>
                                    <p className={styles.local}>
                                        Local:{' '}
                                        <span>
                                            {event.customLocation ??
                                                event.location
                                                    .replace(/_/g, ' ')
                                                    .toLowerCase()
                                                    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())}
                                        </span>
                                    </p>
                                    <p>Palestrante: {event.speakerName}</p>
                                    <Link href={`/EventDetail/${event.id}`}>
                                        <ButtonRay text="Ver Mais" type="button" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <section className={styles.emptyStateSection}>
                    <div className={styles.emptyStateBox}>
                        <h2 className={styles.emptyStateTitle}>Ops...</h2>
                        <p className={styles.emptyStateText}>{emptyMessage}</p>
                    </div>
                </section>
            )}
        </>
    );
}