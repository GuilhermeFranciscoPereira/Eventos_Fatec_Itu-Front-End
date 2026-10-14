// Mirror of the API rule (Eventos_Fatec_Itu-Back-End: participants/validators/fatec-ra.validator.ts),
// so the student sees the problem before submitting. The API still validates on its own.
// Fatec RA as issued by SIGA (Regulamento Geral dos Cursos de Graduação do CPS, Art. 15):
// FFF CCC AA S T NNN -> unit, course, entry year, entry semester (1|2), shift (1-4) and sequence.
const RA_PATTERN = /^(\d{3})(\d{3})(\d{2})([12])([1-4])(\d{3})$/;
const MAX_RA_AGE_YEARS = 20;
const SECOND_SEMESTER_FIRST_MONTH = 6;

export function normalizeFatecRa(ra: string): string {
    return ra.replace(/[\s.\-/]/g, '');
}

export function getFatecRaError(ra: string, now: Date = new Date()): string | null {
    if (!/^\d{13}$/.test(ra)) return 'RA deve conter exatamente 13 números.';

    const match = RA_PATTERN.exec(ra);
    if (!match) {
        if (!/[12]/.test(ra[8])) return 'RA inválido: o 9º dígito (semestre de ingresso) deve ser 1 ou 2.';
        return 'RA inválido: o 10º dígito (turno de ingresso) deve ser de 1 a 4.';
    }

    const [, unit, course, year, semester, , sequence] = match;
    if (unit === '000') return 'RA inválido: código da unidade Fatec inexistente.';
    if (course === '000') return 'RA inválido: código do curso inexistente.';
    if (sequence === '000') return 'RA inválido: número de matrícula inexistente.';

    const currentYear = now.getFullYear();
    const entryYear = Math.floor(currentYear / 100) * 100 + Number(year);
    if (entryYear > currentYear) return 'RA inválido: o ano de ingresso (7º e 8º dígitos) está no futuro.';
    if (currentYear - entryYear > MAX_RA_AGE_YEARS) return 'RA inválido: ano de ingresso (7º e 8º dígitos) fora do período aceito.';

    const isFutureSemester = entryYear === currentYear && semester === '2' && now.getMonth() + 1 < SECOND_SEMESTER_FIRST_MONTH;
    if (isFutureSemester) return 'RA inválido: semestre de ingresso ainda não iniciado.';

    return null;
}
