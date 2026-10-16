'use client';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';
import { useParams } from 'next/navigation';
import { forwardRef, useState } from 'react';
import Button from '@/components/Buttons/Button';
import EmptyState from '@/components/EmptyState';
import CardEvents from '@/components/CardEvents';
import type { Semester } from '@/@Types/EventTypes';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useUserStore } from '@/stores/useUserStore';
import InputField from '@/components/Inputs/InputField';
import InputSelect from '@/components/Inputs/InputSelect';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import { IoArrowBack, IoChevronForward } from 'react-icons/io5';
import { getFatecRaError, normalizeFatecRa } from '@/utils/fatecRa';
import type { CreateParticipantDto } from '@/@Types/ParticipantsTypes';
import { useGetEventById } from '@/hooks/api/Events/Get/useGetEventById';
import styles from '@/app/(pages)/(public)/EventDetail/[id]/EventDetail.module.css';
import { useEventDetailPage } from '@/hooks/pages/(public)/EventDetail/id/useEventDetailPage';
import { useGetAllCategoriesPublic } from '@/hooks/api/Categories/Get/useGetAllCategories';
import type { SubscriptionFormProps } from '@/hooks/pages/(public)/EventDetail/id/useEventDetailPage';
import { MdAssignmentAdd, MdPerson, MdEvent, MdLocationOn, MdSchool, MdLock, MdLockOpen, MdMenuBook, MdAccessTime, MdGroups, MdEventBusy, MdMarkEmailRead } from 'react-icons/md';

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', timeZone: 'UTC' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

