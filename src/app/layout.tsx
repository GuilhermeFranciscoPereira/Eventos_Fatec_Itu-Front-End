import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: "Eventos Fatec Itu",
  description: "Aqui você encontra todas os eventos atuais da Fatec Itu! Palestras, workshops, feiras e encontros acadêmicos organizados pela instituição. Confira datas, horários e locais, faça sua inscrição com facilidade e não perca nenhuma oportunidade de aprendizado, troca de experiências e networking!",
  creator: "Guilherme Francisco Pereira -> https://github.com/GuilhermeFranciscoPereira",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
