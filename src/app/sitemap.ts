import type { MetadataRoute } from 'next';
import { SITE_URL, fetchPublicEvents } from '@/utils/seo';

// Built again at most every 5 minutes, so new events show up without a new deploy.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const events = await fetchPublicEvents();

    return [
        { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
        ...events.map((event) => ({
            url: `${SITE_URL}/EventDetail/${event.id}`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
    ];
}
