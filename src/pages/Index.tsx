import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import SeasonBestsellers from "@/components/SeasonBestsellers";
import ShopByOccasion from "@/components/ShopByOccasion";
import Testimonials from "@/components/Testimonials";
import CompanyOverview from "@/components/CompanyOverview";
import StepIntoWorld from "@/components/StepIntoWorld";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ShopByOccasion />
        <FeaturedProducts />
        <SeasonBestsellers />
        <Testimonials />
        <CompanyOverview />
        <StepIntoWorld />
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Index;
