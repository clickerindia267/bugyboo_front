import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    img: hero1,
    eyebrow: "Spring · Summer 26",
    title: "Petals & Pearls",
    subtitle: "Heirloom dresses crafted in soft European linen — for little moments that last forever.",
    cta: "Shop the collection",
  },
  {
    img: hero2,
    eyebrow: "Newborn Essentials",
    title: "Hello, Little One",
    subtitle: "Buttery cashmere and organic cotton, cocooning your tiniest treasure from day one.",
    cta: "Discover newborn",
  },
  {
    img: hero3,
    eyebrow: "Mini Wardrobe",
    title: "Quietly Luxurious",
    subtitle: "Hand-finished knits and timeless silhouettes, designed for everyday adventures.",
    cta: "Explore now",
  },
];

const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);

  const go = (dir: number) => setActive((a) => (a + dir + slides.length) % slides.length);

  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={s.img}
            alt={s.title}
            width={1920}
            height={1080}
            loading={i === 0 ? "eager" : "lazy"}
            className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
              i === active ? "scale-105" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex items-center pt-20">
        <div key={active} className="max-w-xl animate-fade-in">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/70 mb-5">
            {slides[active].eyebrow}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6 text-balance">
            {slides[active].title}
          </h1>
          <p className="text-base md:text-lg text-foreground/75 mb-8 max-w-md leading-relaxed">
            {slides[active].subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 px-8 h-12 shadow-elegant group"
            >
              {slides[active].cta}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 glass border-border/50"
            >
              Explore lookbook
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center gap-2">
        <button
          onClick={() => go(-1)}
          className="w-11 h-11 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => go(1)}
          className="w-11 h-11 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? "w-10 bg-primary" : "w-1.5 bg-foreground/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
