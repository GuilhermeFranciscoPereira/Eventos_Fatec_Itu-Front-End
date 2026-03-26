import { useState, useEffect } from 'react';
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

    useEffect(() => {
        onFilterChange({
            name: name.trim() || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            categoryId: categoryId === '' ? undefined : Number(categoryId),
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
                <InputSelect
                    className={styles.customSelect}
                    labelClassName={styles.customSelectLabel}
                    triggerClassName={styles.customSelectTrigger}
                    label="Filtrar eventos por categoria"
                    value={categoryId}
                    onChange={setCategoryId}
                    options={[
                        { label: 'Todas', value: '' },
                        ...datas.map((c: CategoryPublicResponse) => ({
                            label: c.name ?? 'Sem nome',
                            value: String(c.id),
                        }))
                    ]}
                />
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
                        className={`${styles.inputDate} ${!startDate ? styles.emptyDate : ''}`}
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
                            className={`${styles.inputDate} ${!endDate ? styles.emptyDate : ''}`}
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
