'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/Inputs/InputMultiSelect/InputMultiSelect.module.css';

type InputMultiSelectOption = {
    label: string;
    value: string;
};

type InputMultiSelectProps = {
    label?: string;
    value: string[];
    options: InputMultiSelectOption[];
    placeholder?: string;
    disabled?: boolean;
    onChange: (value: string[]) => void;
    className?: string;
    allLabel?: string;
};

export default function InputMultiSelect({ label, value, options, placeholder = 'Selecione', disabled = false, onChange, className, allLabel = 'Todos' }: InputMultiSelectProps): React.ReactElement {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const selectedLabels = useMemo(() => {
        return options
            .filter((option) => value.includes(option.value))
            .map((option) => option.label);
    }, [options, value]);

    const triggerText = useMemo(() => {
        if (!value.length) return allLabel;
        if (!selectedLabels.length) return placeholder;
        if (selectedLabels.length <= 2) return selectedLabels.join(', ');

        return `${selectedLabels.length} cursos selecionados`;
    }, [allLabel, placeholder, selectedLabels, value.length]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleToggle(optionValue: string): void {
        if (value.includes(optionValue)) {
            onChange(value.filter((currentValue) => currentValue !== optionValue));
            return;
        }

        onChange([...value, optionValue]);
    }

    return (
        <div className={`${styles.inputMultiSelectField} ${className ?? ''}`.trim()} ref={wrapperRef}>
            {label && <span className={styles.fieldLabel}>{label}</span>}

            <button
                type="button"
                className={styles.trigger}
                disabled={disabled}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span className={styles.triggerText}>{triggerText}</span>
                <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} />
            </button>

            {isOpen && !disabled && (
                <div className={styles.dropdown}>
                    <ul className={styles.dropdownList}>
                        <li className={styles.dropdownItem}>
                            <button
                                type="button"
                                className={`${styles.dropdownLink} ${value.length === 0 ? styles.active : ''}`}
                                onClick={() => onChange([])}
                            >
                                <span className={`${styles.checkbox} ${value.length === 0 ? styles.checkboxChecked : ''}`} aria-hidden="true" />
                                <span>{allLabel}</span>
                            </button>
                        </li>

                        {options.map(option => {
                            const checked = value.includes(option.value);

                            return (
                                <li key={option.value} className={styles.dropdownItem}>
                                    <button
                                        type="button"
                                        className={`${styles.dropdownLink} ${checked ? styles.active : ''}`}
                                        onClick={() => handleToggle(option.value)}
                                    >
                                        <span className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`} aria-hidden="true" />
                                        <span>{option.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
