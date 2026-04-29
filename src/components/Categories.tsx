import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import boys from "@/assets/cat-boys.jpg";
import girls from "@/assets/cat-girls.jpg";
import newborn from "@/assets/cat-newborn.jpg";
import party from "@/assets/cat-party.jpg";
import casual from "@/assets/cat-casual.jpg";

const categories = [
  { name: "Baby Girls", count: "84 pieces", img: girls, tone: "bg-pink", span: "md:row-span-2" },
  { name: "Baby Boys", count: "72 pieces", img: boys, tone: "bg-blue" },
  { name: "Newborn", count: "48 pieces", img: newborn, tone: "bg-beige" },
  { name: "Party Wear", count: "36 pieces", img: party, tone: "bg-lavender" },
  { name: "Casual Wear", count: "92 pieces", img: casual, tone: "bg-secondary" },
];

const Categories = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Shop by mood</p>
          <h2 className="font-serif text-4xl md:text-5xl text-balance mb-4">
            Best-selling <em className="italic font-normal">categories</em>
          </h2>
          <p className="text-muted-foreground">
            Thoughtfully curated edits — from first cuddles to little adventures.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:gap-5 md:h-[640px]">
          {categories.map((c, i) => (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className={`group relative overflow-hidden rounded-3xl ${c.tone} hover-lift animate-scale-in ${
                i === 0 ? "row-span-2 col-span-2 md:col-span-2" : ""
              }`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1200 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end text-background">
                <p className="text-[10px] uppercase tracking-[0.25em] opacity-80 mb-1">{c.count}</p>
                <h3 className="font-serif text-2xl md:text-3xl">{c.name}</h3>
              </div>
              <div className="absolute top-5 right-5 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
