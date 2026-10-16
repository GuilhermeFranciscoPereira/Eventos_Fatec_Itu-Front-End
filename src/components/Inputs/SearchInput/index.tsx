'use client';
import { useId } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import styles from '@/components/Inputs/SearchInput/SearchInput.module.css';

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
};

export default function SearchInput({ value, onChange, placeholder = 'Buscar...', label = 'Buscar', className }: SearchInputProps): React.ReactElement {
    const id = useId();

    return (
        <div className={`${styles.search} ${className ?? ''}`.trim()}>
            <label htmlFor={id} className="visuallyHidden">{label}</label>
            <HiMiniMagnifyingGlass className={styles.icon} aria-hidden />
            <input
                id={id}
                type="search"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={styles.input}
                autoComplete="off"
            />
            {value && (
                <button type="button" className={styles.clear} onClick={() => onChange('')} aria-label="Limpar busca">
                    <IoClose aria-hidden />
                </button>
            )}
        </div>
    );
}
