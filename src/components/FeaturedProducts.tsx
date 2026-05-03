import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type PublicProduct } from "@/lib/api";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";

const FeaturedProducts = () => {
  const { add } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const featured: PublicProduct[] = (data?.data ?? []).filter((p) => !p.isPaused).slice(0, 8);

  const quickAdd = async (e: React.MouseEvent, product: PublicProduct) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      await add(product._id, 1);
      toast({ title: "Added to bag", description: product.name });
    } catch (error) {
      toast({ title: "Failed to add to bag", description: "Please try again", variant: "destructive" });
    }
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
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

        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-2xl bg-secondary aspect-square mb-4 shimmer" />
                <div className="h-4 w-3/4 rounded shimmer mb-2" />
                <div className="h-3 w-1/2 rounded shimmer" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featured.map((p, i) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="group animate-slide-up block"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-square mb-4 hover-lift">
                  <img
                    src={p.images?.[0] ?? ""}
                    alt={p.name}
                    width={800}
                    height={1024}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
                  />
                  {p.basePrice > p.sellPrice && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
                      {Math.round(((p.basePrice - p.sellPrice) / p.basePrice) * 100)}% off
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
                      onClick={(e) => quickAdd(e, p)}
                    >
                      <ShoppingBag className="h-3.5 w-3.5 mr-2" />
                      Add to bag
                    </Button>
                  </div>
                </div>
                <div className="px-1">
                  <p className="text-[11px] text-muted-foreground mb-1">{p.category?.name}</p>
                  <h3 className="font-serif text-lg leading-tight mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">₹{p.sellPrice}</span>
                    {p.basePrice > p.sellPrice && (
                      <span className="text-xs text-muted-foreground line-through">₹{p.basePrice}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
