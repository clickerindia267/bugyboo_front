import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import SeasonBestsellers from "@/components/SeasonBestsellers";
import Testimonials from "@/components/Testimonials";
import CompanyOverview from "@/components/CompanyOverview";
import NewsletterPopup from "@/components/NewsletterPopup";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <SeasonBestsellers />
        <Testimonials />
        <CompanyOverview />
      </main>
      <Footer />
      <FloatingCart />
      <NewsletterPopup />
    </div>
  );
};

export default Index;
