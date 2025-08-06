import { forwardRef, useId } from 'react';
import styles from '@/components/Inputs/InputCheckbox/InputCheckbox.module.css';

type InputCheckboxProps = {
    label?: string;
    id?: string;
} & React.InputHTMLAttributes<HTMLInputElement>

export default forwardRef<HTMLInputElement, InputCheckboxProps>(
    function InputCheckbox({ label, id, ...props }, ref): React.ReactElement {
        const generatedId: string = useId();
        const inputId: string = id ?? `checkbox-${generatedId}`;

        return (
            <label
                htmlFor={inputId}
                className={`${styles.container} ${label ? styles.containerInputWithText : ''}`}
            >
                <input
                    ref={ref}
                    id={inputId}
                    type="checkbox"
                    className={styles.checkboxInput}
                    {...props}
                />
                <div className={styles.checkmark} />
                {label && <p>{label}</p>}
            </label>
        );
    }
);
