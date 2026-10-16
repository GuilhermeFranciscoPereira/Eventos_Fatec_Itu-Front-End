import type { Metadata } from "next";
import Footer from "@/components/Footer";
import CardEvent from "@/components/CardEvents";
import CarouselComponent from "@/components/CarouselComponent";
import styles from "@/app/(pages)/(public)/Home.module.css";

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home(): React.ReactElement {
  return (
    <>
      <CarouselComponent />
      <section className={styles.eventsSection} id="eventos" aria-labelledby="home-title">
        <header className={styles.sectionHeader}>
          <h1 id="home-title" className={styles.title}>
            Agenda de <span className={styles.highlight}>eventos</span> da Fatec Itu
          </h1>
          <p className={styles.subtitle}>
            Palestras, workshops e atividades acadêmicas abertas a alunos e à comunidade. Escolha um evento, veja os detalhes e garanta a sua vaga.
          </p>
        </header>
        <CardEvent />
      </section>
      <Footer />
    </>
  );
}
