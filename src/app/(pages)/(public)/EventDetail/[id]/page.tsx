'use client';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';
import { useParams } from 'next/navigation';
import CardEvents from '@/components/CardEvents';
import type { Semester } from '@/@Types/EventTypes';
import { useRef, forwardRef, useState } from 'react';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useModalStore } from '@/stores/useModalStore';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputDefault from '@/components/Inputs/InputDefault';
import { CoursePublicResponse } from '@/@Types/CoursesTypes';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import { CreateParticipantDto } from '@/@Types/ParticipantsTypes';
import ButtonComebackUrl from '@/components/Buttons/ButtonComebackUrl';
import { useGetEventById } from '@/hooks/api/Events/Get/useGetEventById';
import { useGetAllCoursesPublic } from '@/hooks/api/Courses/Get/useGetAllCourses';
import styles from '@/app/(pages)/(public)/EventDetail/[id]/EventDetail.module.css';
import { useCreateParticipant } from '@/hooks/api/Participants/Post/useCreateParticipant';
import { MdAssignmentAdd, MdPerson, MdEvent, MdLocationOn, MdDescription, MdSchool, MdLock, MdMenuBook } from 'react-icons/md';

type SubscriptionFormProps = {
    nameRef: React.RefObject<HTMLInputElement | null>;
    emailRef: React.RefObject<HTMLInputElement | null>;
    courseRef: React.RefObject<HTMLSelectElement | null>;
    semesterRef: React.RefObject<HTMLSelectElement | null>;
    courseOptions: CoursePublicResponse[];
    coursesLoading: boolean;
    raRef: React.RefObject<HTMLInputElement | null>;
    semesterOptions: Semester[];
    onlyStudents: boolean;
};

export default function EventDetail(): React.ReactElement {
    const { id } = useParams() as { id: string };
    const eventId = Number(id);
    const createParticipant = useCreateParticipant();
    const openModal = useModalStore(s => s.openModal);
    const { event, loading } = useGetEventById(eventId);
    const { datas: publicCourses, loading: coursesLoading } = useGetAllCoursesPublic();

    const raRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const courseRef = useRef<HTMLSelectElement>(null);
    const semesterRef = useRef<HTMLSelectElement>(null);

    const semesterOptions: Semester[] = ['SEMESTER1', 'SEMESTER2', 'SEMESTER3', 'SEMESTER4', 'SEMESTER5', 'SEMESTER6', 'ESPECIAL'];

    if (loading) return <Loader />;
    if (!event) return <h1>Evento não encontrado!</h1>;

    const courseName = !event.courseId ? 'Todos os cursos' : (event.courseName ?? publicCourses.find(c => c.id === event.courseId)?.name ?? 'Carregando...');
    return (
        <>
            <main className={styles.eventDetailPage}>
                <div className={styles.buttonComeback}>
                    <ButtonComebackUrl />
                </div>
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
                        <MdLock size={20} className={styles.icon} />
                        <strong className={styles.label}>Evento restrito somente a alunos e colaboradores?</strong>
                        <p className={styles.infoText}>
                            {event.isRestricted
                                ? 'Sim! O Evento é restrito somente à alunos e colaboradores da Fatec Itu!'
                                : 'Não! O Evento é publico para todos: Alunos, colaboradores e pessoas de fora!'}
                        </p>
                    </div>

                    {event.isRestricted && (
                        <div className={styles.infoItem}>
                            <MdMenuBook size={20} className={styles.icon} />
                            <strong className={styles.label}>Curso:</strong>
                            <p className={styles.infoText}>
                                {event.courseId
                                    ? `Evento disponível somente para alunos do curso: ${courseName}`
                                    : 'Evento disponível para todos os cursos'}
                            </p>
                        </div>
                    )}

                    {event.isRestricted && (
                        <div className={styles.infoItem}>
                            <MdSchool size={20} className={styles.icon} />
                            <strong className={styles.label}>Semestre:</strong>
                            <p className={styles.infoText}>
                                {event.semester === 'ALL' || !event.semester
                                    ? 'Evento disponível para todos os semestres'
                                    : event.semester === 'ESPECIAL'
                                        ? 'Evento disponível somente para alunos em modelo especial'
                                        : `Evento disponível somente para o ${event.semester.replace('SEMESTER', '')}º semestre`}
                            </p>
                        </div>
                    )}

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
                            {event.location === 'OUTROS'
                                ? event.customLocation
                                : event.location.replace(/_/g, ' ').toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())}
                        </p>
                    </div>
                    <div className={styles.infoItem}>
                        <MdDescription size={20} className={styles.icon} />
                        <strong className={styles.label}>Descrição:</strong>
                        <p className={styles.infoText}>{event.description}</p>
                    </div>
                    <div className={styles.subscribe}>
                        <ButtonRay text="Se inscrever" onClick={handleSubscribe} type="button" />
                    </div>
                </div>
                <div className={styles.cardContainer}>
                    <CardEvents
                        categoryId={event.categoryId ?? null}
                        showFilters={false}
                        excludeId={event.id}
                    />
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
                    courseOptions={publicCourses}
                    coursesLoading={coursesLoading}
                    semesterOptions={semesterOptions}
                    ref={null}
                    onlyStudents={event?.isRestricted ? event?.isRestricted : false}
                />
            ),
            confirmLabel: 'Confirmar inscrição',
            onConfirm: async () => {
                const courseIdStr = courseRef.current?.value || ''
                const semesterStr = semesterRef.current?.value || ''
                const dto: CreateParticipantDto = {
                    name: nameRef.current!.value.trim(),
                    email: emailRef.current!.value.trim(),
                    eventId,
                    courseId: courseIdStr ? Number(courseIdStr) : undefined,
                    semester: semesterStr ? (semesterStr as Semester) : null,
                    ra: raRef.current && raRef.current.value ? raRef.current.value.trim() : null,
                }
                await createParticipant(dto)
            },
        });
    }
}

const SubscriptionForm = forwardRef<HTMLFormElement, SubscriptionFormProps>(({ nameRef, emailRef, courseRef, semesterRef, raRef, courseOptions, coursesLoading, semesterOptions, onlyStudents }, ref) => {
    const [isStudent, setIsStudent] = useState(onlyStudents)

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
            <InputDefault ref={emailRef} label={isStudent ? 'E-mail institucional' : 'E-mail'} type="email" required />
            {isStudent && (
                <>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="course">Curso</label>
                        <select
                            id="course"
                            ref={courseRef}
                            className={styles.select}
                            required={courseOptions.length > 0}
                            disabled={coursesLoading}
                        >
                            <option value="">
                                {coursesLoading ? 'Carregando...' : (courseOptions.length ? 'Selecione' : 'Nenhum curso encontrado')}
                            </option>
                            {!coursesLoading && courseOptions.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="semester">Semestre</label>
                        <select id="semester" ref={semesterRef} className={styles.select} required>
                            <option value="">Selecione</option>
                            {semesterOptions.map(v => (
                                <option key={v} value={v}>
                                    {v === 'ESPECIAL' ? 'Especial' : `${v.replace('SEMESTER', '')}º`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <InputDefault ref={raRef} label="RA" minLength={13} maxLength={13} />
                </>
            )}
        </form>
    )
}
)

SubscriptionForm.displayName = 'SubscriptionForm'