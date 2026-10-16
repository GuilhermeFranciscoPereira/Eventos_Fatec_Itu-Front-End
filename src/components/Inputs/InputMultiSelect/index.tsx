'use client';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/Inputs/InputMultiSelect/InputMultiSelect.module.css';
import { moveOptionFocus, useFloatingDropdown } from '@/hooks/components/useFloatingDropdown';

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
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { dropdownRef, style, placement, focusOptionOnOpen } = useFloatingDropdown(triggerRef, isOpen && !disabled, 15);

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
            const target = event.target as Node;
            if (!wrapperRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    function handleToggle(optionValue: string): void {
        if (value.includes(optionValue)) {
            onChange(value.filter((currentValue) => currentValue !== optionValue));
            return;
        }

        onChange([...value, optionValue]);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (disabled) return;
            event.preventDefault();
            const direction = event.key === 'ArrowDown' ? 1 : -1;

            if (!isOpen) {
                focusOptionOnOpen(direction);
                setIsOpen(true);
                return;
            }

            moveOptionFocus(dropdownRef.current, direction);
            return;
        }

        if (!isOpen) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            setIsOpen(false);
            triggerRef.current?.focus();
            return;
        }

        if (event.key === 'Tab') {
            if (dropdownRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
            setIsOpen(false);
        }
    }

    return (
        <div className={`${styles.inputMultiSelectField} ${className ?? ''}`.trim()} ref={wrapperRef} onKeyDown={handleKeyDown}>
            {label && <span className={styles.fieldLabel}>{label}</span>}

            <button
                ref={triggerRef}
                type="button"
                className={styles.trigger}
                disabled={disabled}
                onClick={() => setIsOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={styles.triggerText}>{triggerText}</span>
                <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} />
            </button>

            {isOpen && !disabled && style && createPortal(
                <div
                    ref={dropdownRef}
                    className={`${styles.dropdown} ${placement === 'top' ? styles.dropdownTop : ''}`}
                    style={style}
                >
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
                </div>,
                document.body,
            )}
        </div>
    );
}
