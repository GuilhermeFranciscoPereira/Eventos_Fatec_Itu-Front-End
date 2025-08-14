'use client';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';
import { useParams } from 'next/navigation';
import CardEvents from '@/components/CardEvents';
import { useRef, forwardRef, useState } from 'react';
import { Course, Semester } from '@/@Types/EventTypes';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useModalStore } from '@/stores/useModalStore';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputDefault from '@/components/Inputs/InputDefault';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import { CreateParticipantDto } from '@/@Types/ParticipantsTypes';
import { useGetEventById } from '@/hooks/api/Events/Get/useGetEventById';
import styles from '@/app/(pages)/(public)/EventDetail/[id]/EventDetail.module.css';
import { useCreateParticipant } from '@/hooks/api/Participants/Post/useCreateParticipant';
import { MdAssignmentAdd, MdPerson, MdEvent, MdLocationOn, MdDescription } from 'react-icons/md';

type SubscriptionFormProps = {
    nameRef: React.RefObject<HTMLInputElement | null>;
    emailRef: React.RefObject<HTMLInputElement | null>;
    courseRef: React.RefObject<HTMLSelectElement | null>;
    semesterRef: React.RefObject<HTMLSelectElement | null>;
    raRef: React.RefObject<HTMLInputElement | null>;
    courseOptions: Course[];
    semesterOptions: Semester[];
    onlyStudents: boolean;
};

export default function EventDetail(): React.ReactElement {
    const { id } = useParams() as { id: string };
    const eventId = Number(id);
    const createParticipant = useCreateParticipant();
    const openModal = useModalStore(s => s.openModal);
    const { event, loading } = useGetEventById(eventId);

    const raRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const courseRef = useRef<HTMLSelectElement>(null);
    const semesterRef = useRef<HTMLSelectElement>(null);

    const courseOptions: Course[] = ['ADS', 'GE', 'GTI', 'GEMP', 'MEC'];
    const semesterOptions: Semester[] = ['SEMESTER1', 'SEMESTER2', 'SEMESTER3', 'SEMESTER4', 'SEMESTER5', 'SEMESTER6', 'ESPECIAL'];

    if (loading) return <Loader />;
    if (!event) return <h1>Evento não encontrado!</h1>;

    return (
        <>
            <main className={styles.eventDetailPage}>
                <div className={styles.detailPageInfo}>
                    <div className={styles.detailPageHeader}>
                        <ImageCloudinary
                            src={event.imageUrl}
                            alt={event.name}
                            sizes="(max-width: 1024px) 100vw, 1200px"
                            priority
                        />
                    </div>
                    <h1 className={styles.title}>{event.name}</h1>
                    <div className={styles.infoItem}>
                        <MdPerson size={20} className={styles.icon} />
                        <strong className={styles.label}>Palestrante:</strong>
                        <p className={styles.infoText}>{event.speakerName}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <MdEvent size={20} className={styles.icon} />
                        <strong className={styles.label}>Data:</strong>
                        <p className={styles.infoText}>
                            {new Date(event.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} – {' '}
                            {[event.startTime, event.endTime].map(t => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })).join(' - ')}
                        </p>
                    </div>
                    <div className={styles.infoItem}>
                        <MdLocationOn size={20} className={styles.icon} />
                        <strong className={styles.label}>Local:</strong>
                        <p className={styles.infoText}>
                            {event.location === 'OUTROS' ? event.customLocation : event.location.replace(/_/g, ' ')}
                        </p>
                    </div>
                    <div className={styles.infoItem}>
                        <MdDescription size={20} className={styles.icon} />
                        <strong className={styles.label}>Descrição:</strong>
                        <p className={styles.infoText}>{event.description}</p>
                    </div>
                    <div className={styles.subscribe}>
                        <ButtonRay text="Se inscrever" onClick={handleSubscribe} type='button' />
                    </div>
                </div>
                <h2 className={styles.otherEventsH2}>Outros eventos que podem te interessar:</h2>
                <div className={styles.cardContainer}>
                    <CardEvents />
                </div>
            </main>
            <Footer />
        </>
    );

    function handleSubscribe(): void {
        openModal({
            title: 'Se inscreva no evento!',
            icon: <MdAssignmentAdd size={32} className={styles.icon} />,
            message: (
                <SubscriptionForm
                    nameRef={nameRef}
                    emailRef={emailRef}
                    courseRef={courseRef}
                    semesterRef={semesterRef}
                    raRef={raRef}
                    courseOptions={courseOptions}
                    semesterOptions={semesterOptions}
                    ref={null}
                    onlyStudents={event?.isRestricted ? event?.isRestricted : false}
                />
            ),
            confirmLabel: 'Confirmar inscrição',
            onConfirm: async () => {
                const dto: CreateParticipantDto = {
                    name: nameRef.current!.value.trim(),
                    email: emailRef.current!.value.trim(),
                    eventId,
                    course: courseRef.current ? (courseRef.current.value as Course) : null,
                    semester: semesterRef.current ? (semesterRef.current.value as Semester) : null,
                    ra: raRef.current ? raRef.current.value.trim() : null,
                };

                await createParticipant(dto);
            },
        });
    }
}

const SubscriptionForm = forwardRef<HTMLFormElement, SubscriptionFormProps>(({ nameRef, emailRef, courseRef, semesterRef, raRef, courseOptions, semesterOptions, onlyStudents }, ref) => {
    const [isStudent, setIsStudent] = useState(onlyStudents);
    return (
        <form ref={ref} className={styles.form}>
            <div className={styles.checkboxGroup}>
                {!onlyStudents &&
                    <InputCheckbox
                        checked={isStudent}
                        label="Sou aluno"
                        onChange={() => setIsStudent(!isStudent)}
                    />
                }
            </div>
            <InputDefault ref={nameRef} label="Nome completo" required />
            <InputDefault ref={emailRef} label={isStudent ? "E-mail institucional" : "E-mail"} type="email" required />
            {isStudent && (
                <>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="course">Curso</label>
                        <select id="course" ref={courseRef} className={styles.select}>
                            <option value="">Selecione</option>
                            {Object.values(courseOptions).map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="semester">Semestre</label>
                        <select id="semester" ref={semesterRef} className={styles.select}>
                            <option value="">Selecione</option>
                            {Object.values(semesterOptions).map(s => (<option key={s} value={s}>{s.replace('SEMESTER', '')}º</option>))}
                        </select>
                    </div>
                    <InputDefault ref={raRef} label="RA" minLength={13} maxLength={13} />
                </>
            )}
        </form>
    );
});

SubscriptionForm.displayName = 'SubscriptionForm';
