import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
  {
    name: "Amélie Laurent",
    role: "Mother of two · Paris",
    text: "The quality is unmatched. My daughter's linen dress arrived wrapped like a gift — every detail feels considered and loved.",
    initials: "AL",
    tone: "bg-pink",
  },
  {
    name: "Sofia Marchetti",
    role: "First-time mama · Milan",
    text: "I bought the cashmere swaddle for our newborn and now I want everything from this brand. So soft, so dreamy.",
    initials: "SM",
    tone: "bg-lavender",
  },
  {
    name: "Hannah Bergström",
    role: "Mother of three · Stockholm",
    text: "Heirloom-worthy clothing that survives three siblings and still looks beautiful. A true investment in childhood.",
    initials: "HB",
    tone: "bg-blue",
  },
  {
    name: "Yuki Tanaka",
    role: "Mother of one · Tokyo",
    text: "Petite Lune feels like a quiet love letter to childhood. The fabrics breathe, the colors calm — pure poetry.",
    initials: "YT",
    tone: "bg-beige",
  },
  {
    name: "Camille Dubois",
    role: "Stylist · Lyon",
    text: "I dress my clients' little ones exclusively in Petite Lune. Timeless, photogenic, and impossibly comfortable.",
    initials: "CD",
    tone: "bg-pink",
  },
  {
    name: "Olivia Bennett",
    role: "Mother of twins · London",
    text: "Two babies, twice the laundry — and yet everything still looks brand new. Worth every single penny.",
    initials: "OB",
    tone: "bg-lavender",
  },
];

const Testimonials = () => {
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalPages = Math.max(1, reviews.length - perView + 1);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    const id = setInterval(() => setPage((p) => (p + 1) % totalPages), 6000);
    return () => clearInterval(id);
  }, [totalPages]);

  const go = (dir: number) => setPage((p) => (p + dir + totalPages) % totalPages);

  const itemBasis = `${100 / perView}%`;
  const translate = `-${page * (100 / perView)}%`;

  return (
    <section className="py-24 md:py-32 bg-gradient-soft relative overflow-hidden">
      <div className="container mx-auto relative">
        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Loved by parents</p>
            <h2 className="font-serif text-4xl md:text-5xl text-balance">
              Whispered <em className="italic font-normal">praises</em>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
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
        </div>

        <div className="overflow-hidden -mx-3">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(${translate})` }}
          >
            {reviews.map((r, i) => (
              <div key={i} className="px-3 shrink-0" style={{ flexBasis: itemBasis }}>
                <div className="glass rounded-3xl p-7 md:p-8 h-full shadow-soft hover-lift flex flex-col">
                  <Quote className="h-7 w-7 mb-5 text-primary/40" />
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="font-serif text-lg leading-relaxed text-balance mb-6 italic flex-1">
                    "{r.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border/40">
                    <div
                      className={`w-11 h-11 rounded-full ${r.tone} flex items-center justify-center font-medium text-sm`}
                    >
                      {r.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === page ? "w-10 bg-primary" : "w-1.5 bg-foreground/20"
              }`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
