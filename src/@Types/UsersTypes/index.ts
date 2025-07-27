import { UserRoleTypes } from "../UserJwtProps";

export type UserProps = {
    id: number;
    name: string;
    email: string;
    role: UserRoleTypes;
    createdAt: string;
    updatedAt: string;
};

export type CreateUserDto = {
    name: string;
    email: string;
    password: string;
    role: UserRoleTypes | string | null;
};

export type UpdateUserDto = {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRoleTypes | string;
};
