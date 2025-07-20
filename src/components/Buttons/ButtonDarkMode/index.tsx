'use client';
import useButtonDarkMode from '@/hooks/components/Buttons/useButtonDarkMode';
import styles from '@/components/Buttons/ButtonDarkMode/ButtonDarkMode.module.css';

export default function ButtonDarkMode(): React.ReactElement {
    const { checked, toggle } = useButtonDarkMode();

    return (
        <button className={styles.buttonWrapper}>
            <input
                type="checkbox"
                id="hide-checkbox"
                checked={checked}
                onChange={toggle}
                className={styles.hideCheckbox}
            />
            <label htmlFor="hide-checkbox" className={styles.toggle}>
                <span className={styles.toggleButton}>
                    <span className={`${styles.crater} ${styles.crater1}`} />
                    <span className={`${styles.crater} ${styles.crater2}`} />
                    <span className={`${styles.crater} ${styles.crater3}`} />
                    <span className={`${styles.crater} ${styles.crater4}`} />
                    <span className={`${styles.crater} ${styles.crater5}`} />
                    <span className={`${styles.crater} ${styles.crater6}`} />
                    <span className={`${styles.crater} ${styles.crater7}`} />
                </span>
                <span className={`${styles.star} ${styles.star1}`} />
                <span className={`${styles.star} ${styles.star2}`} />
                <span className={`${styles.star} ${styles.star3}`} />
                <span className={`${styles.star} ${styles.star4}`} />
                <span className={`${styles.star} ${styles.star5}`} />
                <span className={`${styles.star} ${styles.star6}`} />
                <span className={`${styles.star} ${styles.star7}`} />
                <span className={`${styles.star} ${styles.star8}`} />
            </label>
        </button>
    )
};
