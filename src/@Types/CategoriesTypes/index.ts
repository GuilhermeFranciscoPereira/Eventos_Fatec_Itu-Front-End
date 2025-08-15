export type CategoryProps = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateCategoryDto = {
    name: string;
};

export type UpdateCategoryDto = {
    name?: string;
};

export type CategoryPublicResponse = {
    id: number;
    name?: string;
}