import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { toSlug, getProductAltText, getProductThumbnail, sortVariants } from "@/lib/utils";
import type { PublicProduct } from "@/lib/api";

interface ProductCardProps {
  p: PublicProduct;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  aspectClass?: string; // Custom aspect ratio wrapper class e.g. aspect-[3/4]
  bgClass?: string; // Custom background class for the image wrapper
}

export const ProductCard = ({
  p,
  index,
  className = "",
  style,
  aspectClass = "aspect-[4/5]",
  bgClass = "bg-secondary"
}: ProductCardProps) => {
  const { add } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sortedVariants = useMemo(() => {
    return p?.variants ? sortVariants(p.variants) : [];
  }, [p?.variants]);

  // Auto-select first variant by default
  const [selectedVariant, setSelectedVariant] = useState<any>(() => {
    return sortedVariants[0] || null;
  });

  // Sync selected variant when sortedVariants changes
  useEffect(() => {
    if (sortedVariants.length > 0) {
      const exists = selectedVariant && sortedVariants.some((v: any) => v._id === selectedVariant._id);
      if (!exists) {
        setSelectedVariant(sortedVariants[0]);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [sortedVariants]);

  const isStockManaged = selectedVariant && selectedVariant.stock !== undefined && selectedVariant.stock !== null;
  const isOutOfStock = isStockManaged && selectedVariant.stock === 0;
  const isEveryVariantOutOfStock = sortedVariants && sortedVariants.length > 0 && sortedVariants.every(
    v => v.stock !== undefined && v.stock !== null && v.stock === 0
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("This size is out of stock");
      return;
    }

    if (!isLoggedIn) {
      navigate(`/login?redirectUrl=${encodeURIComponent(`/product/${toSlug(p.name)}`)}`);
      return;
    }

    if (!selectedVariant?._id) {
      toast.error("Please select an age group");
      return;
    }

    setLoading(true);
    try {
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

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("This size is out of stock");
      return;
    }

    if (!isLoggedIn) {
      navigate(`/login?redirectUrl=${encodeURIComponent(`/product/${toSlug(p.name)}`)}`);
      return;
    }

    if (!selectedVariant?._id) {
      toast.error("Please select an age group");
      return;
    }

    setLoading(true);
    try {
      await add(
        p._id,
        1,
        selectedVariant.ageGroup,
        selectedVariant.sellPrice,
        selectedVariant,
        selectedVariant.basePrice,
        selectedVariant._id
      );
      navigate("/cart");
    } catch (error: any) {
      toast.error(error instanceof Error ? error.message : "Failed to proceed to checkout");
    } finally {
      setLoading(false);
    }
  };

  const hasDiscount = selectedVariant ? (selectedVariant.basePrice > selectedVariant.sellPrice) : sortedVariants?.some(v => v.basePrice > v.sellPrice);

  return (
    <div
      className={`group flex flex-col h-full font-sans ${className}`}
      style={style}
    >
      <div className="flex flex-col flex-grow">
        <Link to={`/product/${toSlug(p.name)}`} className="block">
          <div className={`relative overflow-hidden rounded-2xl ${bgClass} ${aspectClass} mb-3 hover-lift`}>
            <img
              src={getProductThumbnail(p.images)}
              alt={getProductAltText(p.name, p.category?.name)}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-1200 ease-out group-hover:scale-110"
            />
            {hasDiscount && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
                Sale
              </span>
            )}
            {isEveryVariantOutOfStock ? (
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-600/90 text-white text-[10px] uppercase tracking-wider font-bold shadow-soft">
                Out Of Stock
              </span>
            ) : (
              <button
                aria-label="Add to wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/60 backdrop-blur border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-white/90"
              >
                <Heart className="h-4 w-4" />
              </button>
            )}
          </div>
        </Link>
        <div className="px-1 flex flex-col flex-grow">
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mb-1">{p.category?.name}</p>
          <Link to={`/product/${toSlug(p.name)}`}>
            <h3 className="font-serif text-base leading-tight mb-1 font-bold hover:text-primary transition-colors min-h-[40px] line-clamp-2">{p.name}</h3>
          </Link>
          <div className="flex items-center gap-2 mb-2 min-h-[20px]">
            {selectedVariant ? (
              <>
                <span className="text-sm font-semibold text-foreground">₹{selectedVariant.sellPrice}</span>
                {selectedVariant.basePrice > selectedVariant.sellPrice && (
                  <span className="text-xs text-muted-foreground line-through">₹{selectedVariant.basePrice}</span>
                )}
              </>
            ) : (
              <span className="text-sm font-medium">Starting From ₹{Math.min(...(sortedVariants?.map(v => v.sellPrice) || [0]))}</span>
            )}
          </div>

          {/* Age Group / Variant Selector */}
          {sortedVariants && sortedVariants.length > 0 && (
            <div className="mt-2 mb-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Select Size:</p>
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {sortedVariants.map((variant) => (
                  <button
                    key={variant._id}
                    type="button"
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

      {/* Action Buttons */}
      <div className="mt-4 px-1 flex flex-col sm:flex-row gap-2">
        <Button
          size="sm"
          className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-soft h-10 transition-all active:scale-[0.98]"
          onClick={handleAddToCart}
          disabled={loading || isOutOfStock}
        >
          {loading ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add To Cart"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-full text-xs font-semibold border-2 hover:bg-secondary h-10 transition-all active:scale-[0.98] border-primary/20 text-primary hover:text-primary/95"
          onClick={handleBuyNow}
          disabled={loading || isOutOfStock}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};
