import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type PublicProduct } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

const FeaturedProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const featured: PublicProduct[] = (data?.data ?? []).filter((p) => !p.isPaused).slice(0, 8);

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
              <ProductCard
                key={p._id}
                p={p}
                index={i}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
                aspectClass="aspect-[3/4]"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
