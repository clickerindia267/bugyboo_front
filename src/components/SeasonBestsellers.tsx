import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type PublicProduct } from "@/lib/api";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";

/* ─── Season config ─── */
const seasons = [
  { key: "summer", label: "Summer Edit", icon: "☀️", accent: "hsl(193 32% 42%)" },
  { key: "monsoon", label: "Monsoon Edit", icon: "🌧️", accent: "hsl(193 40% 50%)" },
  { key: "winter", label: "Winter Edit", icon: "❄️", accent: "hsl(193 25% 30%)" },
  { key: "festive", label: "Festive Edit", icon: "✨", accent: "hsl(175 30% 38%)" },
] as const;

type SeasonKey = (typeof seasons)[number]["key"];

/* Distribute products across seasons in a round-robin fashion */
const distributeProducts = (products: PublicProduct[]): Record<SeasonKey, PublicProduct[]> => {
  const active = products.filter((p) => !p.isPaused);
  const result: Record<SeasonKey, PublicProduct[]> = {
    summer: [],
    monsoon: [],
    winter: [],
    festive: [],
  };
  const keys: SeasonKey[] = ["summer", "monsoon", "winter", "festive"];
  active.forEach((p, i) => {
    result[keys[i % keys.length]].push(p);
  });
  // Ensure each season has products – fill empty ones from the full list
  keys.forEach((key) => {
    if (result[key].length === 0 && active.length > 0) {
      result[key] = active.slice(0, Math.min(4, active.length));
    }
  });
  return result;
};

/* ─── Product Card ─── */
const ProductCard = ({ p, index }: { p: PublicProduct; index: number }) => {
  const { add } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const quickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!p.variants || p.variants.length === 0) {
      toast({ title: "No variants available", description: "This product is not available", variant: "destructive" });
      return;
    }
    const defaultVariant = p.variants[0];
    try {
      await add(p._id, 1, defaultVariant.ageGroup, defaultVariant.sellPrice);
    } catch (error) {
      toast({ title: "Failed to add to bag", description: "Please try again", variant: "destructive" });
    }
  };

  const discount = p.variants?.some(v => v.basePrice > v.sellPrice) ? true : false;

  return (
    <Link
      to={`/product/${p._id}`}
      className="sb-card group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="sb-card-img">
        <img src={p.images?.[0] ?? ""} alt={p.name} loading="lazy" />
        {discount && <span className="sb-tag">Sale</span>}
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
            className="w-full rounded-full bg-[#3f646f] text-white hover:bg-[#3f646f]/90 shadow-soft"
            onClick={quickAdd}
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-2" />
            Add to bag
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="sb-card-info">
        <p className="text-[11px] text-muted-foreground mb-1">{p.category?.name}</p>
        <h3 className="sb-card-name">{p.name}</h3>
        <div className="sb-price-row">
          <span className="sb-price">Starting From ₹{Math.min(...(p.variants?.map(v => v.sellPrice) || [0]))}</span>
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

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const seasonProducts = distributeProducts(data?.data ?? []);

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
        className="container mx-auto px-4"
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
                     ? { borderColor: s.accent, color: "hsl(193 28% 18%)" }
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

          {isLoading ? (
            <div className="sb-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-[20px] aspect-[3/4] mb-3.5 shimmer" />
                  <div className="h-4 w-3/4 rounded shimmer mb-2" />
                  <div className="h-3 w-1/2 rounded shimmer" />
                </div>
              ))}
            </div>
          ) : (
            <div className="sb-grid" ref={scrollRef} key={activeSeason}>
              {activeData.map((p, i) => (
                <ProductCard key={`${activeSeason}-${p._id}`} p={p} index={i} />
              ))}
              {activeData.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-12">
                  Products coming soon for this season!
                </p>
              )}
            </div>
          )}
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
          background: transparent;
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
          background: hsl(193 30% 88%);
        }
        .sb-bg-blob-2 {
          width: 400px; height: 400px;
          bottom: -120px; left: -80px;
          background: hsl(175 30% 88%);
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
          color: hsl(193 18% 45%);
          font-family: Inter, sans-serif;
          margin-bottom: 6px;
        }
        .sb-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(28px, 5vw, 48px);
          color: hsl(193 30% 18%);
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
          border: 2px solid hsl(43 30% 87%);
          background: rgba(253,248,237,0.6);
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
          font-family: Inter, sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: hsl(193 15% 42%);
          white-space: nowrap;
        }
        .sb-tab:hover {
          background: rgba(255,255,255,0.85);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .sb-tab-active {
          background: rgba(253,248,237,0.9) !important;
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
          background: hsl(43 45% 92%);
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
          object-fit: contain; display: block;
          transition: transform 1.2s ease-out;
        }
        @media (min-width: 768px) {
          .sb-card-img img { object-fit: cover; }
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
          color: hsl(193 25% 22%);
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
        .sb-card-name {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 17px;
          line-height: 1.3;
          color: hsl(193 28% 18%);
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
          color: hsl(193 28% 18%);
        }
        .sb-og-price {
          font-family: Inter, sans-serif;
          font-size: 13px;
          color: hsl(193 12% 55%);
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
