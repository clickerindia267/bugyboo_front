import { Star, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";

const products = [
  { id: 1, img: p1, name: "Rosé Knit Cardigan", price: 68, rating: 4.9, tag: "New" },
  { id: 2, img: p2, name: "Cream Heirloom Knit", price: 84, rating: 5.0, tag: "Bestseller" },
  { id: 3, img: p3, name: "Petal Ruffle Dress", price: 92, rating: 4.8 },
  { id: 4, img: p4, name: "Sky Linen Romper", price: 56, rating: 4.7, tag: "New" },
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-cream">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Curated for you</p>
            <h2 className="font-serif text-4xl md:text-5xl text-balance max-w-md">
              Featured <em className="italic font-normal">pieces</em>
            </h2>
          </div>
          <Button variant="ghost" className="rounded-full story-link">
            View all collection
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((p, i) => (
            <article
              key={p.id}
              className="group animate-slide-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5] mb-4 hover-lift">
                <img
                  src={p.img}
                  alt={p.name}
                  width={800}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                {p.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
                    {p.tag}
                  </span>
                )}
                <button
                  aria-label="Add to wishlist"
                  className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <div className="absolute inset-x-3 bottom-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <Button size="sm" className="w-full rounded-full bg-background text-foreground hover:bg-background/90 shadow-soft">
                    <ShoppingBag className="h-3.5 w-3.5 mr-2" />
                    Add to bag
                  </Button>
                </div>
              </div>
              <div className="px-1">
                <div className="flex items-center gap-1 mb-1.5">
                  <Star className="h-3 w-3 fill-foreground text-foreground" />
                  <span className="text-xs text-muted-foreground">{p.rating}</span>
                </div>
                <h3 className="font-serif text-lg leading-tight mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground">€{p.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
