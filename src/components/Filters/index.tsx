import { useState, useEffect } from 'react';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import styles from '@/components/Filters/Filters.module.css';
import { CategoryPublicResponse } from '@/@Types/CategoriesTypes';
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
    const [categoryId, setCategoryId] = useState<number | ''>('');

    const { datas } = useGetAllCategoriesPublic();

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
                >
                    <option value="">Todas</option>
                    {datas.map((c: CategoryPublicResponse) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
            </div>

            <div className={styles.rightSideFilters}>
                <div className={styles.datesFilter}>
                    <label htmlFor="filter-start" className={styles.label}>Data Início</label>
                    <input
                        id="filter-start"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
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
                            className={styles.inputDate}
                        />
                        {!startDate && (
                            <div className={`${styles.tooltipBubble} ${showTooltip ? styles.tooltipVisible : ''}`} role="tooltip">
                                Informe a data de início
                                <span className={styles.tooltipArrow} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
