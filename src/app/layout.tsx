import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Poppins } from 'next/font/google';
import WrapperVLibras from "@/utils/wrapperVLibras";
import ZustandWrapper from "@/stores/ZustandWrapper";

export const metadata: Metadata = {
  title: "Eventos Fatec Itu",
  description: "Aqui você encontra todas os eventos atuais da Fatec Itu! Palestras, workshops, feiras e encontros acadêmicos organizados pela instituição. Confira datas, horários e locais, faça sua inscrição com facilidade e não perca nenhuma oportunidade de aprendizado, troca de experiências e networking!",
  creator: "Guilherme Francisco Pereira -> https://github.com/GuilhermeFranciscoPereira",
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900']
})

export default function RootLayout({ children }: { children: React.ReactElement }) {
  return (
    <html lang="pt-br">
      <body className={poppins.className}>
        <ZustandWrapper />
        <Header />
        <Sidebar />
        {children}
        <WrapperVLibras />
      </body>
    </html >
  );
}
