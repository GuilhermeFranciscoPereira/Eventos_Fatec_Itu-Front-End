'use client'
import { FaRegEye } from 'react-icons/fa';
import { LuEyeOff } from 'react-icons/lu';
import { useState, useId, forwardRef } from 'react';
import styles from '@/components/Inputs/InputDefault/InputDefault.module.css';

type InputDefaultProps = {
    type?: 'text' | 'email' | 'password'
    label: string
    id?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default forwardRef<HTMLInputElement, InputDefaultProps>(
    function InputDefault({ type = 'text', label, id, ...inputProps }, ref): React.ReactElement {
        const generatedId = useId();
        const inputId = id ?? `input-${generatedId}`;
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className={styles.wrapper}>
                <div className={styles.waveGroup}>
                    <input
                        {...inputProps}
                        ref={ref}
                        id={inputId}
                        className={styles.inputField}
                        type={type === 'password' && showPassword ? 'text' : type}
                        required
                    />
                    <label htmlFor={inputId} className={styles.label}>
                        {Array.from(label).map((char, idx) => (
                            <span
                                key={idx}
                                className={styles.labelChar}
                                style={{ '--index': idx } as React.CSSProperties}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </label>
                    {type === 'password' && (
                        <button
                            type="button"
                            aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                            onClick={() => setShowPassword(prev => !prev)}
                            className={styles.showPasswordToggle}
                        >
                            {showPassword ? <LuEyeOff /> : <FaRegEye />}
                        </button>
                    )}
                </div>
            </div>
        )
    }
)