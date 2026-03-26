'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/Inputs/InputSelect/InputSelect.module.css';

type InputSelectOption = {
    label: string;
    value: string;
};

type InputSelectProps = {
    label?: string;
    value: string;
    options: InputSelectOption[];
    placeholder?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    className?: string;
    hideOptionValue?: string;
    labelClassName?: string;
    triggerClassName?: string;
};

export default function InputSelect({ label, value, options, placeholder = 'Selecione', disabled = false, onChange, className, hideOptionValue, triggerClassName, labelClassName }: InputSelectProps): React.ReactElement {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const selectedOption = useMemo(
        () => options.find(option => option.value === value),
        [options, value],
    );

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

    function handleSelect(optionValue: string): void {
        if (hideOptionValue && optionValue === hideOptionValue && value !== hideOptionValue) return;

        onChange(optionValue);
        setIsOpen(false);
    }

    const filteredOptions = useMemo(() => {
        if (!hideOptionValue) return options;
        if (value === hideOptionValue) return options;

        return options.filter(option => option.value !== hideOptionValue);
    }, [options, value, hideOptionValue]);

    return (
        <div className={`${styles.inputSelectField} ${className ?? ''}`.trim()} ref={wrapperRef}>
            {label && <span className={`${styles.fieldLabel} ${labelClassName ?? ''}`.trim()}>{label}</span>}

            <button
                type="button"
                className={`${styles.trigger} ${triggerClassName ?? ''}`.trim()}
                disabled={disabled}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span className={styles.triggerText}>
                    {selectedOption?.label ?? placeholder}
                </span>
                <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} />
            </button>

            {isOpen && !disabled && (
                <div className={styles.dropdown}>
                    <ul className={styles.dropdownList}>
                        {filteredOptions.map(option => (
                            <li key={option.value} className={styles.dropdownItem}>
                                <button
                                    type="button"
                                    className={`${styles.dropdownLink} ${value === option.value ? styles.active : ''}`}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span>{option.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}