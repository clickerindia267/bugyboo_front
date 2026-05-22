import PageShell from "@/components/PageShell";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Shield, Sparkles, Sprout, Award, Globe } from "lucide-react";
import logo from "@/assets/logo.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const values = [
  {
    icon: Leaf,
    title: "100% Organic Sourcing",
    desc: "Every fiber is woven from certified organic cotton, harvested responsibly. Absolutely no chemical pesticide touches our crops, ensuring pure breathable comfort for baby skin.",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    icon: Heart,
    title: "Handcrafted Devotion",
    desc: "Designed by parents, crafted by local artisans. Every seam is double-finished, every label printed flat, and every button hand-secured to guarantee comfort that never scratches.",
    bg: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    icon: Shield,
    title: "Eco-Safe Certified",
    desc: "Certified with OEKO-TEX Standard 100. Our babywear undergoes rigorous tests to ensure zero harmful dye substances, phthalates, or heavy metals remain in the cloth.",
    bg: "bg-sky-50 text-sky-700 border-sky-100",
  },
  {
    icon: Sparkles,
    title: "Heirloom Longevity",
    desc: "Made slowly to withstand high-temp washes, muddy grass stains, and infinite playdates. Built to be adored by one child, then passed down lovingly to the next.",
    bg: "bg-amber-50 text-amber-700 border-amber-100",
  },
];

const timelineSteps = [
  {
    year: "2024",
    title: "The Mumbai Design Atelier",
    desc: "BugyBoo begins with a small parent collective in Mumbai looking to craft non-toxic, aesthetically refined, play-proof cotton clothes for ages 0–6.",
    icon: Sprout,
  },
  {
    year: "2025",
    title: "National Recognition",
    desc: "We introduce our heirloom holiday & occasion collections, winning the 'Sustainable Kids Wear of the Year' award and expanding our organic fabrics selection.",
    icon: Award,
  },
  {
    year: "2026",
    title: "A Global Organic Future",
    desc: "With over 50,000 happy families, BugyBoo now delivers comfortable, artisan-crafted clothes to little explorers in 15+ countries worldwide.",
    icon: Globe,
  },
];

