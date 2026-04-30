import { useState, useEffect, useRef } from "react";
import { Instagram, Facebook } from "lucide-react";

const videos = [
  {
    src: "/images/Video-1.mp4",
  },
  {
    src: "/images/Video-2.mp4",
  },
  {
    src: "/images/Video-3.mp4",
  },
];

const StepIntoWorld = () => {
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
    <section ref={sectionRef} className="siw-section">
      <div className="container mx-auto">
        {/* Header */}
        <div
          className="siw-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <h2 className="siw-title">
            Step into our world{" "}
            <a
              href="https://www.instagram.com/bugyboo_babyshop/"
              target="_blank"
              rel="noopener noreferrer"
              className="siw-handle"
            >
              @bugyboo_babyshop
            </a>
          </h2>
          <p className="siw-subtitle">
            Join the BugyBoo family for the latest updates, stories, surprises, and more!
          </p>
        </div>

        {/* Image Grid */}
        <div
          className="siw-grid"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}
        >
          {videos.map((vid, i) => (
            <a
              key={i}
              href="https://www.instagram.com/bugyboo_babyshop/"
              target="_blank"
              rel="noopener noreferrer"
              className="siw-card"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <video
                src={vid.src}
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="siw-card-overlay">
                <Instagram className="siw-card-icon" />
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div
          className="siw-cta flex flex-wrap items-center justify-center gap-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s",
          }}
        >
          <a
            href="https://www.instagram.com/bugyboo_babyshop/"
            target="_blank"
            rel="noopener noreferrer"
            className="siw-follow-btn"
          >
            <Instagram className="h-4 w-4" />
            Follow us on Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61588919600654"
            target="_blank"
            rel="noopener noreferrer"
            className="siw-follow-btn"
          >
            <Facebook className="h-4 w-4" />
            Follow us on Facebook
          </a>
        </div>
      </div>

      <style>{`
        .siw-section {
          padding: 80px 0 90px;
          background: transparent;
        }

        .siw-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .siw-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(26px, 4vw, 40px);
          color: hsl(193 28% 18%);
          margin-bottom: 12px;
          line-height: 1.25;
        }

        .siw-handle {
          color: hsl(193 28% 38%);
          text-decoration: none;
          font-style: italic;
          transition: color 0.3s ease;
        }
        .siw-handle:hover {
          color: hsl(193 30% 28%);
        }

        .siw-subtitle {
          font-family: Inter, sans-serif;
          font-size: 15px;
          color: hsl(193 12% 45%);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Grid */
        .siw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        .siw-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/5;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          display: block;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.5s ease;
        }
        .siw-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 16px 48px rgba(0,0,0,0.14);
        }
        .siw-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s ease-out;
        }
        .siw-card:hover video {
          transform: scale(1.08);
        }

        .siw-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.4s ease;
        }
        .siw-card:hover .siw-card-overlay {
          background: rgba(0,0,0,0.25);
        }
        .siw-card-icon {
          width: 36px;
          height: 36px;
          color: white;
          opacity: 0;
          transform: scale(0.7);
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }
        .siw-card:hover .siw-card-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* CTA */
        .siw-cta {
          text-align: center;
        }
        .siw-follow-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 32px;
          border-radius: 999px;
          font-family: Inter, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: white;
          background: linear-gradient(135deg, hsl(193 28% 34%), hsl(175 28% 38%));
          text-decoration: none;
          transition: all 0.4s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .siw-follow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.18);
        }

        /* Responsive */
        @media (max-width: 767px) {
          .siw-section { padding: 50px 0 60px; }
          .siw-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 32px;
          }
          .siw-card {
            aspect-ratio: 3/4;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .siw-grid { gap: 16px; }
        }
      `}</style>
    </section>
  );
};

export default StepIntoWorld;
