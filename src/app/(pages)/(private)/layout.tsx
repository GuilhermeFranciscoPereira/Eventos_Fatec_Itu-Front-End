import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Área administrativa',
    robots: { index: false, follow: false },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }): React.ReactNode {
    return children;
}
