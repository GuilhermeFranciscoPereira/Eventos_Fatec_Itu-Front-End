import type { IconType } from 'react-icons';
import { FaBook, FaHome, FaLayerGroup, FaUserEdit } from 'react-icons/fa';
import { GiKnightBanner, GiPartyPopper } from 'react-icons/gi';
import { UserRoleTypes } from '@/@Types/UserJwtProps';

export type NavRole = UserRoleTypes[] | 'all';

export type NavItem = {
    label: string;
    href?: string;
    externalHref?: string;
    blank?: boolean;
    Icon?: IconType;
    role: NavRole;
    children?: NavItem[];
};

export const navigationItems: readonly NavItem[] = [
    {
        label: 'Tela inicial',
        href: '/',
        Icon: FaHome,
        role: 'all'
    },
    {
        label: 'Carrossel',
        href: '/Carousel',
        Icon: GiKnightBanner,
        role: ['ADMIN', 'COORDENADOR']
    },
    {
        label: 'Categorias',
        href: '/Categories',
        Icon: FaLayerGroup,
        role: ['ADMIN', 'COORDENADOR']
    },
    {
        label: 'Cursos',
        href: '/Courses',
        Icon: FaBook,
        role: ['ADMIN', 'COORDENADOR']
    },
    {
        label: 'Eventos',
        href: '/Events',
        Icon: GiPartyPopper,
        role: ['ADMIN', 'COORDENADOR', 'AUXILIAR']
    },
    {
        label: 'Usuários',
        href: '/Users',
        Icon: FaUserEdit,
        role: ['ADMIN']
    },
    {
        label: 'Área do aluno',
        role: 'all',
        children: [
            {
                label: 'E-mail institucional',
                externalHref: 'https://cgtic.cps.sp.gov.br/parceria-educacional/',
                blank: true,
                role: 'all'
            },
            {
                label: 'Calendário acadêmico',
                externalHref: 'https://fatecitu.cps.sp.gov.br/academico/calendario-academico/',
                blank: true,
                role: 'all'
            },
            {
                label: 'Horários',
                role: 'all',
                children: [
                    {
                        label: 'Horários das aulas',
                        externalHref: 'https://fatecitu.cps.sp.gov.br/academico/horario-das-aulas/',
                        blank: true,
                        role: 'all'
                    },
                    {
                        label: 'Horários da biblioteca',
                        externalHref: 'https://fatecitu.cps.sp.gov.br/academico/biblioteca/',
                        blank: true,
                        role: 'all'
                    },
                    {
                        label: 'Horários coordenadores',
                        externalHref: 'https://fatecitu.cps.sp.gov.br/horarios-coordenadores/',
                        blank: true,
                        role: 'all'
                    },
                    {
                        label: 'Horários monitorias',
                        externalHref: 'https://fatecitu.cps.sp.gov.br/horario-monitoria/',
                        blank: true,
                        role: 'all'
                    },
                    {
                        label: 'Horários secretária',
                        externalHref: 'https://fatecitu.cps.sp.gov.br/academico/secretaria/',
                        blank: true,
                        role: 'all'
                    }
                ]
            },
            {
                label: 'Regras de TG',
                externalHref: 'https://fatecitu.cps.sp.gov.br/regras-de-tg/',
                blank: true,
                role: 'all'
            },
            {
                label: 'Solicitação de documentos',
                externalHref: 'https://fatecitu.cps.sp.gov.br/solicitacao-de-documentos/',
                blank: true,
                role: 'all'
            }
        ]
    },
    {
        label: 'Institucional',
        role: 'all',
        children: [
            {
                label: 'Fatec Itu',
                externalHref: 'https://fatecitu.cps.sp.gov.br/',
                blank: true,
                role: 'all'
            },
            {
                label: 'Siga',
                externalHref: 'https://siga.cps.sp.gov.br/sigaaluno/applogin.aspx',
                blank: true,
                role: 'all'
            },
            {
                label: 'Estágios',
                externalHref: 'https://fatecitu.cps.sp.gov.br/academico/estagios/',
                blank: true,
                role: 'all'
            },
            {
                label: 'CPS Carreiras',
                externalHref: 'https://fatecitu.cps.sp.gov.br/cps-carreiras/',
                blank: true,
                role: 'all'
            }
        ]
    }
] as const;

export function hasAccess(role: UserRoleTypes | undefined, itemRole: NavRole): boolean {
    if (itemRole === 'all') {
        return true;
    }

    if (!role) {
        return false;
    }

    return itemRole.includes(role);
}

export function filterNavigationByRole(items: readonly NavItem[], role: UserRoleTypes | undefined): NavItem[] {
    return items
        .filter(item => hasAccess(role, item.role))
        .map(item => ({
            ...item,
            children: item.children ? filterNavigationByRole(item.children, role) : undefined
        }))
        .filter(item => !item.children || item.children.length > 0 || !!item.href || !!item.externalHref);
}

export function isItemActive(pathname: string, href?: string): boolean {
    if (!href) {
        return false;
    }

    return pathname === href || (href !== '/' && pathname.startsWith(href));
}

export function isTreeActive(pathname: string, item: NavItem): boolean {
    if (isItemActive(pathname, item.href)) {
        return true;
    }

    if (!item.children?.length) {
        return false;
    }

    return item.children.some(child => isTreeActive(pathname, child));
}