import { useState, useEffect } from "react";
import PageShell from "@/components/PageShell";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, ShoppingBag, ZoomIn } from "lucide-react";
import SEO from "@/components/SEO";

// Import real local assets
import frok1 from "@/assets/frok1.jpeg";
import frok2 from "@/assets/frok2.jpeg";
import frok3 from "@/assets/frok3.jpeg";
import nightwear1 from "@/assets/nightwear1.jpeg";
import nightwear2 from "@/assets/nightwear2.jpeg";
import nightwear3 from "@/assets/nightwear3.jpeg";
import pinktop1 from "@/assets/pinktop1.jpeg";
import pinktop2 from "@/assets/pinktop2.jpeg";
import pinktop3 from "@/assets/pinktop3.jpeg";
import catBoys from "@/assets/cat-boys.jpg";
import catGirls from "@/assets/cat-girls.jpg";
import catNewborn from "@/assets/cat-newborn.jpg";
import occasionBirthday from "@/assets/occasion-birthday.png";
import occasionVacation from "@/assets/occasion-vacation.png";

type GalleryItem = {
  id: string;
  image: string;
  title: string;
  category: "Girls" | "Boys" | "Newborn" | "Nightwear" | "Occasion";
  description: string;
  price: string;
  tag: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    image: frok1,
    title: "Vintage Meadow Ruffled Frock",
    category: "Girls",
    description: "Tailored from long-staple organic cotton. Hand-block floral patterns printed with non-toxic, gentle water-based inks. Features extra-soft flat seams and back button fastening.",
    price: "₹1,299",
    tag: "Ages 1-4Y",
  },
  {
    id: "g2",
    image: nightwear1,
    title: "Organic Slumber Sage Pajama Set",
    category: "Nightwear",
    description: "An incredibly breathable two-piece sleep set dyed in natural plant sage extract. Play-optimized, highly stretchable rib-knit collar ensures comfortable sleep.",
    price: "₹899",
    tag: "Ages 0-6Y",
  },
  {
    id: "g3",
    image: pinktop1,
    title: "Petal Soft Peplum Top",
    category: "Girls",
    description: "Woven in airy muslin fabric. Features detailed smocking across the chest and tiny flutter sleeves. Unbelievably lightweight and play-proof.",
    price: "₹799",
    tag: "Ages 2-5Y",
  },
  {
    id: "g4",
    image: catBoys,
    title: "Classic Breton Stripe Romper",
    category: "Boys",
    description: "Durable nautical striped organic knit romper. Outfitted with nickel-free snaps along the diaper line for fast and friction-free morning changes.",
    price: "₹1,099",
    tag: "Ages 0-2Y",
  },
  {
    id: "g5",
    image: occasionBirthday,
    title: "Little Gentleman Linen Set",
    category: "Occasion",
    description: "Heirloom-grade linen vest, poplin collared shirt, and elasticated linen shorts. Ideal for cake-smashing, family portraits, and elegant garden birthdays.",
    price: "₹2,499",
    tag: "Ages 1-5Y",
  },
  {
    id: "g6",
    image: catNewborn,
    title: "Pure Cloud Organic Swaddle & Knot Hat",
    category: "Newborn",
    description: "Wrap your little newborn in absolute security. Made with ultra-soft organic modal fabric that mimics the comforting, warm sensation of a mother's touch.",
    price: "₹950",
    tag: "Newborn",
  },
  {
    id: "g7",
    image: frok2,
    title: "Pastel Lemon Twirl Dress",
    category: "Girls",
    description: "A bright, sunny cotton frock styled with custom double-tiered gathers and gentle ties. Naturally dyed with zero chemical traces.",
    price: "₹1,499",
    tag: "Ages 2-6Y",
  },
  {
    id: "g8",
    image: nightwear2,
    title: "Sweet Dreams Lavender Sleeper",
    category: "Nightwear",
    description: "One-piece footer pajama equipped with a two-way smooth zipper. Protective inner tab guards tender baby skin from zip irritation.",
    price: "₹999",
    tag: "Ages 0-18M",
  },
  {
    id: "g9",
    image: pinktop2,
    title: "Rose Quartz Gathered Blouse",
    category: "Girls",
    description: "Delightfully soft organic linen blouse featuring detailed hand-stitch details. Built flat-lock to remain comfortable even on the hottest summer afternoons.",
    price: "₹850",
    tag: "Ages 3-6Y",
  },
  {
    id: "g10",
    image: frok3,
    title: "Ethereal Blush Party Gown",
    category: "Occasion",
    description: "An elegant, luxurious celebration dress. Layered with soft organic cotton tulle that feels fluffy but doesn't feel rough or heavy against toddler legs.",
    price: "₹2,799",
    tag: "Ages 1-6Y",
  },
  {
    id: "g11",
    image: occasionVacation,
    title: "Coastline Cotton Cabana Set",
    category: "Occasion",
    description: "Breathable tropical-print resort shirt and lightweight shorts set. Designed slowly in India, built for endless beach sandcastles and hot vacation play.",
    price: "₹1,599",
    tag: "Ages 1-5Y",
  },
  {
    id: "g12",
    image: nightwear3,
    title: "Stars & Constellations Pajama Set",
    category: "Nightwear",
    description: "A dark navy organic cotton sleep pair with glowing hand-drawn prints. Breathable elasticized waist ensures zero tight marks or irritation.",
    price: "₹1,150",
    tag: "Ages 1-6Y",
  },
  {
    id: "g13",
    image: catGirls,
    title: "Heirloom Linen Play Dress",
    category: "Girls",
    description: "Crafted in premium stonewashed Indian linen. Features adjustable crossover button straps on the back to accommodate rapid baby growth spurts.",
    price: "₹1,699",
    tag: "Ages 1-4Y",
  },
  {
    id: "g14",
    image: pinktop3,
    title: "Sunlit Terracotta Smocked Top",
    category: "Girls",
    description: "An extremely soft, organic knit cotton top styled with high-elastic smocking. Easy to pull over toddler heads without any fuss.",
    price: "₹750",
    tag: "Ages 12M-3Y",
  },
];

