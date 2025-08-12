import Footer from "@/components/Footer";
import CardEvent from "@/components/CardEvents";
import CarouselComponent from "@/components/CarouselComponent";

export default function Home(): React.ReactElement {
  return (
    <>
      <CarouselComponent />
      <CardEvent />
      <Footer />
    </>
  );
}
