import { useUserStore } from "@/stores/useUserStore";
import type { EventProps } from "@/@Types/EventTypes";
import { useModalStore } from "@/stores/useModalStore";
import { useGetAllEvents } from "@/hooks/api/Events/Get/useGetAllEvents";
import { useDeleteEvent } from "@/hooks/api/Events/Delete/useDeleteEvent";

export function useEventsPage() {
    const deleteEvent = useDeleteEvent();
    const user = useUserStore((state) => state.user);
    const openModal = useModalStore((s) => s.openModal);
    const { events, loading, refetch } = useGetAllEvents();

    function formatEventDateTime(event: EventProps): string {
        const startDate = new Date(event.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const endDate = event.endDate
            ? new Date(event.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
            : null;
        const date = endDate && endDate !== startDate ? `${startDate} até ${endDate}` : startDate;

        const start = new Date(event.startTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });

        const end = new Date(event.endTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });

        return `${date} às ${start} até ${end}`;
    }

    function getEventLocation(event: EventProps): string {
        if (event.locationName.toLowerCase() !== 'outros') {
            return event.locationName;
        }

        return event.customLocation || 'Local não informado';
    }

    return { deleteEvent, user, openModal, formatEventDateTime, getEventLocation, events, loading, refetch };
}
