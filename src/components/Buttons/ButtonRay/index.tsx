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
            <span className={styles.fold}></span>
            <div className={styles.points_wrapper}>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
                <i className={styles.point}></i>
            </div>
            <span className={styles.inner}>
                <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                >
                    <polyline
                        points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"
                    ></polyline>
                </svg>
                {text}
            </span>
        </button>
    );
}
