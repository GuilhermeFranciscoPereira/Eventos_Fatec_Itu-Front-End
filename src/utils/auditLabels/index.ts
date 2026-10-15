import type { AuditOutcome } from '@/@Types/AuditTypes';

export const PROTECTED_VALUE = '[PROTEGIDO]';

export const ACTION_LABELS: Record<string, string> = {
    CREATE: 'Criação',
    UPDATE: 'Edição',
    DELETE: 'Exclusão',
    VIEW: 'Visualização',
    LOGIN_REQUEST: 'Validação de senha',
    LOGIN: 'Login',
    LOGOUT: 'Logout',
    PASSWORD_RESET_REQUEST: 'Pedido de redefinição de senha',
    PASSWORD_RESET: 'Redefinição de senha',
    ACCESS_DENIED: 'Acesso negado',
};

export const RESOURCE_LABELS: Record<string, string> = {
    auth: 'Autenticação',
    users: 'Usuários',
    profile: 'Perfil',
    events: 'Eventos',
    participants: 'Participantes',
    carousel: 'Carrossel',
    categories: 'Categorias',
    courses: 'Cursos',
    locations: 'Locais',
    other: 'Outros',
};

export const OUTCOME_LABELS: Record<AuditOutcome, string> = {
    SUCCESS: 'Sucesso',
    ERROR: 'Erro',
    DENIED: 'Recusado',
};

export const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrador',
    COORDENADOR: 'Coordenador',
    AUXILIAR: 'Auxiliar docente',
};

const SEMESTER_LABELS: Record<string, string> = {
    ALL: 'Todos os semestres',
    SEMESTER1: '1º semestre',
    SEMESTER2: '2º semestre',
    SEMESTER3: '3º semestre',
    SEMESTER4: '4º semestre',
    SEMESTER5: '5º semestre',
    SEMESTER6: '6º semestre',
    ESPECIAL: 'Especial',
};

const FIELD_LABELS: Record<string, string> = {
    id: 'Identificador',
    name: 'Nome',
    email: 'E-mail',
    role: 'Perfil',
    imageUrl: 'Imagem',
    createdAt: 'Criado em',
    updatedAt: 'Atualizado em',
    description: 'Descrição',
    semester: 'Semestre',
    maxParticipants: 'Máximo de participantes',
    currentParticipants: 'Inscritos',
    isRestricted: 'Restrito a alunos da Fatec',
    locationId: 'Identificador do local',
    location: 'Local',
    locationName: 'Local',
    customLocation: 'Local informado',
    speakerName: 'Palestrante',
    startDate: 'Data de início',
    endDate: 'Data de término',
    startTime: 'Início',
    endTime: 'Término',
    duration: 'Duração (minutos)',
    presenceSecret: 'Palavra secreta de presença',
    categoryId: 'Identificador da categoria',
    category: 'Categoria',
    courses: 'Cursos',
    courseId: 'Identificador do curso',
    courseIds: 'Cursos selecionados',
    courseName: 'Curso',
    courseNames: 'Cursos',
    course: 'Curso',
    ra: 'RA',
    isPresent: 'Presente',
    certificateSent: 'Certificado enviado',
    eventId: 'Identificador do evento',
    event: 'Evento',
    isActive: 'Ativo',
    order: 'Ordem de exibição',
    password: 'Senha',
    newPassword: 'Nova senha',
    code: 'Código',
    photo: 'Foto',
    image: 'Imagem',
    uploadedFile: 'Arquivo enviado',
    size: 'Tamanho',
    type: 'Tipo',
    message: 'Mensagem',
    requires2FA: 'Código 2FA enviado',
    accountFound: 'Conta encontrada para o e-mail',
    optimizedImage: 'Imagem pesada otimizada automaticamente',
    originalSize: 'Tamanho original',
    finalSize: 'Tamanho final',
    format: 'Formato',
    maxDimension: 'Dimensão máxima',
    requiredRoles: 'Perfis com acesso',
    userRole: 'Perfil de quem tentou',
    totalItems: 'Itens exibidos',
    omitted: 'Conteúdo omitido',
};

// Event dates are saved as the college wall-clock marked as UTC (19:00 in Itu is 19:00Z), so they are read in UTC.
const EVENT_CLOCK_FIELDS = new Set(['startDate', 'endDate']);
const EVENT_TIME_FIELDS = new Set(['startTime', 'endTime']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

const brasiliaDateTime = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'America/Sao_Paulo',
});
const eventDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
const eventDateTime = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
});

export function formatBrasiliaDateTime(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? iso : brasiliaDateTime.format(date);
}

export function fieldLabel(field: string): string {
    return FIELD_LABELS[field] ?? `Informação adicional (${field})`;
}

export function actionLabel(action: string): string {
    return ACTION_LABELS[action] ?? action;
}

export function resourceLabel(resource: string): string {
    return RESOURCE_LABELS[resource] ?? resource;
}

export function roleLabel(role: string | null | undefined): string {
    if (!role) return 'Não informado';
    return ROLE_LABELS[role] ?? role;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Turns any stored value into text an administrator can read without knowing the database.
export function formatAuditValue(field: string, value: unknown): string {
    if (value === null || value === undefined || value === '') return 'Não informado';
    if (value === PROTECTED_VALUE) return 'Oculto por segurança';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (typeof value === 'number') return value.toLocaleString('pt-BR');

    if (typeof value === 'string') {
        if (ISO_DATE.test(value)) {
            const date = new Date(value);
            if (EVENT_CLOCK_FIELDS.has(field)) return eventDate.format(date);
            if (EVENT_TIME_FIELDS.has(field)) return eventDateTime.format(date);
            return brasiliaDateTime.format(date);
        }
        // Forms with images are sent as multipart, so their booleans arrive as text.
        if (value === 'true') return 'Sim';
        if (value === 'false') return 'Não';
        if (field === 'role' || field === 'userRole') return roleLabel(value);
        if (field === 'semester') return SEMESTER_LABELS[value] ?? value;
        return value;
    }

    if (Array.isArray(value)) {
        if (!value.length) return 'Nenhum';
        return value.map(item => formatAuditValue(field === 'requiredRoles' ? 'role' : field, item)).join(', ');
    }

    if (isPlainObject(value)) {
        return Object.entries(value)
            .map(([key, item]) => `${fieldLabel(key)}: ${formatAuditValue(key, item)}`)
            .join(' · ');
    }

    return String(value);
}
