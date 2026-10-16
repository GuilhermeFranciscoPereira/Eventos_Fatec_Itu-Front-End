import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { getLocalDateString } from '@/utils/localDate';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import InputSelect from '@/components/Inputs/InputSelect/index';
import { CategoryPublicResponse } from '@/@Types/CategoriesTypes';
import styles from '@/components/Inputs/FiltersHome/FiltersHome.module.css';
import { useGetAllCategoriesPublic } from '@/hooks/api/Categories/Get/useGetAllCategories';

type FiltersProps = {
    onFilterChange: (filters: {
        name?: string;
        startDate?: string;
        endDate?: string;
        categoryId?: number;
    }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps): React.ReactElement {
    const [name, setName] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [startDate, setStartDate] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');

    const { datas } = useGetAllCategoriesPublic();
    const hasFilters = Boolean(name || startDate || endDate || categoryId);

    useEffect(() => {
        onFilterChange({
            name: name.trim() || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            categoryId: categoryId === '' ? undefined : Number(categoryId),
        });
    }, [name, startDate, endDate, categoryId, onFilterChange]);

    function clearFilters(): void {
        setName('');
        setStartDate('');
        setEndDate('');
        setCategoryId('');
    }

    return (
        <div className={styles.filtersContainer} role="search" aria-label="Filtrar eventos">
            <div className={styles.searchField}>
                <label htmlFor="filter-name" className={styles.label}>Buscar evento</label>
                <div className={styles.searchBox}>
                    <HiMiniMagnifyingGlass className={styles.searchIcon} aria-hidden />
                    <input
                        id="filter-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputText}
                        placeholder="Nome da palestra, workshop..."
                        autoComplete="off"
                    />
                </div>
            </div>

            <div className={styles.categoryField}>
                <InputSelect
                    label="Categoria"
                    value={categoryId}
                    onChange={setCategoryId}
                    options={[
                        { label: 'Todas as categorias', value: '' },
                        ...datas.map((c: CategoryPublicResponse) => ({
                            label: c.name ?? 'Sem nome',
                            value: String(c.id),
                        }))
                    ]}
                />
            </div>

            <div className={styles.dateField}>
                <label htmlFor="filter-start" className={styles.label}>A partir de</label>
                <input
                    id="filter-start"
                    type="date"
                    min={getLocalDateString()}
                    value={startDate}
                    onChange={(e) => {
                        setStartDate(e.target.value);
                        if (endDate && e.target.value > endDate) setEndDate('')
                    }}
                    className={`${styles.inputDate} ${!startDate ? styles.emptyDate : ''}`}
                />
            </div>

            <div className={styles.dateField}>
                <label htmlFor="filter-end" className={styles.label}>Até</label>
                <div
                    className={styles.dateFieldWrapper}
                    onMouseEnter={() => !startDate && setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => !startDate && setShowTooltip((v) => !v)}
                >
                    <input
                        id="filter-end"
                        type="date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={!startDate}
                        className={`${styles.inputDate} ${!endDate ? styles.emptyDate : ''}`}
                    />
                    {!startDate && (
                        <div className={`${styles.tooltipBubble} ${showTooltip ? styles.tooltipVisible : ''}`} role="tooltip">
                            Informe primeiro a data inicial
                            <span className={styles.tooltipArrow} />
                        </div>
                    )}
                </div>
            </div>

            <button
                type="button"
                className={`${styles.clearButton} ${hasFilters ? styles.clearVisible : ''}`}
                onClick={clearFilters}
                disabled={!hasFilters}
                aria-label="Limpar filtros"
            >
                <IoClose aria-hidden /> <span>Limpar</span>
            </button>
        </div>
    );
}
