import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import MobileBottomNav from "@/components/MobileBottomNav";
import SEO from "@/components/SEO";

// Lazy load below-the-fold components
const ShopByOccasion = lazy(() => import("@/components/ShopByOccasion"));
const BabyBanners = lazy(() => import("@/components/BabyBanners"));
const FeaturedProducts = lazy(() => import("@/components/FeaturedProducts"));
const SeasonBestsellers = lazy(() => import("@/components/SeasonBestsellers"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const CompanyOverview = lazy(() => import("@/components/CompanyOverview"));
const StepIntoWorld = lazy(() => import("@/components/StepIntoWorld"));
const OnPageSeo = lazy(() => import("@/components/OnPageSeo"));

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
        <Suspense fallback={<div className="h-40 w-full animate-pulse bg-secondary/20 rounded-2xl my-8" />}>
          <ShopByOccasion />
          <BabyBanners />
          <FeaturedProducts />
          <SeasonBestsellers />
          <Testimonials />
          <CompanyOverview />
          <StepIntoWorld />
          <OnPageSeo />
        </Suspense>
      </main>
      <Footer />
      <FloatingCart />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
