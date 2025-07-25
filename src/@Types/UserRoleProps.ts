export type UserRoleProps = {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'COORDENADOR' | 'AUXILIAR';
    accessTokenExpiresAt: string | null;
    refreshTokenExpiresAt: string | null;
}

export type UserRoleTypes = UserRoleProps['role'];