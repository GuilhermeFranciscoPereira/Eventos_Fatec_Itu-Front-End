'use client';
import ImageCloudinary from '../ImageCloudinary';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import styles from '@/components/CarouselComponent/CarouselComponent.module.css';
import useCarouselComponent from '@/hooks/components/CarouselComponent/useCarouselComponent';

export default function CarouselComponent(): React.ReactElement | null {
    const { slides, activeIndex, goToSlide, nextSlide, prevSlide, setPaused, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = useCarouselComponent();

    if (!slides.length) return null;

    return (
        <section className={styles.carouselShell} aria-roledescription="carrossel" aria-label="Destaques da Fatec Itu">
            <div
                className={styles.carousel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={handleMouseLeave}
                onDragStart={(e) => e.preventDefault()}
            >
                <div className={styles.slider} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                    {slides.map((slide, idx) => (
                        <div
                            className={`${styles.slide} ${idx === activeIndex ? styles.activeSlide : ''}`}
                            key={`${slide.imageUrl}-${idx}`}
                            aria-roledescription="slide"
                            aria-label={`${idx + 1} de ${slides.length}`}
                            aria-hidden={idx !== activeIndex}
                        >
                            <ImageCloudinary
                                src={slide.imageUrl}
                                alt={slide.name || `Destaque ${idx + 1}`}
                                sizes="(max-width: 768px) 100vw, 90vw"
                                priority={idx === 0}
                                className={styles.image}
                            />
                        </div>
                    ))}
                </div>

                {slides.length > 1 && (
                    <>
                        <button type="button" className={`${styles.arrow} ${styles.arrowPrev}`} onClick={prevSlide} aria-label="Imagem anterior">
                            <IoChevronBack aria-hidden />
                        </button>
                        <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={nextSlide} aria-label="Próxima imagem">
                            <IoChevronForward aria-hidden />
                        </button>

                        <div className={styles.indicators}>
                            {slides.map((slide, idx) => (
                                <button
                                    type="button"
                                    key={`${slide.imageUrl}-dot-${idx}`}
                                    className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                                    onClick={() => goToSlide(idx)}
                                    aria-label={`Ir para a imagem ${idx + 1}`}
                                    aria-current={idx === activeIndex}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
