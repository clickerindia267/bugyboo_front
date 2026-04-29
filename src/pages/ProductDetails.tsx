import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Heart, Minus, Plus, Star, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { getProduct, products } from "@/data/products";
import { useCart } from "@/store/cart";
import { toast } from "@/hooks/use-toast";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = slug ? getProduct(slug) : undefined;
  const { add } = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState(product?.colors[0].name ?? "");
  const [size, setSize] = useState(product?.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);

  if (!product) {
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

  const handleAdd = (goCart = false) => {
    if (!size || !color) return;
    add({ productId: product.id, size, color, qty });
    toast({ title: "Added to bag", description: `${product.name} · ${size} · ${color}` });
    if (goCart) navigate("/cart");
  };

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <PageShell hideHeaderSpacer>
      <div className="pt-24 md:pt-28">
        <div className="container mx-auto">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-3 md:w-20">
                {product.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImg ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={g} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div
                className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-secondary cursor-zoom-in group"
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
              >
                <img
                  src={product.gallery[activeImg]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    zoom ? "scale-150" : "scale-100"
                  }`}
                />
                {product.tag && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
                    {product.tag}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">{product.category} · {product.ageGroup}</p>
              <h1 className="font-serif text-4xl md:text-5xl mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} · {product.reviews} reviews
                </span>
              </div>
              <p className="text-3xl font-serif mb-6">€{product.price}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Color */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Color: <span className="text-muted-foreground font-normal">{color}</span></p>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        color === c.name ? "border-primary ring-2 ring-primary/20" : "border-border"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Size: <span className="text-muted-foreground font-normal">{size}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[3.5rem] h-10 px-3 rounded-full border text-sm transition-all ${
                        size === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-foreground/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
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
                >
                  Add to bag · €{product.price * qty}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 flex-1"
                  onClick={() => handleAdd(true)}
                >
                  Buy it now
                </Button>
                <Button size="icon" variant="outline" className="rounded-full h-12 w-12" aria-label="Wishlist">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { Icon: Truck, l: "Free EU shipping" },
                  { Icon: RefreshCw, l: "30-day returns" },
                  { Icon: ShieldCheck, l: "Secure payment" },
                ].map(({ Icon, l }) => (
                  <div key={l} className="text-center p-3 rounded-2xl bg-secondary/50">
                    <Icon className="h-4 w-4 mx-auto mb-1.5 text-primary" />
                    <p className="text-[11px] text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="border-t border-border pt-6">
                <h3 className="font-serif text-lg mb-3">Details & care</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {product.details.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="container mx-auto py-24 md:py-32">
          <h2 className="font-serif text-3xl md:text-4xl mb-10">You may also <em className="italic">love</em></h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5] mb-3 hover-lift">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                </div>
                <h3 className="font-serif text-base">{p.name}</h3>
                <p className="text-sm text-muted-foreground">€{p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
};

export default ProductDetails;
