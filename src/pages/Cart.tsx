import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
  const { detailed, setQty, remove, subtotal, count, clear } = useCart();
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyPromo = () => {
    if (promo.toUpperCase() === "LUNE10") {
      setDiscount(subtotal * 0.1);
      toast({ title: "Promo applied", description: "10% off your order." });
    } else {
      toast({ title: "Invalid code", description: "Try LUNE10 for 10% off." });
    }
  };

  return (
    <PageShell title="Your bag" eyebrow="Cart" subtitle={count === 0 ? "Empty for now — let's find something lovely." : `${count} item${count > 1 ? "s" : ""} waiting for you.`}>
      <section className="container mx-auto pb-24">
        {detailed.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex w-20 h-20 rounded-full bg-secondary items-center justify-center mb-6">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <Link to="/shop">
              <Button className="rounded-full px-8 h-12">Discover the collection</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            <div className="space-y-4">
              {detailed.map((i) => (
                <div
                  key={`${i.productId}-${i.size}-${i.color}`}
                  className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50 hover-lift"
                >
                  <Link to={`/product/${i.product.slug}`} className="shrink-0">
                    <img src={i.product.img} alt={i.product.name} className="w-24 h-32 object-cover rounded-xl" />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-3 mb-1">
                      <Link to={`/product/${i.product.slug}`}>
                        <h3 className="font-serif text-lg leading-tight">{i.product.name}</h3>
                      </Link>
                      <p className="font-serif text-base whitespace-nowrap">€{i.product.price * i.qty}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-auto">
                      {i.color} · Size {i.size}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-border rounded-full">
                        <button
                          onClick={() => setQty(i.productId, i.size, i.color, i.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-full"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.productId, i.size, i.color, i.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-full"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.productId, i.size, i.color)}
                        className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <Link to="/shop" className="text-sm story-link text-muted-foreground hover:text-foreground">
                  ← Continue shopping
                </Link>
                <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive">
                  Clear bag
                </button>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="rounded-3xl bg-gradient-cream p-7 shadow-soft">
                <h3 className="font-serif text-2xl mb-5">Order summary</h3>

                <div className="flex gap-2 mb-5">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 h-11 px-4 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                  <Button onClick={applyPromo} variant="outline" className="rounded-full h-11">
                    Apply
                  </Button>
                </div>

                <div className="space-y-3 text-sm border-t border-border/50 pt-5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount (LUNE10)</span>
                      <span>-€{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `€${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg pt-3 border-t border-border/50">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full rounded-full mt-6 bg-primary hover:bg-primary/90 h-12 shadow-soft group"
                  onClick={() => navigate("/address")}
                >
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free EU shipping over €100 · 30-day returns
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default Cart;
