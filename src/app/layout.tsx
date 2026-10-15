import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Poppins } from 'next/font/google';
import WrapperVLibras from "@/utils/wrapperVLibras";
import ZustandWrapper from "@/stores/ZustandWrapper";
import ButtonScrollToTop from "@/components/Buttons/ButtonScrollToTop";
import { ORGANIZATION, SITE_DESCRIPTION, SITE_NAME, SITE_URL, serializeJsonLd } from "@/utils/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: "Guilherme Francisco Pereira -> https://github.com/GuilhermeFranciscoPereira",
  keywords: [
    'agenda fatec itu',
    'eventos fatec itu',
    'calendário fatec itu',
    'fatec itu eventos',
    'palestras fatec itu',
    'workshops fatec itu',
    'atividades acadêmicas fatec itu',
    'eventos acadêmicos itu',
  ],
  robots: { index: true, follow: true, },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

const organizationJsonLd = serializeJsonLd({ '@context': 'https://schema.org', ...ORGANIZATION });

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLd }} />
        <ZustandWrapper />
        <Header />
        <Sidebar />
        {children}
        <ButtonScrollToTop />
        <WrapperVLibras />
      </body>
    </html>
  );
}
