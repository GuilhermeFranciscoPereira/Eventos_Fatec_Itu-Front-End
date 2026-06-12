import { useRef } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { useToastStore } from "@/stores/useToastStore";
import { useCreateCarousel } from "@/hooks/api/Carousel/Post/useCreateCarousel";
import { useGetAllCarousels } from "@/hooks/api/Carousel/Get/useGetAllCarousels";
import { useDeleteCarousel } from "@/hooks/api/Carousel/Delete/useDeleteCarousel";
import { useEditCarousel, useReorderCarousel, useToggleActiveCarousel } from "@/hooks/api/Carousel/Patch/useEditCarousel";

export function useCarouselPage() {
    const editCarousel = useEditCarousel();
    const reorderCarousel = useReorderCarousel();
    const createCarousel = useCreateCarousel();
    const deleteCarousel = useDeleteCarousel();
    const toggleActive = useToggleActiveCarousel();
    const openModal = useModalStore(s => s.openModal);
    const showToast = useToastStore((s) => s.showToast);
    const { records: carousels, loading, refetch } = useGetAllCarousels();

    const nameRef = useRef<HTMLInputElement>(null);
    const orderRef = useRef<HTMLInputElement>(null);
    const activeRef = useRef<HTMLInputElement>(null);
    const selectedFileRef = useRef<File | null>(null);

    async function handleToggle(id: number, nextState: boolean): Promise<void> {
        await toggleActive(id, nextState);
        refetch();
    }

    return { editCarousel, reorderCarousel, createCarousel, deleteCarousel, openModal, showToast, handleToggle, carousels, loading, refetch, nameRef, orderRef, activeRef, selectedFileRef }
}
