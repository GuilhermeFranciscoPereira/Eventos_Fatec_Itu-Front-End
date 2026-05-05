import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Poppins } from 'next/font/google';
import WrapperVLibras from "@/utils/wrapperVLibras";
import ZustandWrapper from "@/stores/ZustandWrapper";
import ButtonScrollToTop from "@/components/Buttons/ButtonScrollToTop";

export const metadata: Metadata = {
  title: "Eventos Fatec Itu",
  description: "Aqui você encontra todas os eventos atuais da Fatec Itu! Palestras, workshops, feiras e encontros acadêmicos organizados pela instituição. Confira datas, horários e locais, faça sua inscrição com facilidade e não perca nenhuma oportunidade de aprendizado, troca de experiências e networking!",
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
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900']
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={poppins.className}>
        <ZustandWrapper />
        <Header />
        <Sidebar />
        {children}
        <ButtonScrollToTop />
        <WrapperVLibras />
      </body>
    </html >
  );
}
