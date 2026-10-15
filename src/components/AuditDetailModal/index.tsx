'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { TbAlertTriangleFilled } from 'react-icons/tb';
import type { AuditChange, AuditLogDetail } from '@/@Types/AuditTypes';
import styles from '@/components/AuditDetailModal/AuditDetailModal.module.css';
import { actionLabel, fieldLabel, formatAuditValue, formatBrasiliaDateTime, isPlainObject, OUTCOME_LABELS, resourceLabel, roleLabel } from '@/utils/auditLabels';

type AuditDetailModalProps = {
    open: boolean;
    loading: boolean;
    log: AuditLogDetail | null;
    error: string | null;
    onClose: () => void;
};

function InfoItem({ label, value, wide = false }: { label: string; value: React.ReactNode; wide?: boolean }): React.ReactElement {
    return (
        <div className={`${styles.infoItem} ${wide ? styles.infoItemWide : ''}`}>
            <dt>{label}</dt>
            <dd>{value}</dd>
        </div>
    );
}

function DataList({ data }: { data: Record<string, unknown> }): React.ReactElement {
    return (
        <dl className={styles.dataList}>
            {Object.entries(data).map(([key, value]) => (
                <InfoItem key={key} label={fieldLabel(key)} value={formatAuditValue(key, value)} />
            ))}
        </dl>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
    return (
        <details className={styles.section} open>
            <summary>{title}</summary>
            <div className={styles.sectionBody}>{children}</div>
        </details>
    );
}

function ChangesTable({ changes }: { changes: AuditChange[] }): React.ReactElement {
    return (
        <div className={styles.changesWrapper}>
            <table className={styles.changesTable}>
                <thead>
                    <tr>
                        <th scope="col">Campo</th>
                        <th scope="col">Antes</th>
                        <th scope="col">Depois</th>
                    </tr>
                </thead>
                <tbody>
                    {changes.map(change => (
                        <tr key={change.field}>
                            <th scope="row">{fieldLabel(change.field)}</th>
                            <td>{change.sensitive ? 'Oculto por segurança' : formatAuditValue(change.field, change.before)}</td>
                            <td>{change.sensitive ? 'Alterado (valor oculto por segurança)' : formatAuditValue(change.field, change.after)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ResponseContent({ response }: { response: unknown }): React.ReactElement {
    if (isPlainObject(response)) return <DataList data={response} />;
    return <p className={styles.plainValue}>{formatAuditValue('response', response)}</p>;
}

function hasContent(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (isPlainObject(value)) return Object.keys(value).length > 0;
    return true;
}

export default function AuditDetailModal({ open, loading, log, error, onClose }: AuditDetailModalProps): React.ReactElement | null {
    const closeRef = useRef<HTMLButtonElement>(null);
    const previousFocus = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return;
        previousFocus.current = document.activeElement as HTMLElement | null;
        closeRef.current?.focus();
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function onKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = originalOverflow;
            previousFocus.current?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

    const resultTone = log ? styles[`outcome${log.outcome}`] : '';

    return createPortal(
        <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="audit-detail-title">
                <header className={styles.dialogHeader}>
                    <div>
                        <p className={styles.recordNumber}>{log ? `Registro #${log.id}` : 'Registro de auditoria'}</p>
                        <h2 id="audit-detail-title">Detalhes da auditoria</h2>
                        {log && (
                            <p className={styles.actionChip}>{actionLabel(log.action)} · {resourceLabel(log.resource)}</p>
                        )}
                    </div>
                    <button ref={closeRef} type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar detalhes">
                        <IoClose aria-hidden />
                    </button>
                </header>

                <div className={styles.dialogBody}>
                    {loading && (
                        <p className={styles.loading} role="status"><span className={styles.spinner} aria-hidden /> Carregando detalhes...</p>
                    )}

                    {error && (
                        <p className={styles.error} role="alert"><TbAlertTriangleFilled aria-hidden /> {error}</p>
                    )}

                    {log && (
                        <>
                            <p className={styles.summary}>{log.summary}</p>

                            <dl className={styles.infoGrid}>
                                <InfoItem label="Responsável na ocasião" value={log.actorName ?? 'Visitante (sem login)'} />
                                <InfoItem label="E-mail do responsável" value={log.actorEmail ?? 'Não informado'} />
                                <InfoItem label="Perfil na ocasião" value={log.actorId ? roleLabel(log.actorRole) : 'Sem perfil (acesso público)'} />
                                <InfoItem label="Identificador do responsável" value={log.actorId ?? 'Não informado'} />
                                <InfoItem label="Data e hora (Brasília)" value={formatBrasiliaDateTime(log.createdAt)} />
                                <InfoItem label="Área do sistema" value={resourceLabel(log.resource)} />
                                <InfoItem
                                    label="Registro afetado"
                                    value={log.targetLabel || log.targetId ? `${log.targetLabel ?? 'Registro'}${log.targetId ? ` (ID: ${log.targetId})` : ''}` : 'Não se aplica'}
                                />
                                <InfoItem
                                    label="Resultado"
                                    value={<span className={`${styles.outcome} ${resultTone}`}>{OUTCOME_LABELS[log.outcome]} · HTTP {log.statusCode}</span>}
                                />
                                {log.errorMessage && <InfoItem label="Motivo informado" value={log.errorMessage} wide />}
                                <InfoItem label="Operação" value={`${log.method} ${log.path}`} wide />
                                <InfoItem label="Endereço IP" value={log.ip ?? 'Não informado'} />
                                <InfoItem label="Navegador / dispositivo" value={log.userAgent ?? 'Não informado'} />
                            </dl>

                            <p className={styles.notice}>
                                Visível somente para administradores. Senhas, códigos, tokens e palavras secretas nunca são armazenados na auditoria.
                            </p>

                            {log.changes && log.changes.length > 0 && (
                                <Section title="O que mudou">
                                    <ChangesTable changes={log.changes} />
                                </Section>
                            )}

                            {hasContent(log.before) && (
                                <Section title="Todos os dados anteriores">
                                    <DataList data={log.before as Record<string, unknown>} />
                                </Section>
                            )}

                            {hasContent(log.after) && (
                                <Section title="Todos os dados posteriores">
                                    <DataList data={log.after as Record<string, unknown>} />
                                </Section>
                            )}

                            {hasContent(log.requestBody) && (
                                <Section title="Dados enviados na operação">
                                    <DataList data={log.requestBody as Record<string, unknown>} />
                                </Section>
                            )}

                            {hasContent(log.response) && (
                                <Section title="Resposta da operação">
                                    <ResponseContent response={log.response} />
                                </Section>
                            )}

                            {hasContent(log.details) && (
                                <Section title="Informações adicionais">
                                    <DataList data={log.details as Record<string, unknown>} />
                                </Section>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>,
        document.body
    );
}
