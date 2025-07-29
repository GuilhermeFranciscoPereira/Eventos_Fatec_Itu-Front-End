'use client';
import { useState, useEffect, useRef } from 'react';
import { CarouselPublicResponse } from '@/@Types/CarouselTypes';
import { useGetAllCarouselsPublic } from '@/hooks/api/Carousel/Get/useGetAllCarousels';

export default function useCarouselComponent() {
    const endX = useRef<number>(0);
    const startX = useRef<number>(0);
    const isDragging = useRef<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const { records: slideImages } = useGetAllCarouselsPublic();

    useEffect(() => {
        if (slideImages.length === 0) { return };
        if (timeoutRef.current) { clearTimeout(timeoutRef.current) };
        timeoutRef.current = setTimeout(() => {
            setActiveIndex((idx) => (idx + 1) % slideImages.length);
        }, 10000); // 10 seconds change automatically

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [activeIndex, slideImages.length]);

    const goToSlide: (idx: number) => void = (idx: number) => setActiveIndex(idx);
    const nextSlide: () => void = () => setActiveIndex((idx) => (idx + 1) % slideImages.length);
    const prevSlide: () => void = () => setActiveIndex((idx) => (idx - 1 + slideImages.length) % slideImages.length);

    function handleTouchStart(e: React.TouchEvent): void {
        isDragging.current = true;
        startX.current = e.touches[0].clientX;
    }

    function handleTouchMove(e: React.TouchEvent): void {
        if (!isDragging.current) return;
        endX.current = e.touches[0].clientX;
    }

    function handleTouchEnd(): void {
        if (!isDragging.current) return;
        isDragging.current = false;
        const diff = startX.current - endX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    function handleMouseDown(e: React.MouseEvent): void {
        isDragging.current = true;
        startX.current = e.clientX;
    }

    function handleMouseMove(e: React.MouseEvent): void {
        if (!isDragging.current) return;
        endX.current = e.clientX;
    }

    function handleMouseUp(): void {
        if (!isDragging.current) return;
        isDragging.current = false;
        const diff = startX.current - endX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    function handleMouseLeave(): void {
        if (isDragging.current) handleMouseUp();
    }

    return { slideImages: slideImages.map((item: CarouselPublicResponse) => item.imageUrl), activeIndex, goToSlide, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave };
}