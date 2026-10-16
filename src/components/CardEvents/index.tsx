'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import EmptyState from '@/components/EmptyState';
import { IoArrowForward } from 'react-icons/io5';
import { useUserStore } from '@/stores/useUserStore';
import { useCallback, useMemo, useState } from 'react';
import Filters from '@/components/Inputs/FiltersHome';
import { EventPublicResponse } from '@/@Types/EventTypes';
import ImageCloudinary from '@/components/ImageCloudinary';
import styles from '@/components/CardEvents/CardEvents.module.css';
import { useGetAllEventsPublic } from '@/hooks/api/Events/Get/useGetAllEvents';
import { MdAccessTime, MdEventBusy, MdLocationOn, MdPerson, MdSchool } from 'react-icons/md';
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

const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone: 'UTC' });
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

function describeEvent(event: EventPublicResponse) {
    const start = new Date(event.startDate);
    const startLabel = dateFormatter.format(start);
    const endLabel = event.endDate ? dateFormatter.format(new Date(event.endDate)) : null;
    const remaining = Math.max(event.maxParticipants - event.currentParticipants, 0);
    const filledPercent = event.maxParticipants ? Math.min(100, Math.round((event.currentParticipants / event.maxParticipants) * 100)) : 0;

    return {
        day: dayFormatter.format(start),
        month: monthFormatter.format(start).replace('.', ''),
        dateLabel: endLabel && endLabel !== startLabel ? `${startLabel} até ${endLabel}` : startLabel,
        timeLabel: `${timeFormatter.format(new Date(event.startTime))} às ${timeFormatter.format(new Date(event.endTime))}`,
        location: event.locationName.toLowerCase() === 'outros' ? event.customLocation ?? 'Local a definir' : event.locationName,
        remaining,
        filledPercent,
        almostFull: event.maxParticipants > 0 && remaining <= Math.max(3, Math.ceil(event.maxParticipants * 0.1)),
    };
}

export default function CardEvents({
    excludeId,
    showFilters = true,
    categoryId = null,
}: CardEventsProps): React.ReactElement | null {
    const { datas, loading } = useGetAllEventsPublic();
    const { datas: categories } = useGetAllCategoriesPublic();
    const user = useUserStore(s => s.user);

    const [filters, setFilters] = useState<FiltersState>({});

    const handleFilterChange = useCallback((f: FiltersState) => {
        setFilters(f);
    }, []);

    const formatDate = useCallback((date: string): string => {
        return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR');
    }, []);

    const categoryNames = useMemo(() => new Map(categories.map(category => [category.id, category.name])), [categories]);

    const filtered = useMemo(() => {
        return datas.filter((e: EventPublicResponse) => {
            if (categoryId !== null && categoryId !== undefined && e.categoryId !== categoryId) return false;
            if (typeof excludeId === 'number' && e.id === excludeId) return false;

            if (showFilters) {
                if (filters.name && !e.name.toLowerCase().includes(filters.name.toLowerCase())) return false;

                const evStartDate = new Date(e.startDate);
                const evEndDate = e.endDate ? new Date(e.endDate) : evStartDate;

                if (filters.startDate) {
                    const start = new Date(`${filters.startDate}T00:00:00`);
                    if (!isNaN(start.getTime()) && evEndDate < start) return false;
                }

                if (filters.endDate) {
                    const end = new Date(`${filters.endDate}T23:59:59`);
                    if (!isNaN(end.getTime()) && evStartDate > end) return false;
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
            return 'Novos eventos aparecem aqui assim que forem publicados. Volte em breve!';
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
            return 'Novos eventos aparecem aqui assim que forem publicados. Volte em breve!';
        }

        return `Nenhum evento encontrado para o filtro: ${parts.join(', ')}. Tente outra combinação.`;
    }, [showFilters, hasActiveFilters, filters, categories, formatDate]);

    if (!showFilters && (loading || !hasItems)) {
        return null;
    }

    return (
        <div className={styles.cardEvents}>
            {showFilters ? (
                <>
                    <Filters onFilterChange={handleFilterChange} />
                    {hasItems && (
                        <p className={styles.resultCount} aria-live="polite">
                            <strong>{filtered.length}</strong> {filtered.length === 1 ? 'evento disponível' : 'eventos disponíveis'}
                        </p>
                    )}
                </>
            ) : (
                <header className={styles.otherHeader}>
                    <span className={styles.otherEyebrow}>Continue explorando</span>
                    <h2 className={styles.otherEventsH2}>Outros eventos que podem te interessar</h2>
                </header>
            )}

            {loading ? (
                <div className={styles.cardEventsSection} aria-busy="true" aria-label="Carregando eventos">
                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} className={styles.skeletonCard} aria-hidden>
                            <div className={styles.skeletonMedia} />
                            <div className={styles.skeletonBody}>
                                <span className={styles.skeletonLine} />
                                <span className={styles.skeletonLine} />
                                <span className={styles.skeletonLine} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : hasItems ? (
                <section className={styles.cardEventsSection} aria-label="Eventos">
                    {filtered.map((event: EventPublicResponse, index: number) => {
                        const info = describeEvent(event);
                        const categoryName = event.categoryId ? categoryNames.get(event.categoryId) : null;

                        return (
                            <Reveal as="article" key={event.id} className={styles.card} delay={(index % 4) * 80}>
                                <Link href={`/EventDetail/${event.id}`} className={styles.cardLink} aria-label={`Ver detalhes do evento ${event.name}`}>
                                    <div className={styles.media}>
                                        <ImageCloudinary
                                            src={event.imageUrl}
                                            alt={event.name}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className={styles.mediaImage}
                                        />
                                        <span className={styles.dateBadge} aria-hidden>
                                            <strong>{info.day}</strong>
                                            <span>{info.month}</span>
                                        </span>
                                        {event.isRestricted && (
                                            <span className={styles.badge}><MdSchool aria-hidden /> Exclusivo Fatec</span>
                                        )}
                                    </div>

                                    <div className={styles.cardData}>
                                        {categoryName && <span className={styles.category}>{categoryName}</span>}
                                        <h3 className={styles.title}>{event.name}</h3>

                                        <ul className={styles.meta}>
                                            <li><MdAccessTime aria-hidden /> <span>{info.dateLabel} · {info.timeLabel}</span></li>
                                            <li><MdLocationOn aria-hidden /> <span>{info.location}</span></li>
                                            <li><MdPerson aria-hidden /> <span>{event.speakerName}</span></li>
                                        </ul>

                                        {user && (
                                            <div className={`${styles.seats} ${info.almostFull ? styles.seatsAlmostFull : ''}`}>
                                                <div className={styles.seatsBar} aria-hidden>
                                                    <span style={{ width: `${info.filledPercent}%` }} />
                                                </div>
                                                <span className={styles.seatsLabel}>
                                                    {info.almostFull ? 'Últimas vagas: ' : ''}{info.remaining} {info.remaining === 1 ? 'vaga restante' : 'vagas restantes'}
                                                </span>
                                            </div>
                                        )}

                                        <span className={styles.cta}>
                                            Ver detalhes <IoArrowForward aria-hidden />
                                        </span>
                                    </div>
                                </Link>
                            </Reveal>
                        );
                    })}
                </section>
            ) : (
                <div className={styles.emptyStateBox}>
                    <EmptyState
                        icon={<MdEventBusy />}
                        title={hasActiveFilters ? 'Nenhum evento com esses filtros' : 'Nenhum evento disponível no momento'}
                        description={emptyMessage}
                    />
                </div>
            )}
        </div>
    );
}
