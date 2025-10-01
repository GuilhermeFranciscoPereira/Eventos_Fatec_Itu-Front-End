export type CourseProps = {
    id: number;
    name: string | "all";
    createdAt: string;
    updatedAt: string;
};

export type CreateCourseDto = {
    name: string;
};

export type UpdateCourseDto = {
    name?: string;
};

export type CoursePublicResponse = {
    id: number;
    name?: string;
}