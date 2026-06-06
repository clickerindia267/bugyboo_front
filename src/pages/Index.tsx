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
      <div className="seo-prerender-header" style={{ opacity: 0.001, position: 'absolute', pointerEvents: 'none', height: '1px', width: '1px', overflow: 'hidden' }}>
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground">Buy Kids Wear Online India – Premium Fashion for Babies, Boys &amp; Girls</h1>
      </div>
      <SEO 
        title="Buy Kids Wear Online India | Frocks, Co-ord Sets &amp; Night Suits"
        description="Shop premium kids wear online in India at Bugyboo. Discover stylish girls frocks, trendy co-ord sets, comfortable night suits, and soft cotton baby clothes at affordable prices with delivery across India."
        keywords="Buy Kids Wear Online India, Best Kids Clothing Brand in India, Kids Wear Online Shopping India, Affordable Kids Wear Online, Premium Kids Clothing India, Kids Clothing Store Online India, Trendy Kids Fashion Online India, Buy Baby Clothes Online India, Stylish Kids Dresses Online, Girls Frocks Online India, Buy Girls Frocks Online, Kids Co-ord Sets Online India, Buy Kids Co-ord Sets Online, Kids Night Suit Online India, Cotton Kids Wear India, Organic Cotton Kids Wear India, Premium Kids Fashion for Boys & Girls, Comfortable Daily Wear for Kids, Soft Cotton Clothes for Babies, Baby Clothes Online India, Newborn Baby Clothes Online Shopping, Trendy Baby Clothes Online India, Fashionable Kids Wear Online, Kids Clothing Website India, Buy Boys Clothing Online India, Buy Girls Dresses Online India, Kids Party Wear Online, Summer Wear for Kids India, Stylish Kids Wear at Best Price, Online Kids Fashion Shopping Website"
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
