import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroSplit1 from "@/assets/hero-split-1.png";
import heroSplit2 from "@/assets/hero-split-2.png";
import heroBanner1 from "@/assets/hero-banner-1.png";
import heroBanner2 from "@/assets/hero-banner-2.png";
import heroBanner3 from "@/assets/hero-banner-3.png";

/* ── slide data ─────────────────────────────────────────── */
interface Slide {
  img: string;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  cta: string;
  ctaLink: string;
  panelBg: string;
  accentColor: string;
}

const slides: Slide[] = [
  {
    img: heroSplit1,
    eyebrow: "",
    title: "Summer",
    titleAccent: "Stories",
    subtitle: "NEW ARRIVALS",
    cta: "Shop Now",
    ctaLink: "/shop",
    panelBg: "hsl(43 82% 96%)",
    accentColor: "#3f646f",
  },
  {
    img: heroSplit2,
    eyebrow: "Spring · Summer 2026",
    title: "Petals &",
    titleAccent: "Pearls",
    subtitle: "BEACH COLLECTION",
    cta: "Explore Now",
    ctaLink: "/shop",
    panelBg: "hsl(193 25% 94%)",
    accentColor: "hsl(193 35% 38%)",
  },
  {
    img: heroBanner1,
    eyebrow: "",
    title: "Children of",
    titleAccent: "Mother Earth",
    subtitle: "ORGANIC COLLECTION",
    cta: "Explore Collection",
    ctaLink: "/shop",
    panelBg: "hsl(160 25% 94%)",
    accentColor: "hsl(175 30% 35%)",
  },
  {
    img: heroBanner2,
    eyebrow: "",
    title: "Quietly",
    titleAccent: "Luxurious",
    subtitle: "MINI WARDROBE",
    cta: "Shop the Look",
    ctaLink: "/shop",
    panelBg: "hsl(43 50% 95%)",
    accentColor: "hsl(193 28% 30%)",
  },
  {
    img: heroBanner3,
    eyebrow: "Newborn Essentials",
    title: "Hello,",
    titleAccent: "Little One",
    subtitle: "NEWBORN EDIT",
    cta: "Discover Now",
    ctaLink: "/shop",
    panelBg: "hsl(43 60% 96%)",
    accentColor: "hsl(193 32% 42%)",
  },
];

const SLIDE_DURATION = 3000;

/* ── Decorative SVGs ────────────────────────────────────── */
const SunDecor = ({ className, color }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="8" fill={color || "hsl(193 28% 50%)"} opacity="0.8" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <line
        key={angle}
        x1="30"
        y1="30"
        x2={30 + 18 * Math.cos((angle * Math.PI) / 180)}
        y2={30 + 18 * Math.sin((angle * Math.PI) / 180)}
        stroke={color || "hsl(193 28% 50%)"}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    ))}
  </svg>
);

const HeartDecor = ({ className, color }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color || "hsl(193 30% 45%)"} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const FloralDecor = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="6" fill="hsl(43 65% 55%)" opacity="0.7" />
    <path d="M40 10 C45 25, 55 30, 40 40 C25 30, 35 25, 40 10Z" fill="hsl(193 28% 50%)" opacity="0.4" />
    <path d="M40 70 C45 55, 55 50, 40 40 C25 50, 35 55, 40 70Z" fill="hsl(193 28% 50%)" opacity="0.4" />
    <path d="M10 40 C25 35, 30 25, 40 40 C30 55, 25 45, 10 40Z" fill="hsl(175 30% 60%)" opacity="0.4" />
    <path d="M70 40 C55 35, 50 25, 40 40 C50 55, 55 45, 70 40Z" fill="hsl(175 30% 60%)" opacity="0.4" />
  </svg>
);

