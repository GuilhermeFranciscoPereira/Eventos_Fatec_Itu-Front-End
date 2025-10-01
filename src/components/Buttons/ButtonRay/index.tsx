import styles from '@/components/Buttons/ButtonRay/ButtonRay.module.css';

type ButtonRayProps = {
    text: string;
    type: "button" | "submit" | "reset" | undefined;
    disable?: boolean;
    onClick?: () => void;
}

export default function ButtonRay({ text, type, disable, onClick }: ButtonRayProps): React.ReactElement {
    return (
        <button type={type} className={styles.buttonRay} onClick={onClick} disabled={disable}>
            <span className={styles.inner}>
                {text}
            </span>
        </button>
    );
}
