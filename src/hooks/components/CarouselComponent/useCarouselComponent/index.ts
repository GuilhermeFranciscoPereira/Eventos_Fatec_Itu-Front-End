'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CarouselPublicResponse } from '@/@Types/CarouselTypes';
import { useGetAllCarouselsPublic } from '@/hooks/api/Carousel/Get/useGetAllCarousels';

const AUTOPLAY_MS = 8000;

export default function useCarouselComponent() {
    const endX = useRef<number>(0);
    const startX = useRef<number>(0);
    const isDragging = useRef<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [paused, setPaused] = useState<boolean>(false);
    const { records } = useGetAllCarouselsPublic();
    const total = records.length;

    useEffect(() => {
        if (total === 0 || paused) { return };
        if (timeoutRef.current) { clearTimeout(timeoutRef.current) };
        timeoutRef.current = setTimeout(() => {
            setActiveIndex((idx) => (idx + 1) % total);
        }, AUTOPLAY_MS);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [activeIndex, total, paused]);

    const goToSlide = useCallback((idx: number) => setActiveIndex(idx), []);
    const nextSlide = useCallback(() => setActiveIndex((idx) => (idx + 1) % Math.max(total, 1)), [total]);
    const prevSlide = useCallback(() => setActiveIndex((idx) => (idx - 1 + Math.max(total, 1)) % Math.max(total, 1)), [total]);

    function finishDrag(): void {
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

    function handleTouchStart(e: React.TouchEvent): void {
        isDragging.current = true;
        startX.current = e.touches[0].clientX;
        endX.current = e.touches[0].clientX;
    }

    function handleTouchMove(e: React.TouchEvent): void {
        if (!isDragging.current) return;
        endX.current = e.touches[0].clientX;
    }

    function handleTouchEnd(): void {
        finishDrag();
    }

    function handleMouseDown(e: React.MouseEvent): void {
        isDragging.current = true;
        startX.current = e.clientX;
        endX.current = e.clientX;
    }

    function handleMouseMove(e: React.MouseEvent): void {
        if (!isDragging.current) return;
        endX.current = e.clientX;
    }

    function handleMouseUp(): void {
        finishDrag();
    }

    function handleMouseLeave(): void {
        finishDrag();
        setPaused(false);
    }

    return {
        slides: records.map((item: CarouselPublicResponse) => ({ imageUrl: item.imageUrl, name: item.name })),
        activeIndex,
        goToSlide,
        nextSlide,
        prevSlide,
        setPaused,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
    };
}
