import { useCallback } from 'react'
import { CreateEventDto } from '@/@Types/EventTypes'
import { useToastStore } from '@/stores/useToastStore'

type UseCreateEvent = {
    (dto: CreateEventDto): Promise<void>
}

export function useCreateEvent(): UseCreateEvent {
    const showToast = useToastStore(s => s.showToast)

    return useCallback(async (dto) => {
        const { csrfToken } = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/csrf-token`, { credentials: 'include' }).then(r => r.json())

        const form = new FormData()
        form.append('name', dto.name)
        form.append('description', dto.description)
        if (dto.courseId) form.append('courseId', String(dto.courseId))
        if (dto.semester) form.append('semester', dto.semester)
        form.append('maxParticipants', String(dto.maxParticipants))
        form.append('isRestricted', String(dto.isRestricted))
        form.append('location', dto.location)
        if (dto.customLocation) form.append('customLocation', dto.customLocation)
        form.append('speakerName', dto.speakerName)
        form.append('startDate', dto.startDate)
        form.append('startTime', dto.startTime)
        form.append('endTime', dto.endTime)
        if (dto.duration !== undefined) form.append('duration', String(dto.duration))
        if (dto.categoryId !== undefined) form.append('categoryId', String(dto.categoryId))
        form.append('image', dto.image)

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/events/create`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-CSRF-Token': csrfToken },
            body: form,
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.message || 'Falha ao criar evento')
        }

        showToast({ message: 'Evento criado!', type: 'success' })
    }, [showToast])
}
