import { useCallback } from 'react'
import { apiFetch } from '@/hooks/api/client'
import { CreateEventDto } from '@/@Types/EventTypes'
import { useToastStore } from '@/stores/useToastStore'

type UseCreateEvent = {
    (dto: CreateEventDto): Promise<void>
}

export function useCreateEvent(): UseCreateEvent {
    const showToast = useToastStore(s => s.showToast)

    return useCallback(async (dto) => {
        const form = new FormData()
        form.append('name', dto.name)
        form.append('description', dto.description)
        dto.courseIds?.forEach((courseId) => form.append('courseIds', String(courseId)))
        if (dto.semester) form.append('semester', dto.semester)
        form.append('maxParticipants', String(dto.maxParticipants))
        form.append('isRestricted', String(dto.isRestricted))
        form.append('locationId', String(dto.locationId))
        if (dto.customLocation) form.append('customLocation', dto.customLocation)
        form.append('speakerName', dto.speakerName)
        form.append('startDate', dto.startDate)
        if (dto.endDate) form.append('endDate', dto.endDate)
        form.append('startTime', dto.startTime)
        form.append('endTime', dto.endTime)
        if (dto.duration !== undefined) form.append('duration', String(dto.duration))
        if (dto.categoryId !== undefined) form.append('categoryId', String(dto.categoryId))
        if (dto.presenceSecret) form.append('presenceSecret', dto.presenceSecret)
        form.append('image', dto.image)

        const res = await apiFetch(`${process.env.NEXT_PUBLIC_URL_API}/events/create`, {
            method: 'POST',
            csrf: true,
            body: form,
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.message || 'Falha ao criar evento')
        }

        showToast({ message: 'Evento criado!', type: 'success' })
    }, [showToast])
}
