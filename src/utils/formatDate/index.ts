const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const DAY_MS = 24 * 60 * 60 * 1000;

export function splitDateTime(iso: string): { date: string; time: string } {
    const value = new Date(iso);
    if (Number.isNaN(value.getTime())) return { date: '—', time: '' };
    return { date: dateFormatter.format(value), time: timeFormatter.format(value) };
}

export function isWithinLastDays(iso: string, days: number): boolean {
    const value = new Date(iso).getTime();
    return !Number.isNaN(value) && Date.now() - value <= days * DAY_MS;
}

const eventClockFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

export function nowInEventClock(date: Date = new Date()): number {
    const parts = Object.fromEntries(eventClockFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
    return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
}

export function relativeDay(iso: string): string {
    const value = new Date(iso);
    if (Number.isNaN(value.getTime())) return '—';
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((startOfToday.getTime() - new Date(value).setHours(0, 0, 0, 0)) / DAY_MS);
    if (diffDays <= 0) return 'hoje';
    if (diffDays === 1) return 'ontem';
    if (diffDays < 30) return `há ${diffDays} dias`;
    return dateFormatter.format(value);
}
