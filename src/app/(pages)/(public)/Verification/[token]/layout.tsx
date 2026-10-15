import type { Metadata } from 'next';

// The page shows the student's name and e-mail, so it must never show up in search results.
export const metadata: Metadata = {
    title: 'Verificação de certificado',
    robots: { index: false, follow: false },
};

export default function VerificationLayout({ children }: { children: React.ReactNode }): React.ReactNode {
    return children;
}
