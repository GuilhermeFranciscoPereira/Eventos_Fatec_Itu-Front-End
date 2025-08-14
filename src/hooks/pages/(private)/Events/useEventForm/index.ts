import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToastStore } from '@/stores/useToastStore';
import { useEditEvent } from '@/hooks/api/Events/Patch/useEditEvent';
import { useCreateEvent } from '@/hooks/api/Events/Post/useCreateEvent';
import { useGetAllCategories } from '@/hooks/api/Categories/Get/useGetAllCategories';
import { useGetAvailabilityDates } from '@/hooks/api/Events/Get/useGetAvailabilityDates';
import { useGetAvailabilityTimes } from '@/hooks/api/Events/Get/useGetAvailabilityTimes';
import type { Location, Course, Semester, AvailabilityTime, CreateEventDto, UpdateEventDto } from '@/@Types/EventTypes';

const courseOptions = ['ADS', 'GE', 'GTI', 'GEMP', 'MEC'] as const;
const semesterOptions = ['SEMESTER1', 'SEMESTER2', 'SEMESTER3', 'SEMESTER4', 'SEMESTER5', 'SEMESTER6', 'ESPECIAL'] as const;
const locationOptions = [
    'AUDITORIO',
    'BIBLIOTECA',
    'SALA_MAKER',
    'LAB_MECANICA_METROLOGIA',
    'LAB_SISTEMAS_INTEGRADOS',
    'LAB_HIDRAULICA_PNEUMATICA',
    'LAB_ENSAIOS_METALOGRAFICOS',
    'LAB_ELETRONICA_POTENCIA',
    'LAB_COMANDOS_ELETRICOS',
    'LAB_CONTROLE_PROCESSOS',
    'LAB_INFORMATICA_1',
    'LAB_INFORMATICA_2',
    'LAB_INFORMATICA_3',
    'LAB_INFORMATICA_4',
    'LAB_INFORMATICA_5',
    'LAB_INFORMATICA_6',
    'SALA_1',
    'SALA_2',
    'SALA_3',
    'SALA_4',
    'SALA_5',
    'SALA_6',
    'SALA_7',
    'SALA_8',
    'SALA_9',
    'SALA_9_3_4',
    'SALA_10',
    'SALA_11',
    'SALA_12',
    'OUTROS'
] as const;

function parseTime(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}