/* ── Hero component ─────────────────────────────────────── */
const Hero = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number>();

  const goTo = useCallback(
    (idx: number) => {
      setProgress(0);
      progressRef.current = 0;
      setActive(idx);
    },
    []
  );

  const go = useCallback(
    (dir: number) => {
      goTo((active + dir + slides.length) % slides.length);
    },
    [active, goTo]
  );

  /* auto-play with smooth progress */
  useEffect(() => {
    if (isPaused) return;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / SLIDE_DURATION, 1);
      progressRef.current = pct;
      setProgress(pct);

      if (pct >= 1) {
        setActive((a) => (a + 1) % slides.length);
        setProgress(0);
        progressRef.current = 0;
        start = null;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, isPaused]);

  /* touch / swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) go(diff > 0 ? 1 : -1);
  };

  return (
    <section
      id="hero-banner"
      className="relative w-full overflow-hidden mt-16 md:mt-20"
      style={{ height: "min(85vh, 640px)", minHeight: "460px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ─── Slides ─── */}
      {slides.map((s, i) => {
        const isActive = i === active;

        return (
          <div
            key={i}
            className={`absolute inset-0 flex transition-opacity duration-700 ${
              isActive ? "opacity-100 z-[2]" : "opacity-0 pointer-events-none z-[1]"
            }`}
          >
            {/* Left — Image */}
            <div className="relative w-full md:w-[58%] h-full overflow-hidden">
              <img
                src={s.img}
                alt={s.title}
                width={1200}
                height={800}
                loading={i === 0 ? "eager" : "lazy"}
                className={`w-full h-full object-cover transition-transform duration-6000 ease-out ${
                  isActive ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            {/* Right — Content Panel (desktop) */}
            <div
              className="hidden md:flex w-[42%] h-full flex-col items-center justify-center px-10 lg:px-14 relative overflow-hidden"
              style={{ background: s.panelBg }}
            >
              {/* Decorative elements */}
              <SunDecor
                className="absolute top-10 right-10 w-12 h-12 animate-[spin_25s_linear_infinite] opacity-60"
                color={s.accentColor}
              />
              <FloralDecor className="absolute bottom-12 left-6 w-14 h-14 opacity-30" />
              <FloralDecor className="absolute top-16 left-10 w-10 h-10 opacity-20 rotate-45" />

              <div className={`text-center ${isActive ? "animate-fade-in" : ""}`}>
                {s.eyebrow && (
                  <p
                    className="text-xs tracking-[0.25em] uppercase font-sans font-medium mb-4 opacity-60"
                    style={{ color: "hsl(193 28% 22%)" }}
                  >
                    {s.eyebrow}
                  </p>
                )}

                <h2
                  className="font-serif italic leading-[0.9] mb-2"
                  style={{
                    color: s.accentColor,
                    fontWeight: 400,
                    fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
                  }}
                >
                  {s.title}
                  {s.titleAccent && (
                    <>
                      <br />
                      <span className="block mt-1">{s.titleAccent}</span>
                    </>
                  )}
                </h2>

                <HeartDecor className="w-5 h-5 mx-auto my-5 opacity-60" color={s.accentColor} />

                {s.subtitle && (
                  <p
                    className="text-sm md:text-base lg:text-lg tracking-[0.35em] uppercase font-sans font-semibold mb-8"
                    style={{ color: "hsl(193 30% 18%)" }}
                  >
                    {s.subtitle}
                  </p>
                )}

                <Button
                  size="lg"
                  className="rounded-full px-10 h-12 text-sm font-sans uppercase tracking-[0.15em] transition-all duration-300 hover:opacity-90 hover:scale-105 group shadow-lg"
                  style={{
                    backgroundColor: s.accentColor,
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => (window.location.href = s.ctaLink)}
                >
                  {s.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Mobile overlay fallback */}
            <div className="absolute inset-0 md:hidden flex items-end">
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="relative z-10 p-6 pb-20 text-white">
                <h2 className="font-serif italic text-4xl leading-[0.95] mb-2">
                  {s.title}{" "}
                  {s.titleAccent && <span className="block">{s.titleAccent}</span>}
                </h2>
                {s.subtitle && (
                  <p className="text-xs tracking-[0.3em] uppercase font-semibold mt-3 mb-5 opacity-90">
                    {s.subtitle}
                  </p>
                )}
                <Button
                  size="lg"
                  className="rounded-full bg-white text-foreground hover:bg-white/90 px-8 h-11 text-sm"
                  onClick={() => (window.location.href = s.ctaLink)}
                >
                  {s.cta}
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {/* ─── Progress Dots ─── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative group"
            aria-label={`Go to slide ${i + 1}`}
          >
            {/* track */}
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                i === active ? "w-10 bg-white/40" : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
            />
            {/* fill — only on active */}
            {i === active && (
              <div
                className="absolute top-0 left-0 h-1 rounded-full bg-white transition-none"
                style={{ width: `${progress * 100}%` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
