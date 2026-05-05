import { useRef } from "react";
import { Semester } from "@/@Types/EventTypes";
import { useModalStore } from "@/stores/useModalStore";
import type { CoursePublicResponse } from '@/@Types/CoursesTypes';
import { useGetAllCoursesPublic } from "@/hooks/api/Courses/Get/useGetAllCourses";
import { useCreateParticipant } from "@/hooks/api/Participants/Post/useCreateParticipant";

export type SubscriptionFormProps = {
    nameRef: React.RefObject<HTMLInputElement | null>;
    emailRef: React.RefObject<HTMLInputElement | null>;
    courseValue: string;
    semesterValue: string;
    onCourseChange: (value: string) => void;
    onSemesterChange: (value: string) => void;
    courseOptions: CoursePublicResponse[];
    coursesLoading: boolean;
    raRef: React.RefObject<HTMLInputElement | null>;
    semesterOptions: Semester[];
    onlyStudents: boolean;
};

export function useEventDetailPage() {
    const createParticipant = useCreateParticipant();
    const openModal = useModalStore(s => s.openModal);
    const { datas: publicCourses, loading: coursesLoading } = useGetAllCoursesPublic();
    const raRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const semesterOptions: Semester[] = ['SEMESTER1', 'SEMESTER2', 'SEMESTER3', 'SEMESTER4', 'SEMESTER5', 'SEMESTER6', 'ESPECIAL'];

    return { createParticipant, openModal, publicCourses, coursesLoading, raRef, nameRef, emailRef, semesterOptions };
}