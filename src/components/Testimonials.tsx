import { useState, useEffect, useRef, useCallback } from "react";

const testimonials = [
  {
    id: 1,
    quote: "Mom says it's sustainable, I said it's comfy!",
    name: "Dhruvi",
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=650&fit=crop&crop=faces",
  },
  {
    id: 2,
    quote: "I choose comfort for my child and care for tomorrow. Made with the same care I give my Child",
    name: "Nikita",
    city: "Kolkata",
    image: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=500&h=650&fit=crop&crop=faces",
  },
  {
    id: 3,
    quote: "The softest fabrics — my little one won't take it off. Absolute favourite!",
    name: "Priya",
    city: "Delhi",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&h=650&fit=crop&crop=center",
  },
  {
    id: 4,
    quote: "Finally, kids' fashion that's gentle on the planet and on my baby's skin.",
    name: "Meera",
    city: "Bengaluru",
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500&h=650&fit=crop&crop=faces",
  },
  {
    id: 5,
    quote: "I love how every piece tells a story. BugyBoo makes childhood magical!",
    name: "Ananya",
    city: "Pune",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=500&h=650&fit=crop&crop=faces",
  },
  {
    id: 6,
    quote: "Sustainable, stylish & so comfortable — everything a mom could wish for.",
    name: "Ritu",
    city: "Jaipur",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=650&fit=crop&crop=faces",
  },
];

/* ─── SVG Decorations ─── */
const PaperPlane = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg style={{ pointerEvents: "none", ...style }} width="44" height="44" viewBox="0 0 48 48" fill="none">
    <path d="M6 8L42 24L6 40V26L30 24L6 22V8Z" fill="hsl(193 30% 60%)" opacity="0.7" />
    <path d="M6 8L42 24L6 40V26L30 24L6 22V8Z" stroke="hsl(193 28% 45%)" strokeWidth="1.5" fill="none" />
  </svg>
);

const Butterfly = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg style={{ pointerEvents: "none", ...style }} width="32" height="32" viewBox="0 0 36 36" fill="none">
    <path d="M18 8C14 4 6 3 4 10C2 17 10 20 18 18C26 20 34 17 32 10C30 3 22 4 18 8Z" fill="hsl(193 30% 70%)" opacity="0.6" />
    <path d="M18 18C14 22 8 30 12 32C16 34 18 26 18 18C18 26 20 34 24 32C28 30 22 22 18 18Z" fill="hsl(175 30% 72%)" opacity="0.5" />
  </svg>
);

const Flower = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg style={{ pointerEvents: "none", ...style }} width="28" height="28" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="10" r="5" fill="hsl(43 60% 65%)" opacity="0.6" />
    <circle cx="10" cy="16" r="5" fill="hsl(43 60% 65%)" opacity="0.5" />
    <circle cx="22" cy="16" r="5" fill="hsl(43 60% 65%)" opacity="0.5" />
    <circle cx="16" cy="22" r="5" fill="hsl(43 60% 65%)" opacity="0.6" />
    <circle cx="16" cy="16" r="3.5" fill="hsl(193 28% 45%)" />
  </svg>
);

const Sparkle = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg style={{ pointerEvents: "none", ...style }} width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" fill="hsl(193 28% 55%)" opacity="0.5" />
  </svg>
);

/* ─── Mobile Slide Card ─── */
const MobileSlideCard = ({ t }: { t: typeof testimonials[0] }) => (
  <div className="tm-mobile-card">
    <div className="tm-mobile-card-img-wrap">
      <img src={t.image} alt={`${t.name}'s child`} loading="lazy" />
    </div>
    <div className="tm-mobile-card-body">
      <p className="tm-mobile-quote">"{t.quote}"</p>
      <p className="tm-mobile-author">— {t.name}, {t.city}</p>
    </div>
  </div>
);

