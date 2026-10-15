import type { EventPublicResponse } from '@/@Types/EventTypes';

export const SITE_URL: string = (process.env.NEXT_PUBLIC_SITE_URL || 'https://agendafatecitu.com.br').replace(/\/+$/, '');
export const SITE_NAME = 'Eventos Fatec Itu';
export const SITE_DESCRIPTION = 'Aqui você encontra todos os eventos atuais da Fatec Itu! Palestras, workshops, feiras e encontros acadêmicos organizados pela instituição. Confira datas, horários e locais, faça sua inscrição com facilidade e não perca nenhuma oportunidade de aprendizado, troca de experiências e networking!';

const API_URL = process.env.NEXT_PUBLIC_URL_API;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
// Metadata must not hang the page when the API is slow: after this, the page uses the default metadata.
const API_TIMEOUT_MS = 5000;
const REVALIDATE_SECONDS = 300;

export const ORGANIZATION = {
    '@type': 'CollegeOrUniversity',
    name: 'Fatec Itu – Dom Amaury Castanho',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/images/Logo_FatecItu_WithoutBackground.png`,
    telephone: '+55 11 4013-1872',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Tiradentes, 1211 - Parque Industrial',
        addressLocality: 'Itu',
        addressRegion: 'SP',
        postalCode: '13309-640',
        addressCountry: 'BR',
    },
    sameAs: [
        'https://instagram.com/fatecitu',
        'https://facebook.com/fatecitu',
        'https://br.linkedin.com/school/fatec-itu/',
    ],
} as const;

async function fetchFromApi<T>(path: string): Promise<T | null> {
    if (!API_URL) return null;
    try {
        const response = await fetch(`${API_URL}${path}`, {
            next: { revalidate: REVALIDATE_SECONDS },
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });
        if (!response.ok) return null;
        return (await response.json()) as T;
    } catch {
        return null;
    }
}

export function fetchPublicEvent(id: number): Promise<EventPublicResponse | null> {
    return fetchFromApi<EventPublicResponse>(`/events/${id}`);
}

export async function fetchPublicEvents(): Promise<EventPublicResponse[]> {
    return (await fetchFromApi<EventPublicResponse[]>('/events/publicAllEvents')) ?? [];
}

// 1200x630 is the size social networks use for link previews.
export function getEventShareImage(imageUrl: string): string {
    if (!imageUrl) return `${SITE_URL}/opengraph-image`;
    const publicId = imageUrl.startsWith('http') ? imageUrl.split('/upload/')[1] ?? '' : imageUrl.replace(/^\/+/, '');
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_jpg,q_auto,c_fill,g_auto,w_1200,h_630/${publicId}`;
}

export function getEventLocation(event: EventPublicResponse): string {
    return event.locationName?.toLowerCase() === 'outros' ? (event.customLocation ?? 'Fatec Itu') : event.locationName;
}

// Times are saved as the Itu wall-clock time marked as UTC, so the date and the time are joined with the Brazil offset.
function toLocalIso(date: Date | string, time: Date | string): string {
    return `${String(date).slice(0, 10)}T${String(time).slice(11, 16)}:00-03:00`;
}

export function shortenText(text: string, maxLength = 160): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > maxLength ? `${clean.slice(0, maxLength - 1).trimEnd()}…` : clean;
}

export function buildEventJsonLd(event: EventPublicResponse): Record<string, unknown> {
    const url = `${SITE_URL}/EventDetail/${event.id}`;
    const isFull = event.currentParticipants >= event.maxParticipants;

    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.name,
        description: shortenText(event.description, 500),
        image: [getEventShareImage(event.imageUrl)],
        url,
        startDate: toLocalIso(event.startDate, event.startTime),
        endDate: toLocalIso(event.endDate ?? event.startDate, event.endTime),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        isAccessibleForFree: true,
        location: {
            '@type': 'Place',
            name: getEventLocation(event),
            address: ORGANIZATION.address,
        },
        performer: { '@type': 'Person', name: event.speakerName },
        organizer: { '@type': ORGANIZATION['@type'], name: ORGANIZATION.name, url: ORGANIZATION.url },
        offers: {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'BRL',
            url,
            availability: isFull ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        },
    };
}

// "<" is escaped so text typed in an event can never close the script tag.
export function serializeJsonLd(data: Record<string, unknown>): string {
    return JSON.stringify(data).replace(/</g, '\\u003c');
}
