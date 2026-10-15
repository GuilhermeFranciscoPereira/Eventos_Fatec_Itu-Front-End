import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/seo';

// Admin pages require login and have nothing to index.
const PRIVATE_ROUTES = ['/Carousel', '/Categories', '/Courses', '/Events', '/Locations', '/Users'];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: '*', allow: '/', disallow: PRIVATE_ROUTES },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
