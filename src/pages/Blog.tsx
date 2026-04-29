import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import cat1 from "@/assets/cat-girls.jpg";
import cat2 from "@/assets/cat-newborn.jpg";
import cat3 from "@/assets/cat-party.jpg";

const posts = [
  { id: 1, slug: "spring-rituals", img: hero1, title: "Spring rituals for tiny wardrobes", excerpt: "Five soft ways to refresh your little one's closet for the new season.", category: "Style", date: "Apr 22, 2026", read: "4 min" },
  { id: 2, slug: "newborn-cocoon", img: cat2, title: "Cocooning a newborn in cashmere", excerpt: "Why softness in the first weeks shapes a lifetime of comfort.", category: "Care", date: "Apr 14, 2026", read: "6 min" },
  { id: 3, slug: "heirloom-pieces", img: hero2, title: "Pieces meant to be passed down", excerpt: "On slow fashion, longevity, and dressing more than one childhood.", category: "Story", date: "Apr 03, 2026", read: "5 min" },
  { id: 4, slug: "garden-party", img: cat3, title: "A linen garden party guide", excerpt: "Effortless looks for spring weddings, baptisms and quiet celebrations.", category: "Style", date: "Mar 28, 2026", read: "3 min" },
  { id: 5, slug: "soft-colors", img: cat1, title: "The science of soft pastels", excerpt: "How muted hues calm both the room and the little ones inside it.", category: "Mood", date: "Mar 19, 2026", read: "7 min" },
  { id: 6, slug: "atelier-visit", img: hero3, title: "Inside our Portuguese atelier", excerpt: "Meet the hands behind every stitch, button, and embroidered hem.", category: "Story", date: "Mar 08, 2026", read: "5 min" },
];

const Blog = () => {
  const [feature, ...rest] = posts;
  return (
    <PageShell title="Letters from Lune" eyebrow="Journal" subtitle="Soft stories on parenting, slow fashion, and the magic of the everyday.">
      <section className="container mx-auto pb-24">
        {/* Featured */}
        <Link to={`/blog`} className="block group mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative overflow-hidden rounded-3xl aspect-[4/3]">
              <img
                src={feature.img}
                alt={feature.title}
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">{feature.category}</p>
              <h2 className="font-serif text-3xl md:text-5xl mb-4 text-balance">{feature.title}</h2>
              <p className="text-muted-foreground mb-6">{feature.excerpt}</p>
              <div className="flex items-center gap-5 text-xs text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{feature.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{feature.read}</span>
              </div>
              <Button variant="outline" className="rounded-full group/btn">
                Read story
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </Link>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((p, i) => (
            <Link
              key={p.id}
              to="/blog"
              className="group animate-fade-in"
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 hover-lift">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
                  {p.category}
                </span>
              </div>
              <h3 className="font-serif text-xl mb-2 leading-tight">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{p.date}</span>
                <span>·</span>
                <span>{p.read}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default Blog;
