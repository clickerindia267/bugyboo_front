import { useState, useEffect, useRef } from "react";
import { Leaf, Heart, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "50K+", label: "Happy Families" },
  { value: "100%", label: "Organic Fabrics" },
  { value: "15+", label: "Countries" },
  { value: "4.9★", label: "Avg Rating" },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainably Made",
    desc: "Every piece is crafted from GOTS-certified organic cotton and eco-friendly dyes — gentle on skin, kinder to the planet.",
    accent: "hsl(175 30% 42%)",
    bg: "hsl(175 25% 93%)",
  },
  {
    icon: Heart,
    title: "Designed with Love",
    desc: "Our in-house team designs every garment with the softness babies deserve and the style parents adore.",
    accent: "hsl(193 28% 40%)",
    bg: "hsl(193 25% 92%)",
  },
  {
    icon: Shield,
    title: "Safe & Certified",
    desc: "OEKO-TEX Standard 100 certified. No harmful chemicals, no compromises — just pure comfort for little ones.",
    accent: "hsl(193 35% 45%)",
    bg: "hsl(193 30% 93%)",
  },
  {
    icon: Sparkles,
    title: "Heirloom Quality",
    desc: "Built to last through siblings, seasons, and countless washes. Fashion that's meant to be passed down.",
    accent: "hsl(43 60% 48%)",
    bg: "hsl(43 50% 93%)",
  },
];

const CompanyOverview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="company-overview" className="co-section">
      {/* Background elements */}
      <div className="co-bg-blob co-bg-blob-1" />
      <div className="co-bg-blob co-bg-blob-2" />

      <div className="container mx-auto" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Hero Split: Image + Story ── */}
        <div
          className="co-hero"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Image Grid */}
          <div className="co-image-grid">
            <div className="co-img co-img-main">
              <img
                src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&h=750&fit=crop&crop=faces"
                alt="Happy child in BugyBoo clothing"
                loading="lazy"
              />
            </div>
            <div className="co-img co-img-top">
              <img
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&crop=faces"
                alt="Child playing outdoors"
                loading="lazy"
              />
            </div>
            <div className="co-img co-img-bottom">
              <img
                src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop&crop=center"
                alt="Sustainable kids fashion"
                loading="lazy"
              />
            </div>
          </div>

          {/* Story Content */}
          <div className="co-story">
            <p className="co-eyebrow">Our Story</p>
            <h2 className="co-title">
              Fashion that grows <em>with</em> your little ones
            </h2>
            <p className="co-desc">
              Born from a mother's wish for clothing that's as gentle as her touch, <strong>BugyBoo</strong> is
              India's homegrown luxury kids' fashion brand. We believe every child deserves clothes that are soft,
              safe, and sustainably made — without compromising on style.
            </p>
            <p className="co-desc">
              From our design studio in Mumbai, we craft each collection using organic fabrics, non-toxic dyes, and
              artisan techniques passed down through generations. Every stitch carries our promise: <em>comfort
                first, always.</em>
            </p>

            {/* Stats */}
            <div className="co-stats">
              {stats.map((s) => (
                <div key={s.label} className="co-stat">
                  <span className="co-stat-value">{s.value}</span>
                  <span className="co-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <Link to="/shop">
              <Button className="rounded-full px-8 py-3 text-sm font-medium mt-2">
                Explore Our Collection →
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Values Grid ── */}
        <div
          className="co-values"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s",
          }}
        >
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="co-value-card"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div
                  className="co-value-icon"
                  style={{ background: v.bg, color: v.accent }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="co-value-title">{v.title}</h3>
                <p className="co-value-desc">{v.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ── Full-width Banner Image ── */}

      </div>

      <style>{`
        .co-section {
          position: relative;
          overflow: hidden;
          padding: 80px 0 90px;
          background: linear-gradient(180deg, hsl(43 82% 96%) 0%, hsl(43 50% 94%) 50%, hsl(43 82% 96%) 100%);
        }
        .co-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.3;
        }
        .co-bg-blob-1 {
          width: 500px; height: 500px;
          top: -100px; left: -150px;
          background: hsl(193 30% 88%);
        }
        .co-bg-blob-2 {
          width: 450px; height: 450px;
          bottom: -80px; right: -100px;
          background: hsl(175 25% 86%);
        }

        /* ── Hero Split ── */
        .co-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 64px;
        }

        /* Image grid */
        .co-image-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 14px;
          position: relative;
        }
        .co-img {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          border: 4px solid white;
        }
        .co-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 1s ease-out;
        }
        .co-img:hover img {
          transform: scale(1.06);
        }
        .co-img-main {
          grid-row: 1 / 3;
          border-radius: 24px;
        }
        .co-img-top {
          transform: rotate(2deg);
        }
        .co-img-bottom {
          transform: rotate(-1.5deg);
        }

        /* Story */
        .co-story {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .co-eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: hsl(193 15% 45%);
          font-family: Inter, sans-serif;
          margin-bottom: 10px;
        }
        .co-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(26px, 4vw, 42px);
          color: hsl(193 28% 18%);
          line-height: 1.2;
          margin-bottom: 20px;
        }
        .co-title em {
          font-style: italic;
          font-weight: 400;
        }
        .co-desc {
          font-family: Inter, sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: hsl(193 14% 36%);
          margin-bottom: 16px;
        }
        .co-desc strong {
          color: hsl(193 25% 20%);
          font-weight: 600;
        }
        .co-desc em {
          font-style: italic;
        }

        /* Stats */
        .co-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin: 24px 0 20px;
          padding: 20px 0;
          border-top: 1px solid hsl(193 15% 85%);
          border-bottom: 1px solid hsl(193 15% 85%);
        }
        .co-stat {
          text-align: center;
        }
        .co-stat-value {
          display: block;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 24px;
          font-weight: 700;
          color: hsl(193 28% 20%);
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .co-stat-label {
          font-family: Inter, sans-serif;
          font-size: 11px;
          color: hsl(193 12% 50%);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Values Grid ── */
        .co-values {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 56px;
        }
        .co-value-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          padding: 28px 24px;
          border: 1px solid rgba(255,255,255,0.5);
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.45s ease;
        }
        .co-value-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .co-value-icon {
          width: 44px; height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .co-value-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 18px;
          color: hsl(193 28% 18%);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .co-value-desc {
          font-family: Inter, sans-serif;
          font-size: 13px;
          line-height: 1.65;
          color: hsl(193 12% 42%);
        }

        /* ── Banner ── */
        .co-banner {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 12px 48px rgba(0,0,0,0.10);
        }
        .co-banner img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          display: block;
        }
        .co-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }
        .co-banner-quote {
          font-family: "Playfair Display", Georgia, serif;
          font-style: italic;
          font-size: clamp(18px, 2.5vw, 26px);
          color: white;
          max-width: 600px;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .co-banner-author {
          font-family: Inter, sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.05em;
        }

        /* ── Tablet ── */
        @media (max-width: 1024px) and (min-width: 768px) {
          .co-hero { gap: 36px; }
          .co-values { grid-template-columns: repeat(2, 1fr); }
          .co-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .co-section { padding: 50px 0 60px; }
          .co-hero {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .co-image-grid {
            gap: 10px;
            max-height: 320px;
          }
          .co-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .co-values {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-bottom: 36px;
          }
          .co-value-card {
            display: flex;
            gap: 16px;
            align-items: flex-start;
            padding: 20px;
          }
          .co-value-icon {
            margin-bottom: 0;
            flex-shrink: 0;
          }
          .co-banner img {
            height: 220px;
          }
          .co-banner-overlay {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default CompanyOverview;
