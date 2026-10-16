'use client';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/Inputs/InputSelect/InputSelect.module.css';
import { moveOptionFocus, useFloatingDropdown } from '@/hooks/components/useFloatingDropdown';

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
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { dropdownRef, style, placement, focusOptionOnOpen } = useFloatingDropdown(triggerRef, isOpen && !disabled, 14);

    const selectedOption = useMemo(
        () => options.find(option => option.value === value),
        [options, value],
    );

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

    function handleSelect(optionValue: string): void {
        if (hideOptionValue && optionValue === hideOptionValue && value !== hideOptionValue) return;

        onChange(optionValue);
        setIsOpen(false);
        triggerRef.current?.focus();
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

    const filteredOptions = useMemo(() => {
        if (!hideOptionValue) return options;
        if (value === hideOptionValue) return options;

        return options.filter(option => option.value !== hideOptionValue);
    }, [options, value, hideOptionValue]);

    return (
        <div className={`${styles.inputSelectField} ${className ?? ''}`.trim()} ref={wrapperRef} onKeyDown={handleKeyDown}>
            {label && <span className={`${styles.fieldLabel} ${labelClassName ?? ''}`.trim()}>{label}</span>}

            <button
                ref={triggerRef}
                type="button"
                className={`${styles.trigger} ${triggerClassName ?? ''}`.trim()}
                disabled={disabled}
                onClick={() => setIsOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={styles.triggerText}>
                    {selectedOption?.label ?? placeholder}
                </span>
                <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} />
            </button>

            {isOpen && !disabled && style && createPortal(
                <div
                    ref={dropdownRef}
                    className={`${styles.dropdown} ${placement === 'top' ? styles.dropdownTop : ''}`}
                    style={style}
                >
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
                </div>,
                document.body,
            )}
        </div>
    );
}
