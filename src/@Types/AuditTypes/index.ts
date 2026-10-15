import type { UserRoleTypes } from '../UserJwtProps';

export type AuditOutcome = 'SUCCESS' | 'ERROR' | 'DENIED';

export type AuditLogSummary = {
    id: number;
    createdAt: string;
    actorId: number | null;
    actorName: string | null;
    actorEmail: string | null;
    actorRole: UserRoleTypes | null;
    action: string;
    resource: string;
    summary: string;
    targetId: string | null;
    targetLabel: string | null;
    outcome: AuditOutcome;
    statusCode: number;
};

export type AuditChange = {
    field: string;
    before: unknown;
    after: unknown;
    sensitive?: boolean;
};

export type AuditLogDetail = AuditLogSummary & {
    method: string;
    path: string;
    ip: string | null;
    userAgent: string | null;
    errorMessage: string | null;
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
    changes: AuditChange[] | null;
    requestBody: Record<string, unknown> | null;
    response: unknown;
    details: Record<string, unknown> | null;
};

export type AuditLogPage = {
    items: AuditLogSummary[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export type AuditFilters = {
    search: string;
    outcome: '' | AuditOutcome;
    resource: string;
    from: string;
    to: string;
};
