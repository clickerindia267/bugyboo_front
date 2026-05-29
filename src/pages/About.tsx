import SEO from "@/components/SEO";
import PageShell from "@/components/PageShell";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Sparkles, 
  Sprout, 
  Award, 
  Globe, 
  Users, 
  CheckCircle2, 
  DollarSign, 
  Truck, 
  HeartHandshake, 
  ShoppingBag, 
  Layers, 
  ThumbsUp,
  Flame,
  Calendar,
  ShieldCheck,
  Compass,
  MapPin
} from "lucide-react";

import logo from "@/assets/logo.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import avichalAtikant from "@/assets/avichal-atikant.jpg";
import catBoys from "@/assets/cat-boys.jpg";
import catGirls from "@/assets/cat-girls.jpg";
import catNewborn from "@/assets/cat-newborn.jpg";
import catCasual from "@/assets/cat-casual.jpg";
import catParty from "@/assets/cat-party.jpg";
import nightwear1 from "@/assets/nightwear1.jpeg";

// visions data...
const visions = [
  {
    icon: Heart,
    title: "Skin-Friendly Comfort",
    desc: "Crafting extremely soft, breathable, and skin-friendly cotton fabrics that protect children's delicate skin throughout the day.",
    bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50",
  },
  {
    icon: Sparkles,
    title: "Modern & Trendy Kids Fashion",
    desc: "Designing fresh, contemporary outfits that find the perfect balance between modern style trends and everyday comfort.",
    bg: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    desc: "Making premium kidswear accessible by offering highly competitive wholesale and retail pricing without compromising on standards.",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50",
  },
  {
    icon: Truck,
    title: "Reliable Nationwide Logistics",
    desc: "Ensuring smooth order processing, professional packing, and prompt delivery services across all regions of India.",
    bg: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/50",
  },
  {
    icon: ThumbsUp,
    title: "Consistent Excellence & Trust",
    desc: "Maintaining rigorous manufacturing standards to build long-term relationships with businesses, parents, and distributors.",
    bg: "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/50",
  },
];

