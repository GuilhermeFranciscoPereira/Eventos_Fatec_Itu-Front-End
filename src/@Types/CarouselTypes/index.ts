export type CarouselProps = {
    id: number;
    name: string;
    imageUrl: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export type CreateCarouselDto = {
    name: string;
    isActive: boolean;
    order: number;
    image: File;
}

export type UpdateCarouselDto = {
    name?: string;
    isActive?: boolean;
    order?: number;
    image?: File;
}
