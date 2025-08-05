import { Course, Semester } from "@/@Types/EventTypes";

export type CreateParticipantDto = {
    name: string;
    email: string;
    course: Course | null;
    semester: Semester | null;
    ra: string | null;
    eventId: number;
}
