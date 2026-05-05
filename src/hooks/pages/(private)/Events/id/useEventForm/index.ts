import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToastStore } from '@/stores/useToastStore';
import { useEditEvent } from '@/hooks/api/Events/Patch/useEditEvent';
import { useCreateEvent } from '@/hooks/api/Events/Post/useCreateEvent';
import { useGetAllCourses } from '@/hooks/api/Courses/Get/useGetAllCourses';
import { useGetAllCategories } from '@/hooks/api/Categories/Get/useGetAllCategories';
import { useGetAllLocationsPublic } from '@/hooks/api/Locations/Get/useGetAllLocations';
import { useGetAvailabilityDates } from '@/hooks/api/Events/Get/useGetAvailabilityDates';
import { useGetAvailabilityTimes } from '@/hooks/api/Events/Get/useGetAvailabilityTimes';
import type { Semester, AvailabilityTime, CreateEventDto, UpdateEventDto } from '@/@Types/EventTypes';

const semesterOptions = ['SEMESTER1', 'SEMESTER2', 'SEMESTER3', 'SEMESTER4', 'SEMESTER5', 'SEMESTER6', 'ALL', 'ESPECIAL'] as const

function parseTime(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
}

function formatTime(min: number): string {
    return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
}

export function useEventForm() {
    const { id } = useParams()
    const router = useRouter()
    const isNew = id === 'new'
    const editEvent = useEditEvent()
    const createEvent = useCreateEvent()
    const getDates = useGetAvailabilityDates()
    const getTimes = useGetAvailabilityTimes()
    const { categories } = useGetAllCategories()
    const { courses } = useGetAllCourses()
    const showToast = useToastStore(s => s.showToast)
    const { datas: locations } = useGetAllLocationsPublic();
    const [locationValue, setLocationValue] = useState<string>('')
    const selectedLocation = locations.find(location => String(location.id) === locationValue)
    const isOtherLocation = selectedLocation?.name?.toLowerCase() === 'outros'

    const maxRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const selectedFileRef = useRef<File | null>(null)
    const descRef = useRef<HTMLTextAreaElement>(null)
    const speakerRef = useRef<HTMLInputElement>(null)
    const durationRef = useRef<HTMLInputElement>(null)
    const customLocRef = useRef<HTMLInputElement>(null)
    const startDateRef = useRef<HTMLInputElement>(null)
    const restrictedRef = useRef<HTMLInputElement>(null)

    const [endTime, setEndTime] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [startTime, setStartTime] = useState<string>('')
    const [isOnline, setIsOnline] = useState<boolean>(false)
    const [loadedDate, setLoadedDate] = useState<string>('')
    const [courseValue, setCourseValue] = useState<string>('')
    const [endOptions, setEndOptions] = useState<string[]>([])
    const today: string = new Date().toISOString().split('T')[0]
    const [categoryValue, setCategoryValue] = useState<string>('')
    const [startOptions, setStartOptions] = useState<string[]>([])
    const [initialUrl, setInitialUrl] = useState<string | null>(null)
    const [availableDates, setAvailableDates] = useState<string[]>([])
    const [semesterValue, setSemesterValue] = useState<Semester | ''>('')
    const [availableTimes, setAvailableTimes] = useState<AvailabilityTime[]>([])

    useEffect(() => {
        if (isNew) return
        setLoading(true)
            ; (async () => {
                try {
                    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/${id}`)
                    if (!response.ok) throw new Error(`Status ${response.status}`)
                    const e = await response.json()
                    setInitialUrl(e.imageUrl)
                    nameRef.current!.value = e.name
                    descRef.current!.value = e.description
                    speakerRef.current!.value = e.speakerName
                    maxRef.current!.value = `${e.maxParticipants}`
                    setCourseValue(e.courseId ? String(e.courseId) : '')
                    setSemesterValue((e.semester ?? 'ALL') as Semester | '')
                    setCategoryValue(e.categoryId?.toString() || '')
                    setLocationValue(String(e.locationId))
                    if (customLocRef.current) {
                        customLocRef.current.value =
                            e.locationName?.toLowerCase() === 'outros' ? (e.customLocation ?? '') : ''
                    }
                    restrictedRef.current!.checked = e.isRestricted
                    setIsOnline(categories.find(c => c.id === e.categoryId)?.name === 'Curso Online')
                    const day = e.startDate.split('T')[0]
                    setLoadedDate(day)
                    startDateRef.current!.value = day
                    const times = e.locationName.toLowerCase() === 'outros'
                        ? [{ start: '07:00', end: '22:00' }]
                        : await getTimes(e.locationId, day, Number(id))
                    setAvailableTimes(times)
                    setStartOptions(
                        times.flatMap(({ start, end }) =>
                            Array.from({ length: Math.floor((parseTime(end) - 30 - parseTime(start)) / 30) + 1 }, (_, i) =>
                                formatTime(parseTime(start) + i * 30),
                            ),
                        ),
                    )
                    const init = e.startTime.slice(11, 16)
                    setStartTime(init)
                    setEndOptions(
                        times.flatMap(({ end }) => {
                            const s0 = parseTime(init) + 30
                            const eMax = parseTime(end)
                            return s0 > eMax
                                ? []
                                : Array.from({ length: Math.floor((eMax - s0) / 30) + 1 }, (_, i) => formatTime(s0 + i * 30))
                        }),
                    )
                    setEndTime(e.endTime.slice(11, 16))
                    setCourseValue(e.courseId ? String(e.courseId) : '')
                    setSemesterValue((e.semester ?? 'ALL') as Semester | '')
                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : String(err)
                    if (!msg.includes('404')) showToast({ message: 'Falha ao carregar evento.', type: 'error' })
                } finally {
                    setLoading(false)
                }
            })()
    }, [id, isNew, categories, getTimes, showToast])

    useEffect(() => {
        if (!restrictedRef.current) return

        if (courseValue !== '') {
            restrictedRef.current.checked = true
        }
    }, [courseValue])

    function setSelectedFile(file: File | null): void {
        selectedFileRef.current = file
    }

    async function handleCategoryChange(value: string): Promise<void> {
        setCategoryValue(value)

        const online = categories.find(c => c.id === Number(value))?.name === 'Curso Online'
        setIsOnline(online)

        if (online) {
            setAvailableDates([])
            setAvailableTimes([])
            startDateRef.current!.value = ''
        }
    }

    async function handleLocationChange(value: string): Promise<void> {
        setLocationValue(value)

        const selectedLocationId = Number(value)
        const selectedLocation = locations.find(location => location.id === selectedLocationId)

        if (selectedLocation?.name.toLowerCase() !== 'outros') {
            try {
                setAvailableDates(await getDates(selectedLocationId))
            } catch {
                showToast({ message: 'Erro ao obter datas.', type: 'error' })
                setAvailableDates([])
            }
        } else {
            setAvailableDates([])
            setAvailableTimes([])
        }

        startDateRef.current!.value = ''
        setStartTime('')
        setEndTime('')
        setStartOptions([])
        setEndOptions([])
    }

    async function handleDateChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        if (!e.target.value) return

        const selectedLocationId = Number(locationValue)
        const selectedLocation = locations.find(location => location.id === selectedLocationId)

        const times: AvailabilityTime[] =
            selectedLocation?.name.toLowerCase() === 'outros'
                ? [{ start: '07:00', end: '22:00' }]
                : await getTimes(selectedLocationId, e.target.value, isNew ? undefined : Number(id))

        setAvailableTimes(times)
        setStartOptions(
            times.flatMap(({ start, end }) =>
                Array.from({ length: Math.floor((parseTime(end) - 30 - parseTime(start)) / 30) + 1 }, (_, i) =>
                    formatTime(parseTime(start) + i * 30),
                ),
            ),
        )
        setEndTime('')
        setStartTime('')
        setEndOptions([])
    }

    function handleStartTimeChange(value: string): void {
        if (!value) {
            setEndOptions([])
            return
        }

        const m0 = parseTime(value) + 30
        const selectedLocationId = Number(locationValue)
        const selectedLocation = locations.find(location => location.id === selectedLocationId)

        const times =
            selectedLocation?.name.toLowerCase() === 'outros' || isOnline
                ? Array.from({ length: Math.floor((22 * 60 - m0) / 30) + 1 }, (_, i) => formatTime(m0 + i * 30))
                : availableTimes.flatMap(({ start, end }) => {
                    const s = parseTime(start)
                    const eMax = parseTime(end)
                    return s <= parseTime(value)
                        ? Array.from({ length: Math.floor((eMax - m0) / 30) + 1 }, (_, i) => formatTime(m0 + i * 30))
                        : []
                })

        setEndOptions([...new Set(times)])
    }

    function handleCourseChangeUI(value: string): void {
        setCourseValue(value)

        if (value === '') {
            setSemesterValue('ALL')
        }
    }

    function handleSemesterChangeUI(value: string): void {
        setSemesterValue(value as Semester | '')
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault()
        const selectedLocationId = Number(locationValue)
        const selectedLocation = locations.find(location => location.id === selectedLocationId)
        if (isNew && !selectedFileRef.current) {
            showToast({ message: 'Você deve inserir uma imagem', type: 'warning' })
            return
        }
        setLoading(true)
        const day = startDateRef.current!.value || loadedDate
        const cid = courseValue ? Number(courseValue) : undefined
        const base = {
            name: nameRef.current!.value.trim(),
            description: descRef.current!.value.trim(),
            courseId: cid,
            semester: cid ? (semesterValue || 'ALL') : 'ALL',
            maxParticipants: Number(maxRef.current!.value),
            isRestricted: courseValue !== '' ? true : restrictedRef.current!.checked,
            locationId: selectedLocationId,
            customLocation: selectedLocation?.name.toLowerCase() === 'outros'
                ? customLocRef.current!.value.trim() || undefined
                : undefined,
            speakerName: speakerRef.current!.value.trim(),
            startDate: `${day}T00:00:00Z`,
            startTime: `${day}T${startTime}:00Z`,
            endTime: `${day}T${endTime}:00Z`,
            duration: durationRef.current?.value ? Number(durationRef.current.value) : undefined,
            categoryId: categoryValue ? Number(categoryValue) : undefined,
        } as const
        try {
            if (isNew) {
                await createEvent({ ...(base as unknown as Omit<CreateEventDto, 'image'>), image: selectedFileRef.current! })
            } else {
                if (selectedFileRef.current) {
                    await editEvent(Number(id), { ...(base as unknown as Omit<UpdateEventDto, 'image'>), image: selectedFileRef.current })
                } else {
                    await editEvent(Number(id), base as unknown as UpdateEventDto)
                }
            }
            router.push('/Events')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            msg
                .split(',')
                .map(m => m.trim())
                .filter(Boolean)
                .forEach(m => showToast({ message: m, type: 'warning' }))
        } finally {
            setLoading(false)
        }
    }

    return { initialUrl, loading, isNew, categories, courses, locations, semesterOptions, courseValue, semesterValue, availableDates, startOptions, endOptions, startTime, endTime, isOnline, isOtherLocation, today, loadedDate, nameRef, descRef, locationValue, categoryValue, speakerRef, maxRef, customLocRef, startDateRef, durationRef, restrictedRef, setSelectedFile, handleCategoryChange, handleLocationChange, handleDateChange, handleStartTimeChange, handleSubmit, setStartTime, setEndTime, handleCourseChangeUI, handleSemesterChangeUI }
}
