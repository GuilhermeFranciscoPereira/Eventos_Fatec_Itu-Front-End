'use client';
import { useParams } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import Button from '@/components/Buttons/Button';
import styles from '@/app/(pages)/(public)/Verification/[token]/Verification.module.css';
import { useGetVerifyCertificate } from '@/hooks/api/Certificate/Get/useGetVerifyCertificate';
import { MdAccessTime, MdCancel, MdEvent, MdEventNote, MdLocationOn, MdMenuBook, MdPerson, MdVerified, MdWorkspacePremium } from 'react-icons/md';

export default function Verification(): React.ReactElement {
    const { token } = useParams() as { token: string };
    const { data, loading } = useGetVerifyCertificate(token);

    if (loading) {
        return (
            <main className={styles.page}>
                <section className={styles.card} aria-busy="true">
                    <span className={styles.spinner} aria-hidden />
                    <h1 className={styles.title}>Validando certificado...</h1>
                    <p className={styles.subtitle}>Conferindo a autenticidade do código informado.</p>
                </section>
            </main>
        );
    }

    if (!data) {
        return (
            <main className={styles.page}>
                <section className={`${styles.card} ${styles.invalid}`}>
                    <span className={styles.statusIcon} aria-hidden><MdCancel /></span>
                    <h1 className={styles.title}>Certificado inválido</h1>
                    <p className={styles.subtitle}>Não foi possível validar este certificado. Confira se o link ou o QR Code está completo.</p>
                    <Button href="/" variant="secondary" icon={<IoArrowBack />}>Voltar para a agenda</Button>
                </section>
            </main>
        );
    }

    const items = [
        { label: 'Evento', value: data.evento, Icon: MdEventNote },
        { label: 'Palestrante', value: data.palestrante, Icon: MdPerson },
        { label: 'Data', value: data.data, Icon: MdEvent },
        { label: 'Horário', value: data.horario, Icon: MdAccessTime },
        { label: 'Local', value: data.local, Icon: MdLocationOn },
        ...(data.curso ? [{ label: 'Curso', value: data.curso, Icon: MdMenuBook }] : []),
        { label: 'Emitido em', value: new Date(data.emitidoEm).toLocaleDateString('pt-BR'), Icon: MdWorkspacePremium },
    ];

    return (
        <main className={styles.page}>
            <section className={`${styles.card} ${styles.valid}`}>
                <span className={styles.statusIcon} aria-hidden><MdVerified /></span>
                <h1 className={styles.title}>Certificado válido!</h1>
                <p className={styles.subtitle}>Este certificado pertence a <strong>{data.aluno}</strong>.</p>

                <div className={styles.cardsSection}>
                    {items.map(({ label, value, Icon }, index) => (
                        <div key={label} className={styles.item} style={{ '--item-index': index } as React.CSSProperties}>
                            <span className={styles.itemIcon} aria-hidden><Icon /></span>
                            <div>
                                <span className={styles.spanLabel}>{label}</span>
                                <span className={styles.spanText}>{value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
