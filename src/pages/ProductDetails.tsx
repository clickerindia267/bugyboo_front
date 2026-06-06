import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Heart, Minus, Plus, Truck, RefreshCw, ShieldCheck, ChevronLeft, Loader2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts, type PublicProduct, type ProductVariant } from "@/lib/api";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { toSlug, getProductAltText } from "@/lib/utils";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add } = useCart();
  const { accessToken, isLoggedIn } = useAuth();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const { data: allProductsData } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("No product identifier provided");
      const isId = /^[0-9a-fA-F]{24}$/.test(id);
      if (isId) {
        return getProductById(id);
      } else {
        const res = await getProducts();
        const matched = res.data.find((p) => toSlug(p.name) === id);
        if (!matched) throw new Error("Product not found by slug");
        return getProductById(matched._id);
      }
    },
    enabled: !!id,
  });

  const product = data?.data;
  const related = (allProductsData?.data ?? [])
    .filter((p) => p._id !== product?._id && !p.isPaused)
    .slice(0, 4);

  // Set default selected variant when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

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

    if (!selectedVariant) {
      toast({ title: "Please select an age group", description: "Choose an age group before adding to cart." });
      return;
    }

    setAdding(true);
    try {
      await add(
        product._id,
        qty,
        selectedVariant.ageGroup,
        selectedVariant.sellPrice,
        selectedVariant,
        selectedVariant.basePrice,
        selectedVariant._id,
      );
      if (goCart) navigate("/cart");
    } catch (err) {
      toast({ title: "Failed to add", description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setAdding(false);
    }
  };

  const discount = selectedVariant ? Math.round(((selectedVariant.basePrice - selectedVariant.sellPrice) / selectedVariant.basePrice) * 100) : 0;

  const images = product.images ?? [];

  const handlePrevImg = () => {
    setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Structured schemas for Google RankMath, Lighthouse compliance
  const productSchema = {
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description,
    "sku": product._id,
    "url": window.location.href,
    "color": product.color,
    "brand": {
      "@type": "Brand",
      "name": "Bugyboo"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": selectedVariant ? selectedVariant.sellPrice : Math.min(...(product.variants?.map(v => v.sellPrice) || [0])),
      "highPrice": Math.max(...(product.variants?.map(v => v.sellPrice) || [0])),
      "offerCount": product.variants?.length || 1,
      "price": selectedVariant ? selectedVariant.sellPrice : 0,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Bugyboo"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "124"
    }
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${window.location.origin}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${window.location.origin}/shop`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": window.location.href
      }
    ]
  };

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the fabric skin-friendly and safe for newborns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Bugyboo clothing uses 100% premium soft cotton and eco-safe certified dyes that are extremely breathable and highly suited for a newborn's delicate, sensitive skin."
        }
      },
      {
        "@type": "Question",
        "name": "What is the return/exchange policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer easy returns and exchanges within 7 days of delivery. The item must be unused, in its original packaging, and tagless labels intact."
        }
      },
      {
        "@type": "Question",
        "name": "Does Bugyboo ship all across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we ship wholesale and retail orders across all regions in India with fast dispatch services and reliable tracking updates."
        }
      }
    ]
  };

  const combinedSchema = [productSchema, breadcrumbSchema, faqSchema];

  return (
    <PageShell hideHeaderSpacer>
      <SEO 
        title={`${product.name} | Bugyboo`}
        description={`Shop ${product.name} online at Bugyboo. Made from premium, skin-friendly cotton fabric. Soft, breathable, and affordable clothing for babies, boys, and girls.`}
        keywords={`${product.name}, Buy ${product.name} online, premium kids clothes, cotton baby wear, Bugyboo ${product.category?.name}`}
        ogImage={images[0] ?? "/favicon.jpg"}
        ogType="product"
        schemaData={combinedSchema}
      />

      <div className="pt-24 md:pt-28">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumbs">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground" aria-current="page">{product.name}</span>
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
                  alt={`${product.name} — ${product.color || 'premium'} kids wear`}
                  className={`w-full h-full object-contain transition-transform duration-700 ${
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
                      <img src={img} alt={`${product.name} thumbnail preview ${i + 1}`} loading="lazy" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="md:py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-600 dark:text-rose-400 font-bold mb-3">
                {product.category?.name}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl mb-4 font-bold">{product.name}</h1>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl font-serif">₹{selectedVariant?.sellPrice || 0}</span>
                {selectedVariant && selectedVariant.basePrice > selectedVariant.sellPrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{selectedVariant.basePrice}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {discount}% off
                  </span>
                )}
              </div>
              
              <div className="mb-8">
                {product.description?.includes('•') || product.description?.includes('\n') || product.description?.includes('|') ? (
                  <ul className="space-y-3">
                    {product.description.split(/[•\n|]/).map((point, i) => point.trim() && (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{point.trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                )}
              </div>

              {/* Color */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Color: <span className="text-muted-foreground font-normal">{product.color}</span></p>
              </div>

              {/* Age Group Selector */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Select Age Group</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants?.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        selectedVariant?._id === variant._id
                          ? "border-primary bg-primary text-primary-foreground shadow-soft"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {variant.ageGroup} Years - ₹{variant.sellPrice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty */}
              <div className="mb-8">
                <p className="text-sm font-medium mb-3">Quantity</p>
                <div className="inline-flex items-center border border-border rounded-full">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full" aria-label="Decrease quantity">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full" aria-label="Increase quantity">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 h-14 sm:h-16 px-8 flex-[2] shadow-soft text-base sm:text-lg font-semibold tracking-wide transition-all active:scale-[0.98]"
                  onClick={() => handleAdd(false)}
                  disabled={adding}
                >
                  {adding ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Adding...
                    </span>
                  ) : (
                    <span className="text-center">Add to bag · ₹{(selectedVariant?.sellPrice || 0) * qty}</span>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 sm:h-16 px-8 flex-1 text-base sm:text-lg font-semibold tracking-wide border-2 hover:bg-secondary transition-all active:scale-[0.98]"
                  onClick={() => handleAdd(true)}
                  disabled={adding}
                >
                  Buy it now
                </Button>
                <Button size="icon" variant="outline" className="rounded-full h-14 w-14 sm:h-16 sm:w-16 shrink-0 border-2" aria-label="Add to Wishlist">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { Icon: Truck, l: "Free shipping" },
                  { Icon: RefreshCw, l: "Easy returns" },
                  { Icon: ShieldCheck, l: "Secure payment" },
                ].map(({ Icon, l }) => (
                  <div key={l} className="text-center p-3 rounded-2xl bg-secondary/50">
                    <Icon className="h-4 w-4 mx-auto mb-1.5 text-primary animate-float" />
                    <p className="text-[11px] text-muted-foreground font-bold">{l}</p>
                  </div>
                ))}
              </div>

              {/* Product FAQ Accordion (SEO Optimization) */}
              <div className="mt-8 pt-8 border-t border-border/65 space-y-4">
                <h3 className="font-serif text-lg font-bold text-primary mb-3">Frequently Asked Questions</h3>
                
                {[
                  {
                    q: "Is the fabric skin-friendly and safe for newborns?",
                    a: "Yes! Bugyboo clothing uses 100% premium soft cotton and water-based eco-safe certified dyes that are extremely breathable and highly suited for a newborn's delicate, sensitive skin."
                  },
                  {
                    q: "What is the return/exchange policy?",
                    a: "We offer easy returns and exchanges within 7 days of delivery. The item must be unused, in its original packaging, and with all tagless labels intact."
                  },
                  {
                    q: "Does Bugyboo ship all across India?",
                    a: "Yes, we ship B2B wholesale and retail orders across all regions in India with fast dispatch services and reliable tracking updates."
                  }
                ].map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="border-b border-border/40 pb-3">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left font-serif text-sm font-semibold text-primary py-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        <Plus className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 text-rose-600 dark:text-rose-400" : ""}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 mt-2" : "max-h-0"}`}>
                        <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="container mx-auto py-24 md:py-32 px-4" aria-label="Related products">
            <h2 className="font-serif text-3xl md:text-4xl mb-10 font-bold">You may also <em className="italic font-normal">love</em></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {related.map((p) => (
                <Link key={p._id} to={`/product/${toSlug(p.name)}`} className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5] mb-3 hover-lift">
                    <img
                      src={p.images?.[0] ?? ""}
                      alt={getProductAltText(p.name, p.category?.name)}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-1200 ease-out group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-serif text-base font-bold">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Starting From ₹{Math.min(...(p.variants?.map(v => v.sellPrice) || [0]))}</span>
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
