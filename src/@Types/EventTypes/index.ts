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
    semester: Semester | null;
    maxParticipants: number;
    isRestricted: boolean;
    locationId: number;
    locationName: string;
    customLocation: string | null;
    speakerName: string;
    startDate: string;
    startTime: string;
    endTime: string;
    duration: number | null;
    categoryId: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventDto {
    name: string;
    description: string;
    courseId?: number;
    semester?: Semester;
    maxParticipants: number;
    isRestricted: boolean;
    locationId: number;
    customLocation?: string;
    speakerName: string;
    startDate: string;
    startTime: string;
    endTime: string;
    duration?: number;
    categoryId?: number;
    image: File;
}

export interface UpdateEventDto {
    name?: string;
    description?: string;
    courseId?: number;
    semester?: Semester;
    maxParticipants?: number;
    isRestricted?: boolean;
    locationId?: number;
    customLocation?: string;
    speakerName?: string;
    startDate?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    categoryId?: number;
    image?: File;
}

export type AvailabilityTime = { start: string; end: string };

export type EventPublicResponse = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    courseId?: number;
    courseName?: string | null;
    semester: Semester | null;
    maxParticipants: number;
    currentParticipants: number;
    isRestricted: boolean;
    locationId: number;
    locationName: string;
    customLocation: string | null;
    speakerName: string;
    startDate: Date;
    startTime: Date;
    endTime: Date;
    duration: number | null;
    categoryId: number | null;
};