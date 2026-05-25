import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import SeasonBestsellers from "@/components/SeasonBestsellers";
import ShopByOccasion from "@/components/ShopByOccasion";
import BabyBanners from "@/components/BabyBanners";
import Testimonials from "@/components/Testimonials";
import CompanyOverview from "@/components/CompanyOverview";
import StepIntoWorld from "@/components/StepIntoWorld";
import OnPageSeo from "@/components/OnPageSeo";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import MobileBottomNav from "@/components/MobileBottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <main>
        <Hero />
        <ShopByOccasion />
        <BabyBanners />
        <FeaturedProducts />
        <SeasonBestsellers />
        <Testimonials />
        <CompanyOverview />
        <StepIntoWorld />
        <OnPageSeo />
      </main>
      <Footer />
      <FloatingCart />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
