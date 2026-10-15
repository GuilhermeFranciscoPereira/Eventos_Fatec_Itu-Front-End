import type { Metadata } from "next";
import Footer from "@/components/Footer";
import CardEvent from "@/components/CardEvents";
import CarouselComponent from "@/components/CarouselComponent";

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home(): React.ReactElement {
  return (
    <>
      <h1 className="visuallyHidden">Eventos da Fatec Itu – Dom Amaury Castanho</h1>
      <CarouselComponent />
      <CardEvent />
      <Footer />
    </>
  );
}
