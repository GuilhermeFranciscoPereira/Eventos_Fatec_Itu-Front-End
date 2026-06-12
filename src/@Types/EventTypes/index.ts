export type Semester =
    | 'ALL'
    | 'SEMESTER1'
    | 'SEMESTER2'
    | 'SEMESTER3'
    | 'SEMESTER4'
    | 'SEMESTER5'
    | 'SEMESTER6'
    | 'ESPECIAL';

export interface EventProps {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    courseId?: number;
    courseName?: string | null;
    courseIds?: number[];
    courseNames?: string[];
    semester: Semester | null;
    maxParticipants: number;
    isRestricted: boolean;
    locationId: number;
    locationName: string;
    customLocation: string | null;
    speakerName: string;
    startDate: string;
    endDate: string | null;
    startTime: string;
    endTime: string;
    duration: number | null;
    categoryId: number | null;
    createdAt: string;
    updatedAt: string;
    presenceSecret: string | null;
}

export interface CreateEventDto {
    name: string;
    description: string;
    courseId?: number;
    courseIds?: number[];
    semester?: Semester;
    maxParticipants: number;
    isRestricted: boolean;
    locationId: number;
    customLocation?: string;
    speakerName: string;
    startDate: string;
    endDate?: string | null;
    startTime: string;
    endTime: string;
    duration?: number;
    categoryId?: number;
    image: File;
    presenceSecret?: string;
}

export interface UpdateEventDto {
    name?: string;
    description?: string;
    courseId?: number;
    courseIds?: number[];
    semester?: Semester;
    maxParticipants?: number;
    isRestricted?: boolean;
    locationId?: number;
    customLocation?: string;
    speakerName?: string;
    startDate?: string;
    endDate?: string | null;
    startTime?: string;
    endTime?: string;
    duration?: number;
    categoryId?: number;
    image?: File;
    presenceSecret?: string;
}

export type AvailabilityTime = { start: string; end: string };

export type EventPublicResponse = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    courseId?: number;
    courseName?: string | null;
    courseIds?: number[];
    courseNames?: string[];
    semester: Semester | null;
    maxParticipants: number;
    currentParticipants: number;
    isRestricted: boolean;
    locationId: number;
    locationName: string;
    customLocation: string | null;
    speakerName: string;
    startDate: Date;
    endDate: Date | null;
    startTime: Date;
    endTime: Date;
    duration: number | null;
    categoryId: number | null;
};
