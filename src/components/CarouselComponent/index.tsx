'use client';
import ImageCloudinary from '../ImageCloudinary';
import styles from '@/components/CarouselComponent/CarouselComponent.module.css';
import useCarouselComponent from '@/hooks/components/CarouselComponent/useCarouselComponent';

export default function CarouselComponent(): React.ReactElement {
    const { slideImages, activeIndex, goToSlide, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = useCarouselComponent();

    return (
        <section
            className={styles.carousel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onDragStart={(e) => e.preventDefault()}
        >
            <div className={styles.slider} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {slideImages.map((url, idx) => (
                    <div className={styles.slide} key={`${url}-${idx}`}>
                        <ImageCloudinary
                            src={url}
                            alt={`Slide ${idx + 1}`}
                            sizes="100vw"
                            priority={idx === 0}
                            className={styles.image}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.indicators}>
                {slideImages.map((_, idx) => (
                    <span
                        key={idx}
                        className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                        onClick={() => goToSlide(idx)}
                    />
                ))}
            </div>
        </section>
    );
}
