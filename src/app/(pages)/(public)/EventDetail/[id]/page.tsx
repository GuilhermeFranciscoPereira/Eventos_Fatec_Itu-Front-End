import type { Metadata } from 'next';
import EventDetailView from '@/app/(pages)/(public)/EventDetail/[id]/EventDetailView';
import { SITE_NAME, buildEventJsonLd, fetchPublicEvent, getEventLocation, getEventShareImage, serializeJsonLd, shortenText } from '@/utils/seo';

type EventDetailPageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const event = await fetchPublicEvent(Number(id));

    if (!event) {
        return { title: 'Evento não encontrado', robots: { index: false, follow: true } };
    }

    const description = shortenText(`${event.description} Local: ${getEventLocation(event)}. Palestrante: ${event.speakerName}.`);
    const image = getEventShareImage(event.imageUrl);

    return {
        title: event.name,
        description,
        alternates: { canonical: `/EventDetail/${event.id}` },
        openGraph: {
            type: 'website',
            title: event.name,
            description,
            url: `/EventDetail/${event.id}`,
            siteName: SITE_NAME,
            locale: 'pt_BR',
            images: [{ url: image, width: 1200, height: 630, alt: event.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: event.name,
            description,
            images: [image],
        },
    };
}

export default async function EventDetailPage({ params }: EventDetailPageProps): Promise<React.ReactElement> {
    const { id } = await params;
    const event = await fetchPublicEvent(Number(id));

    return (
        <>
            {event && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildEventJsonLd(event)) }}
                />
            )}
            <EventDetailView />
        </>
    );
}
