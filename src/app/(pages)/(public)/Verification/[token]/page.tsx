'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from '@/app/(pages)/(public)/Verification/[token]/Verification.module.css';
import { useGetVerifyCertificate } from '@/hooks/api/Certificate/Get/useGetVerifyCertificate';

export default function Verification(): React.ReactElement {
    const { token } = useParams() as { token: string };
    const { data, loading } = useGetVerifyCertificate(token);

    if (loading) {
        return (
            <main className={styles.page}>
                <section className={styles.validSection}>
                    <h1 className={styles.validTitle}>Validando certificado...</h1>
                </section>
            </main>
        );
    }

    if (!data) {
        return (
            <main className={styles.page}>
                <section className={styles.invalidSection}>
                    <h1 className={styles.invalidTitle}>Certificado inválido</h1>
                    <p className={styles.invalidText}>Não foi possível validar este certificado.</p>
                    <Link href="/" className={styles.invalidText}>Voltar</Link>
                </section>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <section className={`${styles.validSection}`}>
                <h1 className={styles.validTitle}>Certificado Válido!</h1>
                <p className={styles.validSubtitle}>Este certificado pertence a <span>{data.aluno}.</span></p>

                <div className={styles.cardsSection}>
                    <div className={styles.card}>
                        <div>
                            <span className={styles.spanLabel}>Evento</span>
                            <span className={styles.spanText}>{data.evento}</span>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div>
                            <span className={styles.spanLabel}>Palestrante</span>
                            <span className={styles.spanText}>{data.palestrante}</span>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div>
                            <span className={styles.spanLabel}>Data</span>
                            <span className={styles.spanText}>{data.data}</span>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div>
                            <span className={styles.spanLabel}>Horário</span>
                            <span className={styles.spanText}>{data.horario}</span>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div>
                            <span className={styles.spanLabel}>Local</span>
                            <span className={styles.spanText}>{data.local}</span>
                        </div>
                    </div>

                    {data.curso && (
                        <div className={styles.card}>
                            <div>
                                <span className={styles.spanLabel}>Curso</span>
                                <span className={styles.spanText}>{data.curso}</span>
                            </div>
                        </div>
                    )}

                    <div className={styles.card}>
                        <div>
                            <span className={styles.spanLabel}>Emitido em</span>
                            <span className={styles.spanText}>
                                {new Date(data.emitidoEm).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