function formatTime(min: number): string {
    return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

export function useEventForm() {
    const { id } = useParams();
    const router = useRouter();
    const isNew = id === 'new'
    const editEvent = useEditEvent();
    const createEvent = useCreateEvent();
    const getDates = useGetAvailabilityDates();
    const getTimes = useGetAvailabilityTimes();
    const { categories } = useGetAllCategories();
    const showToast = useToastStore(s => s.showToast);

    const maxRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const selectedFileRef = useRef<File | null>(null);
    const courseRef = useRef<HTMLSelectElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);
    const speakerRef = useRef<HTMLInputElement>(null);
    const durationRef = useRef<HTMLInputElement>(null);
    const locationRef = useRef<HTMLSelectElement>(null);
    const customLocRef = useRef<HTMLInputElement>(null);
    const semesterRef = useRef<HTMLSelectElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const restrictedRef = useRef<HTMLInputElement>(null);

    const [endTime, setEndTime] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<string>('');
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [loadedDate, setLoadedDate] = useState<string>('');
    const [endOptions, setEndOptions] = useState<string[]>([]);
    const today: string = new Date().toISOString().split('T')[0];
    const [startOptions, setStartOptions] = useState<string[]>([]);
    const [initialUrl, setInitialUrl] = useState<string | null>(null);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<AvailabilityTime[]>([]);

    const goBack = () => router.back();

    useEffect(() => {
        if (isNew) return;
        setLoading(true);
        (async () => {
            try {
                const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/${id}`);
                if (!response.ok) throw new Error(`Status ${response.status}`);
                const e = await response.json();
                setInitialUrl(e.imageUrl);
                nameRef.current!.value = e.name
                descRef.current!.value = e.description
                speakerRef.current!.value = e.speakerName
                maxRef.current!.value = `${e.maxParticipants}`
                courseRef.current!.value = e.course
                semesterRef.current!.value = e.semester || ''
                categoryRef.current!.value = e.categoryId?.toString() || ''
                restrictedRef.current!.checked = e.isRestricted
                locationRef.current!.value = e.location
                setIsOnline(categories.find(c => c.id === e.categoryId)?.name === 'Curso Online');
                const day = e.startDate.split('T')[0];
                setLoadedDate(day);
                startDateRef.current!.value = day;
                const times = e.location === 'OUTROS' ? [{ start: '07:00', end: '22:00' }] : await getTimes(e.location, day, Number(id))
                setAvailableTimes(times);
                setStartOptions(
                    times.flatMap(({ start, end }) => {
                        return Array.from(
                            { length: Math.floor((parseTime(end) - 30 - parseTime(start)) / 30) + 1 },
                            (_, i) => formatTime(parseTime(start) + i * 30)
                        )
                    })
                )
                const init = e.startTime.slice(11, 16);
                setStartTime(init);
                setEndOptions(
                    times.flatMap(({ end }) => {
                        const s0 = parseTime(init) + 30;
                        const eMax = parseTime(end);
                        return s0 > eMax ? [] : Array.from(
                            { length: Math.floor((eMax - s0) / 30) + 1 },
                            (_, i) => formatTime(s0 + i * 30)
                        )
                    })
                )
                setEndTime(e.endTime.slice(11, 16))
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                if (!msg.includes('404')) showToast({ message: 'Falha ao carregar evento.', type: 'Error' });
            } finally {
                setLoading(false);
            }
        })()
    }, [id, isNew, categories, getTimes, showToast]);

    function setSelectedFile(file: File | null): void {
        selectedFileRef.current = file;
    }

    async function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
        const online: boolean = categories.find(c => c.id === Number(e.target.value))?.name === 'Curso Online';
        setIsOnline(online);
        if (online) {
            setAvailableDates([]);
            setAvailableTimes([]);
            startDateRef.current!.value = '';
        }
    }

    async function handleLocationChange(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
        if (e.target.value !== 'OUTROS') {
            try {
                setAvailableDates(await getDates(e.target.value as Location));
            } catch {
                showToast({ message: 'Erro ao obter datas.', type: 'Error' });
                setAvailableDates([]);
            }
        } else {
            setAvailableDates([]);
            setAvailableTimes([]);
        }
        startDateRef.current!.value = '';
    }

    async function handleDateChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        if (!e.target.value) return;
        const loc: Location = locationRef.current!.value as Location;
        const times: AvailabilityTime[] = loc === 'OUTROS'
            ? [{ start: '07:00', end: '22:00' }]
            : await getTimes(loc, e.target.value, isNew ? undefined : Number(id));
        setAvailableTimes(times);
        setStartOptions(
            times.flatMap(({ start, end }) => {
                return Array.from(
                    { length: Math.floor((parseTime(end) - 30 - parseTime(start)) / 30) + 1 },
                    (_, i) => formatTime(parseTime(start) + i * 30)
                )
            })
        );
        setEndTime('');
        setStartTime('');
        setEndOptions([]);
    }

    function handleStartTimeChange(value: string): void {
        if (!value) {
            setEndOptions([]);
            return;
        }
        const m0: number = parseTime(value) + 30;
        const loc: Location = locationRef.current!.value as Location;
        const times: string[] = loc === 'OUTROS' || isOnline ? Array.from(
            { length: Math.floor((22 * 60 - m0) / 30) + 1 },
            (_, i) => formatTime(m0 + i * 30)
        ) : availableTimes.flatMap(({ start, end }) => {
            const s = parseTime(start)
            const eMax = parseTime(end)
            return s <= parseTime(value) ? Array.from(
                { length: Math.floor((eMax - m0) / 30) + 1 },
                (_, i) => formatTime(m0 + i * 30)
            ) : []
        });
        setEndOptions([...new Set(times)]);
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        if (isNew && !selectedFileRef.current) return showToast({ message: 'Você deve inserir uma imagem', type: 'Alert' });
        setLoading(true);
        const day: string = startDateRef.current!.value || loadedDate;
        const base = {
            name: nameRef.current!.value.trim(),
            description: descRef.current!.value.trim(),
            course: courseRef.current!.value as Course,
            semester: (semesterRef.current!.value as Semester) || undefined,
            maxParticipants: Number(maxRef.current!.value),
            isRestricted: restrictedRef.current!.checked,
            location: locationRef.current!.value as Location,
            customLocation: locationRef.current!.value === 'OUTROS' ? customLocRef.current!.value.trim() || undefined : undefined,
            speakerName: speakerRef.current!.value.trim(),
            startDate: `${day}T00:00:00Z`,
            startTime: `${day}T${startTime}:00Z`,
            endTime: `${day}T${endTime}:00Z`,
            duration: durationRef.current?.value ? Number(durationRef.current.value) : undefined,
            categoryId: categoryRef.current!.value ? Number(categoryRef.current!.value) : undefined
        } as const;
        try {
            if (isNew)
                await createEvent({ ...base, image: selectedFileRef.current! } as CreateEventDto);
            else
                await editEvent(
                    Number(id),
                    selectedFileRef.current
                        ? ({ ...base, image: selectedFileRef.current } as UpdateEventDto)
                        : (base as UpdateEventDto)
                );
            router.push('/Events');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            msg.split(',').map((m: string) => m.trim()).filter(Boolean).forEach((msg: string) => showToast({ message: msg, type: 'Alert' }));
        } finally {
            setLoading(false);
        }
    }

    return { initialUrl, loading, isNew, categories, courseOptions, semesterOptions, locationOptions, availableDates, startOptions, endOptions, startTime, endTime, isOnline, today, loadedDate, nameRef, descRef, speakerRef, maxRef, locationRef, customLocRef, courseRef, semesterRef, categoryRef, startDateRef, durationRef, restrictedRef, setSelectedFile, handleCategoryChange, handleLocationChange, handleDateChange, handleStartTimeChange, handleSubmit, goBack, setStartTime, setEndTime };
}
