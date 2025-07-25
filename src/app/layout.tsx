import "./globals.css";
import type { Metadata } from "next";
import Modal from "@/components/Modal";
import Header from "@/components/Header";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import HydratorZustand from "@/stores/HydratorZustand";
import Toast from "@/components/Toast";

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: "Eventos Fatec Itu",
  description: "Aqui você encontra todas os eventos atuais da Fatec Itu! Palestras, workshops, feiras e encontros acadêmicos organizados pela instituição. Confira datas, horários e locais, faça sua inscrição com facilidade e não perca nenhuma oportunidade de aprendizado, troca de experiências e networking!",
  creator: "Guilherme Francisco Pereira -> https://github.com/GuilhermeFranciscoPereira",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactElement }>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <HydratorZustand />
        <Header />
        <Sidebar />
        <Modal />
        <Toast />
        {children}
      </body>
    </html >
  );
}
