import { Semester } from "@/@Types/EventTypes";

export type ParticipantProps = {
    id: number;
    name: string;
    email: string;
    courseId?: number;
    semester: Semester | null;
    ra: string | null;
    isPresent: boolean;
    createdAt: string;
    updatedAt: string;
    eventId: number;
};

export type CreateParticipantDto = {
    name: string;
    email: string;
    courseId?: number;
    semester: Semester | null;
    ra: string | null;
    eventId: number;
}