export default function EventDetailView(): React.ReactElement {
    const { createParticipant, openModal, publicCourses, coursesLoading, raRef, nameRef, emailRef, semesterOptions } = useEventDetailPage();

    const { id } = useParams() as { id: string };
    const eventId = Number(id);
    const { event, loading } = useGetEventById(eventId);
    const { datas: categories } = useGetAllCategoriesPublic();
    const user = useUserStore(s => s.user);

    if (loading) {
        return (
            <main className={styles.eventDetailPage} aria-busy="true">
                <div className={`${styles.hero} ${styles.heroSkeleton}`} />
                <div className={styles.layout}>
                    <div className={styles.skeletonBlock} />
                    <div className={styles.skeletonBlock} />
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <>
                <main className={styles.eventDetailPage}>
                    <div className={styles.notFound}>
                        <EmptyState
                            icon={<MdEventBusy />}
                            title="Evento não encontrado"
                            description="Ele pode ter sido encerrado ou removido. Veja os outros eventos disponíveis na agenda."
                            action={<Button href="/" icon={<IoArrowBack />}>Voltar para a agenda</Button>}
                        />
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const courseIds = event.courseIds?.length ? event.courseIds : event.courseId ? [event.courseId] : [];
    const courseNames = event.courseNames?.length
        ? event.courseNames
        : courseIds.map((courseId) => publicCourses.find(c => c.id === courseId)?.name ?? 'Carregando...');
    const courseLabel = courseIds.length ? courseNames.join(', ') : 'Todos os cursos';
    const startDateLabel = dateFormatter.format(new Date(event.startDate));
    const endDateLabel = event.endDate ? dateFormatter.format(new Date(event.endDate)) : null;
    const isMultiDay = Boolean(endDateLabel && endDateLabel !== startDateLabel);
    const dateLabel = isMultiDay ? `${startDateLabel} até ${endDateLabel}` : longDateFormatter.format(new Date(event.startDate));
    const timeLabel = `${timeFormatter.format(new Date(event.startTime))} às ${timeFormatter.format(new Date(event.endTime))}`;
    const location = event.locationName.toLowerCase() === 'outros' ? event.customLocation : event.locationName;
    const categoryName = event.categoryId ? categories.find(category => category.id === event.categoryId)?.name : null;
    const remaining = Math.max(event.maxParticipants - event.currentParticipants, 0);
    const filledPercent = event.maxParticipants ? Math.min(100, Math.round((event.currentParticipants / event.maxParticipants) * 100)) : 0;
    const semesterLabel = event.semester === 'ALL' || !event.semester
        ? 'Todos os semestres'
        : event.semester === 'ESPECIAL'
            ? 'Somente alunos em modelo especial'
            : `Somente o ${event.semester.replace('SEMESTER', '')}º semestre`;

    return (
        <>
            <main className={styles.eventDetailPage}>
                <nav className={styles.breadcrumb} aria-label="Você está em">
                    <Link href="/">Agenda de eventos</Link>
                    <IoChevronForward aria-hidden />
                    <span aria-current="page">{event.name}</span>
                </nav>

                <section className={styles.hero}>
                    <div className={styles.heroMedia}>
                        <ImageCloudinary
                            src={event.imageUrl}
                            alt=""
                            sizes="20vw"
                            className={styles.heroBackdrop}
                        />
                        <ImageCloudinary
                            src={event.imageUrl}
                            alt={event.name}
                            sizes="(max-width: 1024px) 100vw, 90vw"
                            priority
                            fit="contain"
                            className={styles.heroImage}
                        />
                    </div>
                    <div className={styles.heroContent}>
                        <div className={styles.heroBadges}>
                            {categoryName && <span className={styles.heroChip}>{categoryName}</span>}
                            <span className={`${styles.heroChip} ${event.isRestricted ? styles.heroChipRestricted : ''}`}>
                                {event.isRestricted ? <><MdLock aria-hidden /> Exclusivo para alunos e colaboradores</> : <><MdLockOpen aria-hidden /> Aberto ao público</>}
                            </span>
                        </div>
                        <h1 className={styles.title}>{event.name}</h1>
                        <p className={styles.heroSpeaker}><MdPerson aria-hidden /> com <strong>{event.speakerName}</strong></p>
                    </div>
                </section>

                <div className={styles.layout}>
                    <div className={styles.content}>
                        <Reveal as="section" className={styles.panel}>
                            <h2 className={styles.panelTitle}>Sobre o evento</h2>
                            <p className={styles.description}>{event.description}</p>
                        </Reveal>

                        <Reveal as="section" className={styles.panel} delay={80}>
                            <h2 className={styles.panelTitle}>Quem pode participar</h2>
                            <ul className={styles.requirements}>
                                <li>
                                    <span className={styles.reqIcon}>{event.isRestricted ? <MdLock aria-hidden /> : <MdLockOpen aria-hidden />}</span>
                                    <div>
                                        <strong>{event.isRestricted ? 'Evento restrito' : 'Evento aberto'}</strong>
                                        <p>
                                            {event.isRestricted
                                                ? 'Somente alunos e colaboradores da Fatec Itu, com RA e e-mail institucional.'
                                                : 'Alunos, colaboradores e pessoas de fora da Fatec podem se inscrever.'}
                                        </p>
                                    </div>
                                </li>
                                {event.isRestricted && (
                                    <li>
                                        <span className={styles.reqIcon}><MdMenuBook aria-hidden /></span>
                                        <div>
                                            <strong>{courseIds.length === 1 ? 'Curso' : 'Cursos'}</strong>
                                            <p>{courseIds.length ? courseLabel : 'Disponível para todos os cursos'}</p>
                                        </div>
                                    </li>
                                )}
                                {event.isRestricted && (
                                    <li>
                                        <span className={styles.reqIcon}><MdSchool aria-hidden /></span>
                                        <div>
                                            <strong>Semestre</strong>
                                            <p>{semesterLabel}</p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </Reveal>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className={styles.infoCard}>
                            <ul className={styles.infoList}>
                                <li>
                                    <span className={styles.infoIcon}><MdEvent aria-hidden /></span>
                                    <div><span className={styles.infoLabel}>Data</span><strong className={styles.capitalize}>{dateLabel}</strong></div>
                                </li>
                                <li>
                                    <span className={styles.infoIcon}><MdAccessTime aria-hidden /></span>
                                    <div><span className={styles.infoLabel}>Horário</span><strong>{timeLabel}</strong></div>
                                </li>
                                <li>
                                    <span className={styles.infoIcon}><MdLocationOn aria-hidden /></span>
                                    <div><span className={styles.infoLabel}>Local</span><strong>{location}</strong></div>
                                </li>
                                <li>
                                    <span className={styles.infoIcon}><MdPerson aria-hidden /></span>
                                    <div><span className={styles.infoLabel}>Palestrante</span><strong>{event.speakerName}</strong></div>
                                </li>
                            </ul>

                            {user && (
                                <div className={styles.seats}>
                                    <div className={styles.seatsHeader}>
                                        <span><MdGroups aria-hidden /> Vagas</span>
                                        <strong>{remaining} {remaining === 1 ? 'restante' : 'restantes'}</strong>
                                    </div>
                                    <div className={styles.seatsBar} aria-hidden><span style={{ width: `${filledPercent}%` }} /></div>
                                    <span className={styles.seatsHint}>{event.currentParticipants} de {event.maxParticipants} inscrições feitas</span>
                                </div>
                            )}

                            <ButtonRay text="Inscreva-se agora" onClick={handleSubscribe} type="button" disable={remaining === 0} />
                            <p className={styles.infoNote}><MdMarkEmailRead aria-hidden /> A confirmação chega no seu e-mail.</p>
                        </div>
                    </aside>
                </div>

                <CardEvents
                    categoryId={event.categoryId ?? null}
                    showFilters={false}
                    excludeId={event.id}
                />
            </main>
            <Footer />
        </>
    );

    // Below we have the modals

    function handleSubscribe(): void {
        let selectedCourse = '';
        let selectedSemester = '';

        openModal({
            title: 'Inscreva-se no evento!',
            icon: <MdAssignmentAdd size={32} />,
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
                const ra = raRef.current?.value ? normalizeFatecRa(raRef.current.value) : null;
                const raError = ra ? getFatecRaError(ra) : null;
                if (raError) throw new Error(raError);

                const dto: CreateParticipantDto = {
                    name: nameRef.current!.value.trim(),
                    email: emailRef.current!.value.trim(),
                    eventId,
                    courseId: selectedCourse ? Number(selectedCourse) : undefined,
                    semester: selectedSemester ? (selectedSemester as Semester) : null,
                    ra,
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
            {!onlyStudents &&
                <div className={styles.checkboxGroup}>
                    <InputCheckbox
                        checked={isStudent}
                        label="Sou aluno da Fatec Itu"
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
                </div>
            }
            <InputField ref={nameRef} label="Nome completo" required autoFocus />
            <InputField ref={emailRef} label={isStudent ? 'E-mail institucional' : 'E-mail'} type="email" required />
            {isStudent && (
                <>
                    <div className={styles.fieldRow}>
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
                    </div>
                    <InputField ref={raRef} label="RA" minLength={13} maxLength={13} inputMode="numeric" pattern="\d{13}" />
                </>
            )}
        </form>
    )
}
)

SubscriptionForm.displayName = 'SubscriptionForm'
