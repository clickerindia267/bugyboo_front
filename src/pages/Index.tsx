import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
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
        <Categories />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <FloatingCart />
      <NewsletterPopup />
    </div>
  );
};

export default Index;
