"use client";
import { useEffect, useState } from "react";
import styles from "@/components/Buttons/ButtonScrollToTop/ButtonScrollToTop.module.css";

export default function ButtonScrollToTop(): React.ReactElement {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const viewportHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const minimumPageHeight = viewportHeight * 1.5;
            const showAfterScroll = viewportHeight * 0.45;
            const isLongEnough = documentHeight >= minimumPageHeight;
            const shouldShow = isLongEnough && scrollTop > showAfterScroll;

            setVisible(shouldShow);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            type="button"
            aria-label="Voltar para o topo"
            className={`${styles.scrollToTopButton} ${visible ? styles.visible : styles.hidden}`}
            onClick={handleScrollToTop}
        >
            <span className={styles.arrow} />
        </button>
    );
}