/* ─── Main Component ─── */
const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* Auto-slide on mobile */
  useEffect(() => {
    if (!isMobile) return;
    const id = setInterval(() => setActiveSlide(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, [isMobile]);

  /* Touch swipe handlers */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setActiveSlide(p => Math.min(p + 1, testimonials.length - 1));
      else setActiveSlide(p => Math.max(p - 1, 0));
    }
  }, [touchStart, touchEnd]);

  const rotations = ["-1.5deg", "1deg", "-0.8deg", "1.5deg", "-1deg", "0.8deg"];

  return (
    <section
      ref={sectionRef}
      id="testimonials-section"
      className="tm-section"
    >
      {/* Background washes */}
      <div className="tm-wash tm-wash-top" />
      <div className="tm-wash tm-wash-bottom" />

      {/* Decorations - hidden on mobile */}
      <div className="tm-decos">
        <PaperPlane style={{ position: "absolute", top: "8%", right: "12%", transform: "rotate(-15deg)", opacity: isVisible ? 0.7 : 0, transition: "opacity 1s ease 0.3s" }} />
        <PaperPlane style={{ position: "absolute", bottom: "18%", left: "8%", transform: "rotate(25deg) scaleX(-1)", opacity: isVisible ? 0.5 : 0, transition: "opacity 1s ease 0.6s" }} />
        <Butterfly style={{ position: "absolute", top: "22%", left: "42%", opacity: isVisible ? 0.6 : 0, transition: "opacity 1.2s ease 0.5s", animation: isVisible ? "float 5s ease-in-out infinite" : "none" }} />
        <Butterfly style={{ position: "absolute", bottom: "28%", right: "6%", opacity: isVisible ? 0.4 : 0, transform: "rotate(20deg)", transition: "opacity 1.2s ease 0.8s" }} />
        <Flower style={{ position: "absolute", bottom: "12%", left: "15%", opacity: isVisible ? 0.5 : 0, transition: "opacity 1s ease 0.7s" }} />
        <Flower style={{ position: "absolute", top: "10%", left: "25%", opacity: isVisible ? 0.4 : 0, transform: "rotate(45deg) scale(0.8)", transition: "opacity 1s ease 0.4s" }} />
        <Sparkle style={{ position: "absolute", top: "15%", right: "30%", opacity: isVisible ? 0.5 : 0, transition: "opacity 1s ease 0.2s" }} />
        <Sparkle style={{ position: "absolute", bottom: "25%", left: "50%", opacity: isVisible ? 0.4 : 0, transform: "scale(1.3)", transition: "opacity 1s ease 0.9s" }} />
      </div>

      {/* ─── MOBILE: Swipeable Carousel ─── */}
      {isMobile && (
        <div className="tm-mobile-wrapper" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease" }}>
          {/* Community CTA for mobile */}
          <div className="tm-mobile-cta">
            <p className="tm-cta-label">Join our everyday</p>
            <h3 className="tm-cta-title">Bugy-ventures</h3>
            <p className="tm-cta-desc">
              Share your <strong>#BugyBoo</strong> moments with us. Tag <strong>@bugyboo</strong> for a chance to be featured.
            </p>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="tm-mobile-slider"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="tm-mobile-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="tm-mobile-slide">
                  <MobileSlideCard t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="tm-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`tm-dot ${i === activeSlide ? "tm-dot-active" : ""}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── DESKTOP: Scrapbook Grid ─── */}
      {!isMobile && (
        <div className="container mx-auto px-4" style={{ position: "relative", zIndex: 2 }}>
          {/* Row 1 */}
          <div className="tm-row" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(0.22,1,0.36,1)" }}>
            {/* CTA */}
            <div className="tm-cell">
              <div className="tm-cta-card">
                <p className="tm-cta-label">Join our everyday</p>
                <h3 className="tm-cta-title">Bugy-ventures</h3>
                <p className="tm-cta-desc">Share your <strong>#BugyBoo</strong> and <strong>#BugyBooKids</strong> moments with us. Tag <strong>@bugyboo</strong> for a chance to be featured.</p>
              </div>
            </div>
            {/* Large image */}
            <div className="tm-cell">
              <div className="tm-photo" style={{ transform: `rotate(${rotations[0]})` }}>
                <img src={testimonials[0].image} alt="Child in BugyBoo" loading="lazy" />
              </div>
            </div>
            {/* Quote + small image */}
            <div className="tm-cell tm-cell-stack">
              <div className="tm-quote-card tm-quote-cream">
                <p className="tm-quote">"{testimonials[0].quote}"</p>
                <p className="tm-author">— {testimonials[0].name}, {testimonials[0].city}</p>
              </div>
              <div className="tm-photo tm-photo-sm" style={{ transform: `rotate(${rotations[1]})` }}>
                <img src={testimonials[1].image} alt="Sustainable fashion" loading="lazy" />
              </div>
            </div>
            {/* Right images */}
            <div className="tm-cell tm-cell-stack tm-cell-end">
              <div className="tm-photo tm-photo-md" style={{ transform: `rotate(${rotations[2]})` }}>
                <img src={testimonials[2].image} alt="Kids outdoors" loading="lazy" />
              </div>
              <div className="tm-photo tm-photo-xs" style={{ transform: `rotate(${rotations[3]})` }}>
                <img src={testimonials[3].image} alt="Comfortable clothing" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="tm-row tm-row-2" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s" }}>
            <div className="tm-cell">
              <div className="tm-cta-card">
                <p className="tm-cta-label">Join our everyday</p>
                <h3 className="tm-cta-title">Bugy-ventures</h3>
                <p className="tm-cta-desc">Share your <strong>#BugyBoo</strong> and <strong>#BugyBooKids</strong> moments with us. Tag <strong>@bugyboo</strong> for a chance to be featured.</p>
              </div>
            </div>
            <div className="tm-cell">
              <div className="tm-quote-card tm-quote-pink">
                <p className="tm-quote">"{testimonials[1].quote}"</p>
                <p className="tm-author">— {testimonials[1].name}, {testimonials[1].city}</p>
              </div>
            </div>
            <div className="tm-cell" style={{ position: "relative" }}>
              <div className="tm-photo" style={{ transform: `rotate(${rotations[4]})` }}>
                <img src={testimonials[4].image} alt="Matching outfits" loading="lazy" />
              </div>
              <div className="tm-quote-card tm-quote-cream tm-quote-overlap">
                <p className="tm-quote">"{testimonials[4].quote}"</p>
                <p className="tm-author">— {testimonials[4].name}, {testimonials[4].city}</p>
              </div>
            </div>
            <div className="tm-cell tm-cell-stack tm-cell-end">
              <div className="tm-quote-card">
                <p className="tm-quote">"{testimonials[5].quote}"</p>
                <p className="tm-author">— {testimonials[5].name}, {testimonials[5].city}</p>
              </div>
              <div className="tm-photo tm-photo-md" style={{ transform: `rotate(${rotations[5]})` }}>
                <img src={testimonials[5].image} alt="Eco-friendly outfit" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tm-section {
          position: relative;
          overflow: hidden;
          padding: 80px 0 100px;
          background: transparent;
        }
        .tm-wash { position: absolute; left: 0; right: 0; height: 180px; pointer-events: none; }
        .tm-wash-top { top: 0; background: linear-gradient(180deg, hsl(193 25% 88% / 0.25) 0%, transparent 100%); }
        .tm-wash-bottom { bottom: 0; background: linear-gradient(0deg, hsl(193 25% 88% / 0.2) 0%, transparent 100%); }
        .tm-decos { display: block; }

        /* ── Desktop Grid ── */
        .tm-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1.1fr 0.9fr;
          gap: 24px;
          align-items: end;
          margin-bottom: 40px;
        }
        .tm-row-2 { align-items: start; }
        .tm-cell { display: flex; flex-direction: column; gap: 16px; }
        .tm-cell-stack { gap: 14px; }
        .tm-cell-end { align-items: flex-end; }

        .tm-cta-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          padding: 28px 24px;
          border: 1px solid rgba(255,255,255,0.4);
          max-width: 260px;
        }
        .tm-cta-label {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
          color: hsl(193 15% 45%); margin-bottom: 4px; font-family: Inter, sans-serif;
        }
        .tm-cta-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 26px; font-weight: 600; font-style: italic;
          color: hsl(193 28% 22%); margin-bottom: 12px; line-height: 1.2;
        }
        .tm-cta-desc {
          font-size: 13px; line-height: 1.65; color: hsl(193 12% 40%);
          font-family: Inter, sans-serif;
        }

        .tm-photo {
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 8px 36px rgba(0,0,0,0.08);
          border: 4px solid white;
        }
        .tm-photo img { width: 100%; height: 360px; object-fit: cover; display: block; }
        .tm-photo-sm img { height: 160px; }
        .tm-photo-md img { height: 200px; }
        .tm-photo-xs img { height: 140px; }
        .tm-photo-sm { max-width: 200px; border-width: 3px; border-radius: 14px; }
        .tm-photo-md { width: 85%; border-width: 3px; border-radius: 14px; }
        .tm-photo-xs { width: 70%; border-width: 3px; border-radius: 12px; }

        .tm-quote-card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(6px);
          border-radius: 16px;
          padding: 22px 20px 16px;
          max-width: 280px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.5);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
        }
        .tm-quote-card:hover {
          transform: translateY(-4px) rotate(0deg) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
        }
        .tm-quote-cream { background: rgba(253,248,237,0.85); }
        .tm-quote-pink { background: rgba(200,228,235,0.55); }
        .tm-quote-overlap {
          position: absolute; bottom: -20px; left: -30px; z-index: 3;
        }
        .tm-quote {
          font-family: "Playfair Display", Georgia, serif;
          font-style: italic; font-size: 15px; line-height: 1.6;
          color: hsl(193 25% 22%); margin-bottom: 10px;
        }
        .tm-author {
          font-size: 13px; font-weight: 500; color: hsl(193 18% 38%);
          font-family: Inter, sans-serif;
        }

        /* ── Tablet ── */
        @media (max-width: 1024px) and (min-width: 768px) {
          .tm-row { grid-template-columns: 1fr 1fr; }
        }

        /* ─── MOBILE CAROUSEL ─── */
        .tm-mobile-wrapper {
          position: relative; z-index: 2;
          padding: 0 20px;
        }
        .tm-mobile-cta {
          text-align: center;
          margin-bottom: 28px;
          padding: 24px 20px;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.4);
        }
        .tm-mobile-slider {
          overflow: hidden;
          border-radius: 24px;
          touch-action: pan-y;
        }
        .tm-mobile-track {
          display: flex;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .tm-mobile-slide {
          flex: 0 0 100%;
          min-width: 0;
          padding: 0 4px;
          box-sizing: border-box;
        }
        .tm-mobile-card {
          background: rgba(255,255,255,0.8);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 6px 30px rgba(0,0,0,0.07);
          border: 1px solid rgba(255,255,255,0.5);
        }
        .tm-mobile-card-img-wrap {
          width: 100%;
          height: 280px;
          overflow: hidden;
        }
        .tm-mobile-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .tm-mobile-card-body {
          padding: 22px 20px 20px;
        }
        .tm-mobile-quote {
          font-family: "Playfair Display", Georgia, serif;
          font-style: italic;
          font-size: 16px;
          line-height: 1.55;
          color: hsl(193 25% 20%);
          margin-bottom: 12px;
        }
        .tm-mobile-author {
          font-size: 13px;
          font-weight: 500;
          color: hsl(193 15% 40%);
          font-family: Inter, sans-serif;
        }

        /* Dots */
        .tm-dots {
          display: flex; justify-content: center; gap: 8px;
          margin-top: 20px;
        }
        .tm-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: hsl(193 22% 30%); border: none; padding: 0;
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .tm-dot-active {
          width: 28px; border-radius: 4px;
          background: hsl(193 28% 34%);
        }

        @media (max-width: 767px) {
          .tm-section { padding: 50px 0 60px; }
          .tm-decos { display: none; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
