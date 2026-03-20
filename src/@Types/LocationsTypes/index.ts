export type LocationProps = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateLocationDto = {
    name: string;
};

export type UpdateLocationDto = {
    name?: string;
};

export type LocationPublicResponse = {
    id: number;
    name: string;
};