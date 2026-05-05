import { useRef } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { useEditCourse } from "@/hooks/api/Courses/Patch/useEditCourses";
import { useGetAllCourses } from "@/hooks/api/Courses/Get/useGetAllCourses";
import { useCreateCourse } from "@/hooks/api/Courses/Post/useCreateCourses";
import { useDeleteCourse } from "@/hooks/api/Courses/Delete/useDeleteCourses";

export function useCoursesPage() {
    const editCourse = useEditCourse();
    const createCourse = useCreateCourse();
    const deleteCourse = useDeleteCourse();
    const openModal = useModalStore(s => s.openModal);
    const { courses, loading, refetch } = useGetAllCourses();
    const nameRef = useRef<HTMLInputElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);

    return { editCourse, createCourse, deleteCourse, openModal, courses, loading, refetch, nameRef, newNameRef };
}