const differentation = [
  {
    icon: Sprout,
    title: "Premium Quality Fabric",
    desc: "At Bugyboo, quality comes first. We use soft, breathable, and premium cotton fabrics that are comfortable for children’s delicate skin. Every outfit is designed to ensure durability and long-lasting comfort.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  },
  {
    icon: Sparkles,
    title: "Trendy Kids Fashion",
    desc: "Our design team focuses on modern kids fashion trends to create stylish outfits loved by both children and parents. We regularly update our collections with fresh and attractive designs.",
    color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    desc: "We believe quality kids wear should be accessible to everyone. Bugyboo offers competitive wholesale and retail pricing without compromising product standards.",
    color: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  },
  {
    icon: Layers,
    title: "Wholesale & Retail Availability",
    desc: "Customers can purchase Bugyboo products in bulk as well as single pieces through our website. We support retailers, shop owners, resellers, and individual customers across India.",
    color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50",
  },
  {
    icon: Truck,
    title: "Timely Delivery Across India",
    desc: "We understand the importance of fast and reliable delivery. Our team ensures smooth order processing and timely dispatch to different parts of India.",
    color: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50",
  },
  {
    icon: HeartHandshake,
    title: "Customer-Focused Approach",
    desc: "Customer satisfaction is one of our biggest priorities. From product selection to order support, our team works to provide a smooth and reliable shopping experience.",
    color: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/50",
  },
];

const categories = [
  {
    name: "Baby Clothing",
    image: catNewborn,
    tag: "Super Soft & Breathable",
  },
  {
    name: "Boys Casual Wear",
    image: catBoys,
    tag: "Play-Proof Durability",
  },
  {
    name: "Girls Fashion Wear",
    image: catGirls,
    tag: "Elegant & Trendy Styles",
  },
  {
    name: "Cotton Kids Wear",
    image: catCasual,
    tag: "100% Premium Cotton",
  },
  {
    name: "Comfortable Home Wear",
    image: nightwear1,
    tag: "Cozy & Relaxed Fits",
  },
  {
    name: "Stylish Party Wear",
    image: catParty,
    tag: "Aesthetic Celebrations",
  },
];

const bulletCategories = [
  "Daily Wear Clothing",
  "Trendy Outfits for Children",
  "Seasonal Kids Collections",
];

const seoTags = [
  "Kids wear manufacturer in India",
  "Kids clothing supplier in Delhi NCR",
  "Wholesale kids wear in Ghaziabad",
  "Affordable baby clothes online",
  "Trendy kids fashion supplier",
  "Cotton kids wear manufacturer",
];

const About = () => {
  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bugyboo.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": "https://bugyboo.com/about"
      }
    ]
  };

  return (
    <PageShell hideHeaderSpacer>
      <SEO 
        title="About Us | Kids Wear Manufacturer & Wholesale Supplier | Bugyboo"
        description="Bugyboo is a trusted kids wear manufacturer and wholesale supplier in Ghaziabad, Delhi NCR. Explore stylish, comfortable, affordable kids clothing for boys, girls, and babies across India."
        keywords="About Bugyboo, kids wear manufacturer Ghaziabad, wholesale kids wear Delhi NCR, cotton baby clothes supplier"
        ogType="website"
        schemaData={breadcrumbSchema}
      />
      
      {/* ── SECTION 1: CUSTOM LUXURY HERO SECTION ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-pink/20 via-lavender/10 to-transparent">
        {/* Decorative dynamic background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink/30 rounded-full filter blur-3xl opacity-50 animate-float" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue/20 rounded-full filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Premium Brand Intro */}
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md border border-pink/25 text-xs font-semibold text-primary tracking-wide shadow-soft">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
              🇮🇳 Ghaziabad's Premier Kidswear Wholesaler & Manufacturer
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary leading-tight font-extrabold text-balance">
              About Bugyboo – <span className="bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">Trusted Kids Wear</span> <br className="hidden sm:inline" />
              Manufacturer & Wholesale Supplier in India
            </h1>
            
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-xl text-balance font-medium">
              Welcome to <strong>Bugyboo</strong>, a growing name in the Indian kids fashion industry. 
              We are a trusted kids wear manufacturer and wholesale supplier based in Ghaziabad, Delhi NCR, 
              dedicated to creating stylish, comfortable, and affordable clothing for children.
            </p>
            
            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 max-w-md">
              <div>
                <span className="block font-serif text-3xl font-bold text-rose-600 dark:text-rose-400">3-4+</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Years of Trust</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-bold text-indigo-600 dark:text-indigo-400">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Premium Fabric</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">Fast</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Dispatch India</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/shop">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-sm shadow-soft px-8 h-12 transition-all duration-300 hover:scale-102">
                  Browse Retail Shop
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="rounded-full text-sm px-8 h-12 shadow-soft bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                  Wholesale Inquiry
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Image Grid Montage */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Decorative background shadow cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-indigo-500/10 rounded-[3rem] -rotate-3 scale-105 filter blur-sm -z-10" />
            
            <div className="grid grid-cols-12 gap-4 w-full max-w-md animate-scale-in">
              <div className="col-span-8 overflow-hidden rounded-[2.5rem] shadow-elegant border-4 border-white dark:border-zinc-900 hover:scale-102 transition-transform duration-500 relative group">
                <img
                  src={hero1}
                  alt="Premium children wear collection"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="col-span-4 flex flex-col gap-4 justify-between">
                <div className="overflow-hidden rounded-3xl shadow-elegant border-2 border-white dark:border-zinc-900 hover:-translate-y-1 transition-transform duration-500 aspect-square">
                  <img
                    src={hero2}
                    alt="Cotton fabric details"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-elegant border-2 border-white dark:border-zinc-900 hover:translate-y-1 transition-transform duration-500 aspect-square">
                  <img
                    src={hero3}
                    alt="Kids fashion wear"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating "Premium Cotton" circular emblem */}
                <div className="bg-rose-600 text-white rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-glow aspect-square animate-float font-extrabold">
                  <Flame className="h-6 w-6 text-white mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider leading-tight">100%</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider leading-tight">Cotton</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto pb-24 px-4 overflow-hidden">
        
        {/* ── SECTION 2: BRAND NARRATIVE & JOURNEY (TIMELINE SPLIT) ── */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24 mt-12">
          
          {/* Left Column: Narrative Details */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400 font-bold">Our Journey</span>
            <h2 className="font-serif text-3xl md:text-5xl text-primary leading-tight font-bold">
              Built on Dedication, Care, and Comfort
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium">
              At Bugyboo, we believe that children deserve clothing that not only looks fashionable but also feels soft, breathable, and comfortable throughout the day. Our collections are thoughtfully designed for babies, boys, and girls, keeping modern fashion trends and everyday comfort together in perfect balance.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium">
              From trendy casual wear to daily wear essentials and premium cotton outfits, we offer a wide range of kids clothing suitable for every season and occasion. Whether you are a retailer, distributor, reseller, boutique owner, or a parent looking for quality kids wear online in India, Bugyboo is here to serve your needs with trust and consistency.
            </p>
            
            {/* Elegant Callout Block */}
            <div className="border-l-4 border-rose-600 pl-6 py-3 italic text-primary/95 font-serif text-base bg-rose-50/50 dark:bg-rose-950/15 rounded-r-2xl shadow-soft">
              "What started as a small initiative has now grown into a trusted kids wear brand serving customers from different cities and regions across India."
            </div>
          </div>

          {/* Right Column: Interactive Journey Steps */}
          <div className="lg:col-span-6 space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-[2.5rem] border border-border/50">
            <h3 className="font-serif text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <Compass className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              Bugyboo Milestones
            </h3>
            
            <div className="space-y-6">
              {[
                {
                  year: "The Foundation",
                  title: "Founded by Avichal Atikant",
                  desc: "Launched with a core vision to bring premium, soft, and skin-friendly kids clothing to families and businesses across India.",
                  icon: Calendar
                },
                {
                  year: "Continuous Improvement",
                  title: "Fine-Tuning Standards",
                  desc: "Dedicated to improving manufacturing processes, enhancing fabric selection, and matching contemporary Indian design requirements.",
                  icon: Sprout
                },
                {
                  year: "Today & Beyond",
                  title: "Nationwide Trust & Dispatch",
                  desc: "Proudly supplying high-volume orders to retailers, resellers, boutiques, and parents in cities all over India while maintaining affordable rates.",
                  icon: ShieldCheck
                }
              ].map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center flex-shrink-0 shadow-soft group-hover:scale-105 transition-transform duration-300">
                      <StepIcon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400 block mb-0.5">{step.year}</span>
                      <h4 className="font-serif text-base text-primary font-bold">{step.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-1">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: VISION & PILARS (STUNNING GRID) ── */}
        <div className="mb-24 relative py-12 rounded-[2.5rem] bg-gradient-to-b from-beige/20 via-pink/5 to-transparent border border-pink/5">
          <div className="text-center max-w-2xl mx-auto mb-16 px-4">
            <span className="text-xs uppercase tracking-[0.25em] text-rose-600 dark:text-rose-400 font-bold">Our Vision</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mt-2">What We Aspire To Be</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Our vision is to become one of the most trusted and preferred kids wear brands in India by delivering consistency and quality at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 px-4">
            {visions.map((vision) => {
              const Icon = vision.icon;
              return (
                <div
                  key={vision.title}
                  className="p-6 rounded-3xl border bg-white dark:bg-zinc-900 shadow-soft hover:shadow-elegant hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${vision.bg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-lg text-primary font-bold mb-3">{vision.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{vision.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 4: WHAT MAKES US DIFFERENT (INTERACTIVE GRID) ── */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-rose-600 dark:text-rose-400 font-bold">The Bugyboo Edge</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mt-2">What Makes Bugyboo Different</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              From our premium fabrics to our client-centered approach, here is why customers and B2B partners choose us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentation.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative p-8 rounded-3xl border bg-white dark:bg-zinc-900 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${item.color} group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif text-xl text-primary font-bold mb-3">{item.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 5: PRODUCT CATEGORIES SHOWCASE ── */}
     

        {/* ── SECTION 6: B2B WHOLESALE VALUE PROPOSITIONS ── */}
        <div className="mb-24 grid lg:grid-cols-12 gap-12 items-center bg-gradient-to-r from-pink/5 to-blue/5 p-8 md:p-14 lg:p-20 rounded-[2.5rem] border border-pink/5">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400 font-bold mb-3 block">For B2B Partners & Resellers</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mb-6">Why Retailers Choose Bugyboo</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
              Retailers and distributors across India prefer Bugyboo because we provide dependable business solutions, high-volume consistency, and premium products children and parents fall in love with.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Consistent product quality",
                "Trending kids wear designs",
                "Affordable wholesale rates",
                "Reliable business support",
                "Bulk order availability",
                "Fast dispatch services",
                "Professional customer handling"
              ].map((reason, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-primary/95">{reason}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="w-full max-w-sm aspect-square rounded-[2rem] overflow-hidden border-4 border-white dark:border-zinc-900 shadow-elegant bg-white flex items-center justify-center p-6">
              <img
                src={logo}
                alt="Bugyboo Baby Shop Logo"
                className="w-full h-full object-contain hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 7: LEADERSHIP TEAM ── */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-rose-600 dark:text-rose-400 font-bold">Leadership Team</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mt-2">The Minds Behind Bugyboo</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              The strength of Bugyboo lies in its passionate and dedicated team members who work continuously to maintain quality, creativity, and customer trust.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Founder - Avichal Atikant */}
            <div className="group rounded-[2rem] border bg-white dark:bg-zinc-900 shadow-soft hover:shadow-elegant transition-all duration-500 overflow-hidden flex flex-col">
              <div className="h-[340px] overflow-hidden relative">
                <img
                  src={avichalAtikant}
                  alt="Avichal Atikant - Founder"
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950/80 to-transparent p-6 text-white">
                  <h3 className="font-serif text-2xl font-bold">Avichal Atikant</h3>
                  <p className="text-rose-400 text-xs tracking-wider uppercase font-semibold mt-1">Founder & CEO</p>
                </div>
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                  Founded Bugyboo with a clear vision to bring high-quality and affordable kids fashion to families and businesses across India. Driven by dedication, creativity, customer satisfaction, and a deep understanding of children’s clothing requirements.
                </p>
              </div>
            </div>

            {/* Team Member - Shalini Sinha */}
            <div className="group rounded-[2rem] border bg-white dark:bg-zinc-900 shadow-soft hover:shadow-elegant transition-all duration-500 overflow-hidden flex flex-col">
              <div className="h-[340px] flex items-center justify-center bg-gradient-to-tr from-lavender/40 to-pink/20 relative">
                {/* Custom premium avatar */}
                <div className="w-32 h-32 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center shadow-elegant border-4 border-rose-500/35 text-primary group-hover:scale-105 transition-transform duration-500">
                  <span className="font-serif text-4xl font-extrabold tracking-wider text-rose-600">SS</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950/80 to-transparent p-6 text-white w-full">
                  <h3 className="font-serif text-2xl font-bold">Shalini Sinha</h3>
                  <p className="text-rose-400 text-xs tracking-wider uppercase font-semibold mt-1">Operations Director</p>
                </div>
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                  Plays an important role in managing operations, customer coordination, and ensuring smooth workflow within the company. Her dedication and management support have contributed significantly to the growth and reliability of the Bugyboo brand.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 8: REGIONAL REACH & SEO COMMITMENTS ── */}
        <div className="mb-24 bg-zinc-50 dark:bg-zinc-900/40 p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-border/40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400 font-bold mb-3 block">Serving Customers Across India</span>
              <h3 className="font-serif text-2xl md:text-3xl text-primary font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                Ghaziabad & Delhi NCR Hub
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-6 font-medium">
                Based in Ghaziabad, Delhi NCR, Bugyboo proudly serves customers and retailers throughout India. Our online availability makes it easy for businesses and parents to explore and order premium kids clothing from the comfort of their homes or stores.
              </p>
              <div className="flex flex-wrap gap-2">
                {seoTags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="py-1.5 px-3.5 rounded-full bg-white dark:bg-zinc-950 text-[10px] md:text-xs text-primary/80 font-bold border border-border/60 shadow-soft hover:border-rose-600 hover:text-rose-600 transition-colors duration-300 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-l border-border/60 pl-0 lg:pl-12 space-y-6">
              <h3 className="font-serif text-xl md:text-2xl text-primary font-bold mb-4">Our Commitment</h3>
              <div className="space-y-4">
                {[
                  { title: "High manufacturing standards", desc: "Rigorous quality checks on every garment." },
                  { title: "Honest business practices & Fair pricing", desc: "No middleman inflation, pure wholesale pricing." },
                  { title: "Maximum customer satisfaction", desc: "Responsive order support and premium shipping." },
                  { title: "Trend-focused collections", desc: "Updating our catalogs monthly with fresh designs." }
                ].map((commit, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold font-serif shadow-soft">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-serif text-sm font-bold text-primary">{commit.title}</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{commit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 9: GORGEOUS CALL TO ACTION ── */}
      

      </section>
    </PageShell>
  );
};

export default About;
