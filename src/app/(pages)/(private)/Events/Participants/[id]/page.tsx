'use client';
import Loader from '@/components/Loader';
import { Table } from '@/components/Table';
import { useParams } from 'next/navigation';
import { TbFileTypePdf } from 'react-icons/tb';
import { printSection } from '@/utils/printSection';
import { ParticipantProps } from '@/@Types/ParticipantsTypes';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import { downloadSectionAsPdf } from '@/utils/downloadSectionAsPdf';
import ButtonComebackUrl from '@/components/Buttons/ButtonComebackUrl';
import { useEditParticipant } from '@/hooks/api/Participants/Patch/useEditParticipant';
import { useGetAllParticipants } from '@/hooks/api/Participants/Get/useGetAllParticipants';
import styles from '@/app/(pages)/(private)/Events/Participants/[id]/Participants.module.css';

export default function Participants(): React.ReactElement {
    const { id } = useParams();
    const updateParticipant = useEditParticipant();
    const { participants, loading, refetch } = useGetAllParticipants(Number(id));

    const schema = [
        { id: 'name', header: 'Nome', accessor: (p: ParticipantProps) => p.name },
        { id: 'email', header: 'Email', accessor: (p: ParticipantProps) => p.email },
        {
            id: 'ra',
            header: 'RA',
            accessor: (p: ParticipantProps) => p.ra ? p.ra : '-',
        },
        {
            id: 'createdAt',
            header: 'Inscrito em',
            accessor: (p: ParticipantProps) =>
                new Date(p.createdAt).toLocaleString('pt-BR').replace(',', ' - '),
        },
        {
            id: 'isPresent',
            header: 'Presença',
            accessor: () => null,
            cellRenderer: (p: ParticipantProps) => (
                <InputCheckbox
                    checked={p.isPresent}
                    onChange={async () => {
                        await updateParticipant(p.id, !p.isPresent);
                        refetch();
                    }}
                />
            ),
        },
    ];

    return (
        <main className={styles.participantsPage}>
            <ButtonComebackUrl />
            <header className={styles.participantsPageHeader}>
                <h1>Gerenciamento de Participantes</h1>
                <div className={styles.buttonsParticipantsPage}>
                    <button onClick={() => downloadSectionAsPdf('idParticipantsTable', `Lista_de_Presença`)}><TbFileTypePdf />Exportar por PDF</button>
                    <button onClick={() => printSection('idParticipantsTable')}><TbFileTypePdf />Imprimir</button>
                </div>
            </header>
            {loading && <Loader />}
            <div id='idParticipantsTable'>
                <Table<ParticipantProps>
                    records={participants}
                    schema={schema}
                    getIdentifier={(p) => p.id}
                    hiddenOnMobile={['email', 'createdAt', 'updatedAt']}
                />
            </div>
        </main>
    );
}
