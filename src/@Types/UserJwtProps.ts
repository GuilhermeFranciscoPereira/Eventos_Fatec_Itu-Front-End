export type UserJwtProps = {
    sub: number;
    name: string;
    imageUrl: string;
    email: string;
    role: 'ADMIN' | 'COORDENADOR' | 'AUXILIAR';
    exp: string | null;
    iat: string | null;
}

export type UserRoleTypes = UserJwtProps['role'];
