import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import heroBannerNew1 from "@/assets/hero-banner-new-1.jpg";
import heroBannerNew2 from "@/assets/hero-banner-new-2.jpg";
import heroBannerNew3 from "@/assets/hero-banner-new-3.jpg";

interface Slide {
  img: string;
  title: string;
  ctaLink: string;
  fitClass: string;
  bgClass: string;
}

const slides: Slide[] = [
  {
    img: heroBannerNew1,
    title: "Little Dreams in Style",
    ctaLink: "/shop",
    fitClass: "object-cover object-top",
    bgClass: "bg-[#cbe3fc]", // Beautiful matching sky-blue background for Slide 1
  },
  {
    img: heroBannerNew2,
    title: "Tiny Fashion, Big Smiles",
    ctaLink: "/shop",
    fitClass: "object-cover",
    bgClass: "bg-background",
  },
  {
    img: heroBannerNew3,
    title: "Tiny Trends for Little Stars",
    ctaLink: "/shop",
    fitClass: "object-cover",
    bgClass: "bg-[#e6f1fc]",
  },
];

const SLIDE_DURATION = 4000;

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

  /* Auto-play slider with frame-perfect progress indicator */
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

  /* Swipe support for mobile users */
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
  };

  return (
    <section
      id="hero-banner"
      className="relative w-full overflow-hidden mt-16 md:mt-20 aspect-[1600/878] bg-secondary/20 shadow-soft"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ─── Slides ─── */}
      {slides.map((s, i) => {
        const isActive = i === active;

        return (
          <Link
            key={i}
            to={s.ctaLink}
            className={`absolute inset-0 block transition-opacity duration-1000 ease-in-out ${s.bgClass} ${
              isActive ? "opacity-100 z-[2]" : "opacity-0 pointer-events-none z-[1]"
            }`}
          >
            <div className="w-full h-full overflow-hidden relative">
              <img
                src={s.img}
                alt={s.title}
                loading={i === 0 ? "eager" : "lazy"}
                className={`w-full h-full ${s.fitClass} transition-transform duration-6000 ease-out ${
                  isActive ? "scale-103" : "scale-100"
                }`}
              />
              {/* Soft overlay to give high-quality look */}
              <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
            </div>
          </Link>
        );
      })}

      {/* ─── Progress Dots ─── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative group py-2"
            aria-label={`Go to slide ${i + 1}`}
          >
            {/* track */}
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-10 bg-white/40" : "w-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
            {/* fill — active progress */}
            {i === active && (
              <div
                className="absolute top-2 left-0 h-1.5 rounded-full bg-white transition-none"
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
