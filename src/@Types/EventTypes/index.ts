export type Course = 'ADS' | 'GE' | 'GTI' | 'GEMP' | 'MEC';

export type Semester =
    | 'SEMESTER1'
    | 'SEMESTER2'
    | 'SEMESTER3'
    | 'SEMESTER4'
    | 'SEMESTER5'
    | 'SEMESTER6'
    | 'ESPECIAL';

export type Location =
    | 'AUDITORIO'
    | 'BIBLIOTECA'
    | 'SALA_MAKER'
    | 'LAB_MECANICA_METROLOGIA'
    | 'LAB_SISTEMAS_INTEGRADOS'
    | 'LAB_HIDRAULICA_PNEUMATICA'
    | 'LAB_ENSAIOS_METALOGRAFICOS'
    | 'LAB_ELETRONICA_POTENCIA'
    | 'LAB_COMANDOS_ELETRICOS'
    | 'LAB_CONTROLE_PROCESSOS'
    | 'LAB_INFORMATICA_1'
    | 'LAB_INFORMATICA_2'
    | 'LAB_INFORMATICA_3'
    | 'LAB_INFORMATICA_4'
    | 'LAB_INFORMATICA_5'
    | 'LAB_INFORMATICA_6'
    | 'SALA_1'
    | 'SALA_2'
    | 'SALA_3'
    | 'SALA_4'
    | 'SALA_5'
    | 'SALA_6'
    | 'SALA_7'
    | 'SALA_8'
    | 'SALA_9'
    | 'SALA_9_3_4'
    | 'SALA_10'
    | 'SALA_11'
    | 'SALA_12'
    | 'OUTROS';

export interface EventProps {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    course: Course;
    semester: Semester | null;
    maxParticipants: number;
    isRestricted: boolean;
    location: Location;
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
    course: Course;
    semester?: Semester;
    maxParticipants: number;
    isRestricted: boolean;
    location: Location;
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
    course?: Course;
    semester?: Semester;
    maxParticipants?: number;
    isRestricted?: boolean;
    location?: Location;
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
