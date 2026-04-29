import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const reviews = [
  {
    name: "Amélie Laurent",
    role: "Mother of two",
    text: "The quality is unmatched. My daughter's linen dress arrived wrapped like a gift — every detail feels considered and loved.",
    initials: "AL",
    tone: "bg-pink",
  },
  {
    name: "Sofia Marchetti",
    role: "First-time mama",
    text: "I bought the cashmere swaddle for our newborn and now I want everything from this brand. So soft, so dreamy.",
    initials: "SM",
    tone: "bg-lavender",
  },
  {
    name: "Hannah Bergström",
    role: "Mother of three",
    text: "Heirloom-worthy clothing that survives three siblings and still looks beautiful. A true investment in childhood.",
    initials: "HB",
    tone: "bg-blue",
  },
];

const Testimonials = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % reviews.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-gradient-soft relative overflow-hidden">
      <div className="container mx-auto relative">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Loved by parents</p>
          <h2 className="font-serif text-4xl md:text-5xl text-balance">
            Whispered <em className="italic font-normal">praises</em>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto relative h-[280px] md:h-[240px]">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-700 ${
                i === active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
              }`}
            >
              <div className="glass rounded-3xl p-8 md:p-12 text-center shadow-soft">
                <Quote className="h-8 w-8 mx-auto mb-5 text-primary/40" />
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-balance mb-8 italic">
                  "{r.text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${r.tone} flex items-center justify-center font-medium text-sm`}>
                    {r.initials}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-10 bg-primary" : "w-1.5 bg-foreground/20"
              }`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
