import { Link } from "react-router-dom";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";
import { toast } from "@/hooks/use-toast";

const FeaturedProducts = () => {
  const { add } = useCart();
  const featuredIds = [1, 2, 3, 4, 5, 6, 9, 13]; // curated mix: Girls, Boys + extras
  const featured = featuredIds.map((id) => products.find((p) => p.id === id)!);

  const quickAdd = (e: React.MouseEvent, productId: number, size: string, color: string, name: string) => {
    e.preventDefault();
    add({ productId, size, color, qty: 1 });
    toast({ title: "Added to bag", description: name });
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Best Product For You </p>
            <h2 className="font-serif text-4xl md:text-5xl text-balance max-w-md">
              Our <em className="italic font-normal">Products</em>
            </h2>
          </div>
          <Link to="/shop">
            <Button variant="ghost" className="rounded-full story-link">
              View all collection
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {featured.map((p, i) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              className="group animate-slide-up block"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-square mb-4 hover-lift">
                <img
                  src={p.img}
                  alt={p.name}
                  width={800}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
                />
                {p.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
                    {p.tag}
                  </span>
                )}
                <button
                  aria-label="Add to wishlist"
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <div className="absolute inset-x-3 bottom-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <Button
                    size="sm"
                    className="w-full rounded-full bg-[#3f646f] text-white hover:bg-[#3f646f]/90 shadow-soft"
                    onClick={(e) => quickAdd(e, p.id, p.sizes[0], p.colors[0].name, p.name)}
                  >
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
                <p className="text-sm text-muted-foreground">₹{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
