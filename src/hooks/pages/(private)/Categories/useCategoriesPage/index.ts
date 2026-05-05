import { useRef } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { useEditCategory } from "@/hooks/api/Categories/Patch/useEditCategory";
import { useCreateCategory } from "@/hooks/api/Categories/Post/useCreateCategory";
import { useDeleteCategory } from "@/hooks/api/Categories/Delete/useDeleteCategory";
import { useGetAllCategories } from "@/hooks/api/Categories/Get/useGetAllCategories";

export function useCategoriesPage() {
    const editCategory = useEditCategory();
    const createCategory = useCreateCategory();
    const deleteCategory = useDeleteCategory();
    const openModal = useModalStore(s => s.openModal);
    const { categories, loading, refetch } = useGetAllCategories();
    const nameRef = useRef<HTMLInputElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);

    return { editCategory, createCategory, deleteCategory, openModal, categories, loading, refetch, nameRef, newNameRef };
}