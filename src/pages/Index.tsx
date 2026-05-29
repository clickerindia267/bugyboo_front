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
import SEO from "@/components/SEO";

const Index = () => {
  // Homepage B2B/B2C Organization & Website Searchbox Schemas
  const organizationSchema = {
    "@type": "Organization",
    "name": "Bugyboo",
    "url": "https://bugyboo.com",
    "logo": "https://bugyboo.com/assets/logo.jpg",
    "description": "Bugyboo is a trusted kids wear manufacturer and wholesale supplier in Ghaziabad, Delhi NCR, creating stylish, comfortable, and affordable organic cotton clothing for children.",
    "founder": {
      "@type": "Person",
      "name": "Avichal Atikant"
    },
    "foundingDate": "2022",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ghaziabad",
      "addressLocality": "Ghaziabad",
      "addressRegion": "Delhi NCR",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/bugyboo",
      "https://www.instagram.com/bugyboo"
    ]
  };

  const websiteSchema = {
    "@type": "WebSite",
    "name": "Bugyboo",
    "url": "https://bugyboo.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://bugyboo.com/shop?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEO 
        title="Buy Kids Wear Online India | Baby Clothes & Kids Fashion | Bugyboo"
        description="Discover Bugyboo, the best kids clothing brand in India. Buy kids wear online, cotton baby clothes, and trendy kids fashion. Premium and daily wear for boys & girls."
        keywords="Buy Kids Wear Online India, Best Kids Clothing Brand in India, Kids Wear Online Shopping India, Affordable Kids Wear Online, Premium Kids Fashion, Cotton Kids Wear Manufacturer"
        ogType="website"
        schemaData={[organizationSchema, websiteSchema]}
      />

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