const categories = ["All", "Girls", "Boys", "Newborn", "Nightwear", "Occasion"] as const;

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<typeof categories[number]>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items based on active tab
  const filteredItems = galleryItems.filter(
    (item) => activeTab === "All" || item.category === activeTab
  );

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

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
        "name": "Lookbook & Gallery",
        "item": "https://bugyboo.com/gallery"
      }
    ]
  };

  return (
    <PageShell
      title="Captured Moments of Joy"
      eyebrow="BugyBoo Lookbooks"
      subtitle="Exquisite playwear, cozy pajamas, and grand occasion wear captured in real life. Click on any outfit to view its craft details."
    >
      <SEO 
        title="Lookbook & Gallery | Premium Kids Wear Joy | Bugyboo"
        description="Explore the Bugyboo Lookbooks. View captured real-life moments of children wearing our GOTS-certified organic cotton clothing, cozy pajama sets, and festive dresses."
        keywords="Bugyboo lookbook, kids wear lookbook India, organic baby clothes gallery, children playwear photographs"
        ogType="website"
        schemaData={breadcrumbSchema}
      />
      <section className="container mx-auto pb-24 px-4">
        
        {/* ── Filter Tabs ── */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveTab(cat);
                setLightboxIndex(null);
              }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border ${
                activeTab === cat
                  ? "bg-primary border-primary text-white shadow-soft"
                  : "bg-white hover:bg-secondary/40 text-muted-foreground border-border/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Gallery Masonry/Grid ── */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border/80">
            <p className="text-muted-foreground text-sm">No lookbook moments captured in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-white border border-border/40 shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Image Wrap */}
                <div className="aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg text-white mt-3 mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-white/70 font-semibold mb-2">{item.price}</p>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
                      <ZoomIn className="h-3.5 w-3.5" />
                      View Details
                    </div>
                  </div>
                </div>

                {/* Always-on subtle header for accessibility */}
                <div className="p-4 sm:hidden bg-white border-t border-border/30">
                  <span className="text-[10px] uppercase font-semibold text-primary/70">{item.category}</span>
                  <h4 className="font-serif text-sm text-primary mt-1 line-clamp-1">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Interactive Lightbox Modal ── */}
        {currentItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            {/* Modal Box */}
            <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-elegant border border-white/20 grid md:grid-cols-12 max-h-[90vh] md:max-h-[85vh]">
              
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-primary" />
              </button>

              {/* Left Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-border shadow-soft flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-primary" />
              </button>

              {/* Right Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-border shadow-soft flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-primary" />
              </button>

              {/* Image Side */}
              <div className="md:col-span-7 bg-secondary/20 flex items-center justify-center overflow-hidden aspect-[4/3] md:aspect-auto md:h-full relative max-h-[40vh] md:max-h-none">
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Side */}
              <div className="md:col-span-5 p-8 md:p-12 lg:p-14 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none bg-white">
                <div>
                  {/* Category & Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {currentItem.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary/60 px-3 py-1 rounded-full border border-border/40">
                      {currentItem.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl md:text-3xl text-primary leading-tight mb-4">
                    {currentItem.title}
                  </h3>

                  {/* Price */}
                  <p className="font-sans text-xl font-bold text-primary mb-6">{currentItem.price}</p>

                  {/* Description */}
                  <div className="border-t border-border/50 pt-6">
                    <h5 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Our Craft Process</h5>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {currentItem.description}
                    </p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <Link to="/shop" onClick={() => setLightboxIndex(null)}>
                    <Button className="w-full rounded-full h-12 text-sm bg-primary hover:bg-primary/90 shadow-soft group">
                      <ShoppingBag className="mr-2 h-4 w-4 group-hover:scale-105 transition-transform" />
                      Shop the Look
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

      </section>
    </PageShell>
  );
};

export default Gallery;
