export type UserJwtProps = {
    sub: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'COORDENADOR' | 'AUXILIAR';
    exp: string | null;
    iat: string | null;
}

export type UserRoleTypes = UserJwtProps['role'];
