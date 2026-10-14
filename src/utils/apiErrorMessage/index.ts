// The API (NestJS) sends validation errors as string[] and other errors as a single string.
// Passing the array straight to new Error() joins the items with commas, and splitting that
// back on commas cuts messages that contain commas themselves, so the items are joined by
// line breaks instead (Toast and Modal render them with white-space: pre-line).
export function getApiErrorMessage(body: unknown, fallback: string): string {
    const message = typeof body === 'object' && body !== null ? (body as { message?: unknown }).message : undefined;

    if (Array.isArray(message)) {
        const lines = message.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
        if (lines.length) return lines.join('\n');
    }
    if (typeof message === 'string' && message.trim()) return message;

    return fallback;
}
