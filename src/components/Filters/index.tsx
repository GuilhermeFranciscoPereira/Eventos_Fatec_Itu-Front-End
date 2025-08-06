import { useState, useEffect } from 'react';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { CategoryProps } from '@/@Types/CategoriesTypes';
import styles from '@/components/Filters/Filters.module.css';
import { useGetAllCategories } from '@/hooks/api/Categories/Get/useGetAllCategories';

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
    const [startDate, setStartDate] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number | ''>('');

    const { categories, loading } = useGetAllCategories();

    useEffect(() => {
        onFilterChange({
            name: name.trim() || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            categoryId: categoryId === '' ? undefined : categoryId,
        });
    }, [name, startDate, endDate, categoryId, onFilterChange]);

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.leftSideFilters}>
                <label htmlFor="filter-name" className={styles.label}>Filter eventos por nome</label>
                <div className={styles.searchBox}>
                    <HiMiniMagnifyingGlass className={styles.searchIcon} />
                    <input
                        id="filter-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputText}
                        placeholder="Pesquisar por nome"
                    />
                </div>
            </div>

            <div className={styles.centerSideFilters}>
                <label htmlFor="filter-category" className={styles.label}>Filtrar eventos por categoria</label>
                <select
                    id="filter-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
                    className={styles.selectDropdown}
                    disabled={loading}
                >
                    <option value="">Todas</option>
                    {categories.map((c: CategoryProps) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
            </div>

            <div className={styles.rightSideFilters}>
                <div className={styles.datesFilter}>
                    <label htmlFor="filter-start" className={styles.label}>Data Início</label>
                    <input
                        id="filter-start"
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            if (endDate && e.target.value > endDate) setEndDate('')
                        }}
                        className={styles.inputDate}
                    />
                </div>

                <div className={styles.datesFilter}>
                    <label htmlFor="filter-end" className={styles.label}>Data Fim</label>
                    <input
                        id="filter-end"
                        type="date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={!startDate}
                        className={styles.inputDate}
                    />
                </div>
            </div>
        </div>
    );
}
