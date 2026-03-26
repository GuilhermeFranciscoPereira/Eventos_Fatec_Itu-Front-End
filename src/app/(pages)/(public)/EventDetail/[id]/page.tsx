'use client';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';
import { useParams } from 'next/navigation';
import CardEvents from '@/components/CardEvents';
import type { Semester } from '@/@Types/EventTypes';
import { useRef, forwardRef, useState } from 'react';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useModalStore } from '@/stores/useModalStore';
import InputField from '@/components/Inputs/InputField';
import InputSelect from '@/components/Inputs/InputSelect';
import ImageCloudinary from '@/components/ImageCloudinary';
import { CoursePublicResponse } from '@/@Types/CoursesTypes';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import { CreateParticipantDto } from '@/@Types/ParticipantsTypes';
import { useGetEventById } from '@/hooks/api/Events/Get/useGetEventById';
import { useGetAllCoursesPublic } from '@/hooks/api/Courses/Get/useGetAllCourses';
import styles from '@/app/(pages)/(public)/EventDetail/[id]/EventDetail.module.css';
import { useCreateParticipant } from '@/hooks/api/Participants/Post/useCreateParticipant';
import { MdAssignmentAdd, MdPerson, MdEvent, MdLocationOn, MdDescription, MdSchool, MdLock, MdMenuBook } from 'react-icons/md';

type SubscriptionFormProps = {
    nameRef: React.RefObject<HTMLInputElement | null>;
    emailRef: React.RefObject<HTMLInputElement | null>;
    courseValue: string;
    semesterValue: string;
    onCourseChange: (value: string) => void;
    onSemesterChange: (value: string) => void;
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

    const semesterOptions: Semester[] = ['SEMESTER1', 'SEMESTER2', 'SEMESTER3', 'SEMESTER4', 'SEMESTER5', 'SEMESTER6', 'ESPECIAL'];

    if (loading) return <Loader />;
    if (!event) return <h1>Evento não encontrado!</h1>;

    const courseName = !event.courseId ? 'Todos os cursos' : (event.courseName ?? publicCourses.find(c => c.id === event.courseId)?.name ?? 'Carregando...');
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
                            {[event.startTime, event.endTime].map(t => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })).join(' às ')}
                        </p>
                    </div>
                    <div className={styles.infoItem}>
                        <MdLocationOn size={20} className={styles.icon} />
                        <strong className={styles.label}>Local:</strong>
                        <p className={styles.infoText}>
                            {event.locationName.toLowerCase() === 'outros'
                                ? event.customLocation
                                : event.locationName}
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
        let selectedCourse = '';
        let selectedSemester = '';

        openModal({
            title: 'Se inscreva no evento!',
            icon: <MdAssignmentAdd size={32} className={styles.icon} />,
            message: (
                <SubscriptionForm
                    nameRef={nameRef}
                    emailRef={emailRef}
                    raRef={raRef}
                    courseOptions={publicCourses}
                    coursesLoading={coursesLoading}
                    semesterOptions={semesterOptions}
                    ref={null}
                    onlyStudents={event?.isRestricted ? event?.isRestricted : false}
                    courseValue={selectedCourse}
                    semesterValue={selectedSemester}
                    onCourseChange={(value) => {
                        selectedCourse = value;
                    }}
                    onSemesterChange={(value) => {
                        selectedSemester = value;
                    }}
                />
            ),
            confirmLabel: 'Confirmar inscrição',
            onConfirm: async () => {
                const dto: CreateParticipantDto = {
                    name: nameRef.current!.value.trim(),
                    email: emailRef.current!.value.trim(),
                    eventId,
                    courseId: selectedCourse ? Number(selectedCourse) : undefined,
                    semester: selectedSemester ? (selectedSemester as Semester) : null,
                    ra: raRef.current && raRef.current.value ? raRef.current.value.trim() : null,
                };
                await createParticipant(dto);
            },
        });
    }
}

const SubscriptionForm = forwardRef<HTMLFormElement, SubscriptionFormProps>(({ nameRef, emailRef, raRef, courseOptions, coursesLoading, semesterOptions, onlyStudents, courseValue, semesterValue, onCourseChange, onSemesterChange }, ref) => {
    const [isStudent, setIsStudent] = useState(onlyStudents)
    const [selectedCourse, setSelectedCourse] = useState<string>(courseValue);
    const [selectedSemester, setSelectedSemester] = useState<string>(semesterValue);

    return (
        <form ref={ref} className={styles.form}>
            <div className={styles.checkboxGroup}>
                {!onlyStudents &&
                    <InputCheckbox
                        checked={isStudent}
                        label="Sou aluno"
                        onChange={() => {
                            const nextValue = !isStudent;
                            setIsStudent(nextValue);

                            if (!nextValue) {
                                setSelectedCourse('');
                                setSelectedSemester('');
                                onCourseChange('');
                                onSemesterChange('');
                            }
                        }}
                    />
                }
            </div>
            <InputField ref={nameRef} label="Nome completo" required autoFocus />
            <InputField ref={emailRef} label={isStudent ? 'E-mail institucional' : 'E-mail'} type="email" required />
            {isStudent && (
                <>
                    <div className={styles.fieldGroup}>
                        <InputSelect
                            label="Curso"
                            value={selectedCourse}
                            onChange={(value) => {
                                setSelectedCourse(value);
                                onCourseChange(value);
                            }}
                            disabled={coursesLoading}
                            options={[
                                {
                                    label: coursesLoading ? 'Carregando...' : (courseOptions.length ? 'Selecione' : 'Nenhum curso encontrado'),
                                    value: '',
                                },
                                ...courseOptions
                                    .filter((course) => course.name)
                                    .map((course) => ({
                                        label: course.name as string,
                                        value: String(course.id),
                                    })),
                            ]}
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <InputSelect
                            label="Semestre"
                            value={selectedSemester}
                            onChange={(value) => {
                                setSelectedSemester(value);
                                onSemesterChange(value);
                            }}
                            options={[
                                { label: 'Selecione', value: '' },
                                ...semesterOptions.map((value) => ({
                                    label: value === 'ESPECIAL' ? 'Especial' : `${value.replace('SEMESTER', '')}º`,
                                    value,
                                })),
                            ]}
                        />
                    </div>
                    <InputField ref={raRef} label="RA" minLength={13} maxLength={13} />
                </>
            )}
        </form>
    )
}
)

SubscriptionForm.displayName = 'SubscriptionForm'