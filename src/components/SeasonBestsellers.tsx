import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, type Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { toast } from "@/hooks/use-toast";

/* ─── Season config ─── */
const seasons = [
  { key: "summer", label: "Summer Edit", icon: "☀️", accent: "hsl(45 90% 55%)" },
  { key: "monsoon", label: "Monsoon Edit", icon: "🌧️", accent: "hsl(205 65% 55%)" },
  { key: "winter", label: "Winter Edit", icon: "❄️", accent: "hsl(265 50% 65%)" },
  { key: "festive", label: "Festive Edit", icon: "✨", accent: "hsl(350 60% 60%)" },
] as const;

type SeasonKey = (typeof seasons)[number]["key"];

/*
  Map products to seasons in a round-robin fashion so every tab has content.
  In production you'd have a `season` field on each product.
*/
const seasonProducts: Record<SeasonKey, Product[]> = {
  summer: products.filter((p) => p.tag === "Summer" || p.tag === "New").slice(0, 8),
  monsoon: [...products].filter((_, i) => i >= 2 && i <= 7).slice(0, 6),
  winter: [...products].reverse().slice(0, 6),
  festive: products.filter((p) => p.tag === "Bestseller" || p.tag === "Limited" || p.tag === "New").slice(0, 6),
};

/* ─── Product Card ─── */
const ProductCard = ({ p, index }: { p: Product; index: number }) => {
  const { add } = useCart();

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add({ productId: p.id, size: p.sizes[0], color: p.colors[0].name, qty: 1 });
    toast({ title: "Added to bag", description: p.name });
  };

  return (
    <Link
      to={`/product/${p.slug}`}
      className="sb-card group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="sb-card-img">
        <img src={p.img} alt={p.name} loading="lazy" />
        {p.tag && <span className="sb-tag">{p.tag}</span>}
        <button
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="sb-wish"
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className="sb-quick-add">
          <Button
            size="sm"
            className="w-full rounded-full bg-background text-foreground hover:bg-background/90 shadow-soft"
            onClick={quickAdd}
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-2" />
            Add to bag
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="sb-card-info">
        <div className="sb-rating">
          <Star className="h-3 w-3 fill-foreground text-foreground" />
          <span>{p.rating}</span>
          <span className="sb-review-count">({p.reviews})</span>
        </div>
        <h3 className="sb-card-name">{p.name}</h3>
        <div className="sb-price-row">
          <span className="sb-price">₹{p.price}</span>
          <span className="sb-og-price">₹{Math.round(p.price * 1.4)}</span>
          <span className="sb-discount">30% off</span>
        </div>
        {/* Color swatches */}
        <div className="sb-swatches">
          {p.colors.slice(0, 3).map((c) => (
            <span
              key={c.name}
              className="sb-swatch"
              style={{ background: c.hex }}
              title={c.name}
            />
          ))}
          {p.colors.length > 3 && (
            <span className="sb-swatch-more">+{p.colors.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ─── Main Component ─── */
const SeasonBestsellers = () => {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>("summer");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Intersection observer for entrance animation */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const activeData = seasonProducts[activeSeason];
  const activeAccent = seasons.find((s) => s.key === activeSeason)?.accent ?? "";

  /* Scroll arrows for mobile horizontal scroll */
  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="season-bestsellers" className="sb-section">
      {/* Background decoration */}
      <div className="sb-bg-blob sb-bg-blob-1" />
      <div className="sb-bg-blob sb-bg-blob-2" />

      <div
        className="container mx-auto"
        style={{
          position: "relative",
          zIndex: 2,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* ── Header ── */}
        <div className="sb-header">
          <div>
            <div className="sb-label">
              <Flame className="h-3.5 w-3.5" style={{ color: activeAccent }} />
              <span>Trending this season</span>
            </div>
            <h2 className="sb-title">
              Season <em>Bestsellers</em>
            </h2>
          </div>
          <Link to="/shop">
            <Button variant="ghost" className="rounded-full story-link">
              Shop all bestsellers
            </Button>
          </Link>
        </div>

        {/* ── Season Tabs ── */}
        <div className="sb-tabs-wrapper">
          <div className="sb-tabs">
            {seasons.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSeason(s.key)}
                className={`sb-tab ${activeSeason === s.key ? "sb-tab-active" : ""}`}
                style={
                  activeSeason === s.key
                    ? { borderColor: s.accent, color: "hsl(25 20% 18%)" }
                    : {}
                }
              >
                <span className="sb-tab-icon">{s.icon}</span>
                <span className="sb-tab-label">{s.label}</span>
              </button>
            ))}
          </div>
        </div>


        {/* ── Product Grid / Scroller ── */}
        <div className="sb-grid-wrapper">
          {/* Mobile scroll arrows */}
          <button className="sb-arrow sb-arrow-left" onClick={() => scroll(-1)} aria-label="Scroll left">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="sb-arrow sb-arrow-right" onClick={() => scroll(1)} aria-label="Scroll right">
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="sb-grid" ref={scrollRef} key={activeSeason}>
            {activeData.map((p, i) => (
              <ProductCard key={`${activeSeason}-${p.id}`} p={p} index={i} />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="sb-bottom-cta">
          <Link to="/shop">
            <Button
              className="rounded-full px-8 py-3 text-sm font-medium"
              style={{ background: activeAccent, color: "#fff" }}
            >
              Explore Full {seasons.find((s) => s.key === activeSeason)?.label} →
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        /* ── Section ── */
        .sb-section {
          position: relative;
          padding: 80px 0 90px;
          overflow: hidden;
          background: hsl(36 33% 97%);
        }

        /* Background blobs */
        .sb-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.35;
        }
        .sb-bg-blob-1 {
          width: 500px; height: 500px;
          top: -150px; right: -100px;
          background: hsl(350 60% 90%);
        }
        .sb-bg-blob-2 {
          width: 400px; height: 400px;
          bottom: -120px; left: -80px;
          background: hsl(205 60% 90%);
        }

        /* ── Header ── */
        .sb-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .sb-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: hsl(25 12% 50%);
          font-family: Inter, sans-serif;
          margin-bottom: 6px;
        }
        .sb-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(28px, 5vw, 48px);
          color: hsl(25 20% 18%);
          line-height: 1.15;
        }
        .sb-title em {
          font-style: italic;
          font-weight: 400;
        }

        /* ── Tabs ── */
        .sb-tabs-wrapper {
          margin-bottom: 20px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .sb-tabs-wrapper::-webkit-scrollbar { display: none; }
        .sb-tabs {
          display: flex;
          gap: 10px;
          min-width: max-content;
        }
        .sb-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 50px;
          border: 2px solid hsl(30 20% 88%);
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
          font-family: Inter, sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: hsl(25 12% 45%);
          white-space: nowrap;
        }
        .sb-tab:hover {
          background: rgba(255,255,255,0.85);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .sb-tab-active {
          background: rgba(255,255,255,0.9) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          font-weight: 600;
          border-width: 2px;
        }
        .sb-tab-icon { font-size: 16px; line-height: 1; }
        .sb-tab-label { line-height: 1; }



        /* ── Grid / Scroller ── */
        .sb-grid-wrapper {
          position: relative;
        }
        .sb-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .sb-arrow {
          display: none;
        }

        /* ── Product Card ── */
        .sb-card {
          display: block;
          text-decoration: none;
          color: inherit;
          animation: sb-fade-in 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes sb-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sb-card-img {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background: hsl(35 30% 92%);
          aspect-ratio: 3/4;
          margin-bottom: 14px;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.5s ease;
        }
        .sb-card:hover .sb-card-img {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px -12px rgba(0,0,0,0.15);
        }
        .sb-card-img img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 1.2s ease-out;
        }
        .sb-card:hover .sb-card-img img {
          transform: scale(1.08);
        }
        .sb-tag {
          position: absolute;
          top: 12px; left: 12px;
          padding: 4px 12px;
          border-radius: 50px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          font-family: Inter, sans-serif;
          color: hsl(25 20% 25%);
        }
        .sb-wish {
          position: absolute;
          top: 12px; right: 12px;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: translateY(-4px);
          transition: all 0.4s ease;
        }
        .sb-card:hover .sb-wish {
          opacity: 1;
          transform: translateY(0);
        }
        .sb-wish:hover {
          transform: scale(1.15) !important;
          background: rgba(255,255,255,0.9);
        }
        .sb-quick-add {
          position: absolute;
          inset: auto 12px 12px 12px;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .sb-card:hover .sb-quick-add {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Card info ── */
        .sb-card-info {
          padding: 0 4px;
        }
        .sb-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: hsl(25 12% 45%);
          font-family: Inter, sans-serif;
          margin-bottom: 6px;
        }
        .sb-review-count {
          color: hsl(25 10% 60%);
          font-size: 11px;
        }
        .sb-card-name {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 17px;
          line-height: 1.3;
          color: hsl(25 20% 18%);
          margin-bottom: 6px;
        }
        .sb-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .sb-price {
          font-family: Inter, sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: hsl(25 20% 18%);
        }
        .sb-og-price {
          font-family: Inter, sans-serif;
          font-size: 13px;
          color: hsl(25 10% 60%);
          text-decoration: line-through;
        }
        .sb-discount {
          font-family: Inter, sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: hsl(140 50% 38%);
          background: hsl(140 50% 95%);
          padding: 2px 8px;
          border-radius: 20px;
        }
        .sb-swatches {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sb-swatch {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .sb-swatch:hover { transform: scale(1.25); }
        .sb-swatch-more {
          font-size: 10px;
          color: hsl(25 10% 50%);
          font-family: Inter, sans-serif;
        }

        /* ── Bottom CTA ── */
        .sb-bottom-cta {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
        .sb-bottom-cta button {
          transition: all 0.35s ease;
        }
        .sb-bottom-cta button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        /* ── Tablet ── */
        @media (max-width: 1024px) and (min-width: 768px) {
          .sb-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .sb-section { padding: 50px 0 60px; }

          .sb-header { margin-bottom: 20px; }
          .sb-header > a { display: none; }

          .sb-tabs { gap: 8px; }
          .sb-tab { padding: 8px 14px; font-size: 12px; }
          .sb-tab-icon { font-size: 14px; }



          /* Horizontal scroller on mobile */
          .sb-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 14px;
            padding: 4px 0 12px;
            scrollbar-width: none;
          }
          .sb-grid::-webkit-scrollbar { display: none; }
          .sb-card {
            flex: 0 0 72%;
            min-width: 0;
            scroll-snap-align: start;
          }
          .sb-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            width: 36px; height: 36px;
            border-radius: 50%;
            background: rgba(255,255,255,0.85);
            backdrop-filter: blur(6px);
            border: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .sb-arrow:hover {
            background: white;
            box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          }
          .sb-arrow-left { left: -4px; }
          .sb-arrow-right { right: -4px; }

          .sb-bottom-cta { margin-top: 28px; }
        }
      `}</style>
    </section>
  );
};

export default SeasonBestsellers;
