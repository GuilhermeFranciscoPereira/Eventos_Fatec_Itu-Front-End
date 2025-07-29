'use client';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import styles from '@/components/CarouselComponent/CarouselComponent.module.css';
import useCarouselComponent from '@/hooks/components/CarouselComponent/useCarouselComponent';

export default function CarouselComponent(): React.ReactElement {
    const { slideImages, activeIndex, goToSlide, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = useCarouselComponent();

    const cld = new Cloudinary({ cloud: { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME! } });

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
                {slideImages.map((url, idx) => {
                    const parts = url.split('/');
                    const publicId = parts.slice(-2).join('/').split('.')[0];
                    const img = cld.image(publicId).resize(fill().width(1920).height(600)).format('auto').quality('auto:best');

                    return (
                        <div className={styles.slide} key={idx}>
                            <AdvancedImage cldImg={img} className={styles.image} />
                        </div>
                    );
                })}
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
