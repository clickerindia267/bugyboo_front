import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Heart, Minus, Plus, Truck, RefreshCw, ShieldCheck, ChevronLeft, Loader2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts, addToCart, type PublicProduct } from "@/lib/api";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add } = useCart();
  const { accessToken, isLoggedIn } = useAuth();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [adding, setAdding] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const { data: allProductsData } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const product = data?.data;
  const related = (allProductsData?.data ?? [])
    .filter((p) => p._id !== id && !p.isPaused)
    .slice(0, 4);

  if (isLoading) {
    return (
      <PageShell hideHeaderSpacer>
        <div className="pt-24 md:pt-28 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
            <div>
              <div className="rounded-3xl aspect-[4/5] shimmer mb-4" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 rounded-xl shimmer" />
                ))}
              </div>
            </div>
            <div className="md:py-4 space-y-4">
              <div className="h-4 w-24 rounded shimmer" />
              <div className="h-10 w-3/4 rounded shimmer" />
              <div className="h-8 w-20 rounded shimmer" />
              <div className="h-20 w-full rounded shimmer" />
              <div className="h-12 w-full rounded-full shimmer" />
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (isError || !product) {
    return (
      <PageShell title="Not found" subtitle="That little piece has wandered off.">
        <div className="container mx-auto pb-32 text-center">
          <Link to="/shop">
            <Button className="rounded-full">Back to shop</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const handleAdd = async (goCart = false) => {
    if (!isLoggedIn || !accessToken) {
      navigate(`/login?redirectUrl=${encodeURIComponent(`/product/${product._id}`)}`);
      return;
    }

    setAdding(true);
    try {
      await add(product._id, qty);
      toast({ title: "Added to bag", description: `${product.name} × ${qty}` });
      if (goCart) navigate("/cart");
    } catch (err) {
      toast({ title: "Failed to add", description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setAdding(false);
    }
  };

  const discount = product.basePrice > product.sellPrice
    ? Math.round(((product.basePrice - product.sellPrice) / product.basePrice) * 100)
    : 0;

  const images = product.images ?? [];

  const handlePrevImg = () => {
    setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <PageShell hideHeaderSpacer>
      <div className="pt-24 md:pt-28">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* ── Gallery ── */}
            <div className="space-y-4">
              {/* Main image with navigation arrows */}
              <div
                className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary cursor-zoom-in group"
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
              >
                <img
                  src={images[activeImg] ?? ""}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    zoom ? "scale-150" : "scale-100"
                  }`}
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
                    {discount}% off
                  </span>
                )}
                {/* Image navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors shadow-md opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors shadow-md opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    {/* Dot indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImg(idx)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === activeImg
                              ? "bg-white w-6"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImg ? "border-primary ring-1 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="md:py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                {product.category?.name} · {product.size}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl font-serif">₹{product.sellPrice}</span>
                {product.basePrice > product.sellPrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{product.basePrice}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {discount}% off
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Color */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Color: <span className="text-muted-foreground font-normal">{product.color}</span></p>
              </div>

              {/* Size */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Size: <span className="text-muted-foreground font-normal">{product.size}</span></p>
              </div>

              {/* Qty */}
              <div className="mb-8">
                <p className="text-sm font-medium mb-3">Quantity</p>
                <div className="inline-flex items-center border border-border rounded-full">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 h-12 px-8 flex-1 shadow-soft"
                  onClick={() => handleAdd(false)}
                  disabled={adding}
                >
                  {adding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    `Add to bag · ₹${product.sellPrice * qty}`
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 flex-1"
                  onClick={() => handleAdd(true)}
                  disabled={adding}
                >
                  Buy it now
                </Button>
                <Button size="icon" variant="outline" className="rounded-full h-12 w-12" aria-label="Wishlist">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { Icon: Truck, l: "Free shipping" },
                  { Icon: RefreshCw, l: "Easy returns" },
                  { Icon: ShieldCheck, l: "Secure payment" },
                ].map(({ Icon, l }) => (
                  <div key={l} className="text-center p-3 rounded-2xl bg-secondary/50">
                    <Icon className="h-4 w-4 mx-auto mb-1.5 text-primary" />
                    <p className="text-[11px] text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="container mx-auto py-24 md:py-32 px-4">
            <h2 className="font-serif text-3xl md:text-4xl mb-10">You may also <em className="italic">love</em></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {related.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5] mb-3 hover-lift">
                    <img
                      src={p.images?.[0] ?? ""}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-serif text-base">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">₹{p.sellPrice}</span>
                    {p.basePrice > p.sellPrice && (
                      <span className="text-xs text-muted-foreground line-through">₹{p.basePrice}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
};

export default ProductDetails;