const About = () => {
  return (
    <PageShell
      title="Heirloom Fashion for Little Explorers"
      eyebrow="Our Story"
      subtitle="Crafted slowly, loved deeply. Welcome to BugyBoo, where soft childhood dreams meet organic sustainable apparel."
    >
      <section className="container mx-auto pb-24 px-4 overflow-hidden">
        
        {/* ── Brand Narrative Hero Block ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 mt-4">
          
          {/* Images Montage (Aesthetic Collage) */}
          <div className="relative flex justify-center items-center">
            {/* Background decorative blob */}
            <div className="absolute -z-10 w-[110%] h-[110%] bg-pink/20 rounded-[40px] filter blur-3xl opacity-70" />
            
            <div className="grid grid-cols-12 gap-4 w-full max-w-lg">
              <div className="col-span-8 overflow-hidden rounded-[2rem] shadow-soft border-4 border-white hover:scale-102 transition-transform duration-500">
                <img
                  src={hero1}
                  alt="Organic baby playing"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="overflow-hidden rounded-2xl shadow-soft border-2 border-white hover:-translate-y-1 transition-transform duration-500">
                  <img
                    src={hero2}
                    alt="Soft organic texture"
                    className="w-full h-36 object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl shadow-soft border-2 border-white hover:translate-y-1 transition-transform duration-500">
                  <img
                    src={hero3}
                    alt="Heirloom design detail"
                    className="w-full h-40 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Text */}
          <div className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary/70 font-semibold mb-3">Our Core Origin</span>
            <h2 className="font-serif text-3xl md:text-5xl text-primary leading-tight mb-6">
              Born from a search for gentleness
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5 text-sm md:text-base">
              As parents, we realized that modern kidswear was moving too fast. Synthetics dominated, labels were itchy, and mass-market garments lost their softness after three spins in a washing machine.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
              <strong>BugyBoo</strong> was founded to slow things down. We set out to create apparel that honors the safety of your child and the health of the earth. From our initial designs in Mumbai to sourcing the finest long-staple Indian cotton, our mission remains unchanged: <em>absolute comfort, natural design, and heirloom quality.</em>
            </p>
            
            {/* Decorative Quote */}
            <div className="border-l-4 border-primary/20 pl-4 py-1.5 italic text-primary/80 font-serif text-base mb-8">
              "We don't just design garments; we weave comforting childhood memories that linger long after they are outgrown."
            </div>

            <div>
              <Link to="/shop">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-sm shadow-soft px-8">
                  Browse Our Atelier
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Values Grid Section ── */}
        <div className="mb-24 relative py-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-primary/70 font-semibold">How We Care</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mt-2">Our Core Pillars</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              We uphold safety and craftsmanship standards that ensure your child receives nothing but the best.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className={`p-8 rounded-3xl border bg-white shadow-soft hover:shadow-elegant hover:-translate-y-1.5 transition-all duration-500`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${v.bg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg text-primary mb-3">{v.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Handcrafted Sourcing / Process Section ── */}
        <div className="rounded-[2.5rem] bg-secondary/30 border border-border/40 p-8 md:p-14 lg:p-20 grid lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-24 relative overflow-hidden">
          {/* Decorative design */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-lavender/40 rounded-full filter blur-3xl opacity-60 -mr-20 -mb-20 pointer-events-none" />
          
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-[0.2em] text-primary/70 font-semibold mb-3 block">Artisanal Sourcing</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">Designed softly, made responsibly</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-pink/50 text-primary flex items-center justify-center font-serif text-sm font-semibold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-serif text-base text-primary mb-1">Naturally Soft Yarns</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    We select long-staple organic cotton. Hand-harvested in India, these longer fibers spin into smoother, stronger yarns that grow softer with every single wash.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-lavender/50 text-primary flex items-center justify-center font-serif text-sm font-semibold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-serif text-base text-primary mb-1">Water-Based, Safe Inks</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Standard prints can feel stiff and trap chemicals. We utilize eco-friendly, water-based inks that melt directly into the cotton fibres. They're safe to chew on, chew-proof, and buttery smooth.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue/50 text-primary flex items-center justify-center font-serif text-sm font-semibold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-serif text-base text-primary mb-1">Flat-Seam Tailoring</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Sensitive toddler and infant skin gets irritated by high-profile seams. Our garments feature meticulously flattened, flat-lock stitching and tagless printed labels.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-elegant border-4 border-white bg-white">
              <img
                src={logo}
                alt="BugyBoo logo detailed"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* ── Journey Timeline Section ── */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-primary/70 font-semibold">The Growth</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mt-2">The BugyBoo Journey</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Tracing our steps from a passionate idea to a comforting daily essential in thousands of warm nurseries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {timelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={step.year} className="relative group p-6 rounded-2xl hover:bg-card/50 transition-colors duration-300">
                  {/* Connector line for desktop */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[1px] bg-border border-dashed border-t pointer-events-none z-0" />
                  )}
                  
                  <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-6 relative z-10 border border-primary/10 group-hover:scale-105 transition-transform duration-300">
                    <StepIcon className="h-5 w-5" />
                  </div>
                  
                  <span className="font-serif text-4xl font-semibold text-primary/20 block mb-2">{step.year}</span>
                  <h4 className="font-serif text-lg text-primary mb-2">{step.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Gorgeous Call to Action Banner ── */}
        <div className="rounded-[3rem] bg-gradient-to-r from-pink/70 via-lavender/60 to-blue/60 p-8 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-elegant border border-white/50">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="font-serif text-3xl md:text-5xl text-primary leading-tight mb-4">
              Bring organic luxury into your nursery
            </h2>
            <p className="text-primary-foreground/90 font-serif text-base mb-8 max-w-lg leading-relaxed">
              Explore safe, gentle designs tailored to foster playtime, naptime, and all the magic milestones in between.
            </p>
            <Link to="/shop">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-medium px-10 h-14 text-base shadow-soft hover-lift transition-all">
                Shop Organic Now
              </Button>
            </Link>
          </div>
        </div>

      </section>
    </PageShell>
  );
};

export default About;
