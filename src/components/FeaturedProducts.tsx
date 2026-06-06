import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type PublicProduct } from "@/lib/api";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { useState } from "react";
import { toSlug, getProductAltText } from "@/lib/utils";

/* ─── Product Card ─── */
const ProductCard = ({ p, index }: { p: PublicProduct; index: number }) => {
  const { add } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Requirement 2: Auto-select first variant by default
  const [selectedVariant, setSelectedVariant] = useState(
    p?.variants?.[0] || null
  );

  const quickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Requirement 6: Prevent add to cart if no variant selected
    if (!selectedVariant?._id) {
      toast.error("Please select an age group");
      return;
    }

    setLoading(true);
    try {
      // Requirement 5: Update Add to Cart payload
      await add(
        p._id,
        1,
        selectedVariant.ageGroup,
        selectedVariant.sellPrice,
        selectedVariant,
        selectedVariant.basePrice,
        selectedVariant._id
      );
      toast.success("Added to bag!");
    } catch (error: any) {
      // Requirement 8: Show toast if backend response returns variantId is required
      const isVariantReq = 
        error?.message?.includes("variantId is required") || 
        error?.errors?.some((err: any) => err.message?.includes("variantId is required"));
      if (isVariantReq) {
        toast.error("Please select an age group");
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to add to bag");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="group animate-slide-up block"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
    >
      <Link to={`/product/${toSlug(p.name)}`}>
        <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[3/4] mb-4 hover-lift">
          <img
            src={p.images?.[0] ?? ""}
            alt={getProductAltText(p.name, p.category?.name)}
            width={800}
            height={1024}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-1200 ease-out group-hover:scale-110"
          />
          {p.variants?.some(v => v.basePrice > v.sellPrice) && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
              Sale
            </span>
          )}
          <button
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110"
          >
            <Heart className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-3 bottom-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <Button
              size="sm"
              className="w-full rounded-full bg-[#3f646f] text-white hover:bg-[#3f646f]/90 shadow-soft"
              onClick={quickAdd}
              disabled={loading}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-2" />
              {loading ? "Adding..." : "Add to bag"}
            </Button>
          </div>
        </div>
      </Link>
      <div className="px-1">
        <p className="text-[11px] text-muted-foreground mb-1">{p.category?.name}</p>
        <Link to={`/product/${toSlug(p.name)}`}>
          <h3 className="font-serif text-lg leading-tight mb-1 hover:text-[#3f646f] transition-colors">{p.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          {selectedVariant ? (
            <>
              <span className="text-sm font-semibold">₹{selectedVariant.sellPrice}</span>
              {selectedVariant.basePrice > selectedVariant.sellPrice && (
                <span className="text-xs text-muted-foreground line-through">₹{selectedVariant.basePrice}</span>
              )}
            </>
          ) : (
            <span className="text-sm font-medium">Starting From ₹{Math.min(...(p.variants?.map(v => v.sellPrice) || [0]))}</span>
          )}
        </div>

        {/* Age Group / Variant Selector */}
        {p.variants && p.variants.length > 0 && (
          <div className="mt-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Select Size:</p>
            <div className="flex flex-wrap gap-1.5">
              {p.variants.map((variant) => (
                <button
                  key={variant._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-full border transition-all duration-300 hover:scale-105 ${
                    selectedVariant?._id === variant._id
                      ? "border-[#3f646f] bg-[#3f646f] text-white shadow-sm"
                      : "border-border bg-white text-foreground hover:border-[#3f646f]/50"
                  }`}
                >
                  {variant.ageGroup}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
              <ProductCard key={p._id} p={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
