import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { toast } from "@/hooks/use-toast";

const Payment = () => {
  const navigate = useNavigate();
  const { subtotal, count, clear, detailed } = useCart();
  const [method, setMethod] = useState("card");
  const total = subtotal + (subtotal > 100 ? 0 : 9);

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Order placed", description: "Thank you — a confirmation is on its way." });
    clear();
    setTimeout(() => navigate("/"), 800);
  };

  if (count === 0) {
    return (
      <PageShell title="Nothing to pay for yet" eyebrow="Payment">
        <div className="container mx-auto pb-24 text-center">
          <Button className="rounded-full" onClick={() => navigate("/shop")}>
            Browse the collection
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Almost yours" eyebrow="Step 2 of 2" subtitle="Secure checkout — your details are encrypted.">
      <section className="container mx-auto pb-24">
        <div className="flex items-center justify-center gap-4 mb-10">
          {["Bag", "Address", "Payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${i <= 2 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                {i + 1}
              </div>
              <span className="text-sm">{s}</span>
              {i < 2 && <span className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-10 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="rounded-3xl bg-card border border-border/50 p-7">
              <h3 className="font-serif text-xl mb-5">Payment method</h3>
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[
                  { id: "card", l: "Card", Icon: CreditCard },
                  { id: "paypal", l: "PayPal", Icon: ShieldCheck },
                  { id: "apple", l: "Apple Pay", Icon: Lock },
                ].map(({ id, l, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                      method === id ? "border-primary bg-secondary/40" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{l}</span>
                  </button>
                ))}
              </div>

              {method === "card" && (
                <div className="space-y-4 animate-fade-in">
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Card number</span>
                    <div className="relative">
                      <input
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full h-12 px-4 pr-12 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Cardholder name</span>
                    <input
                      required
                      placeholder="Camille Moreau"
                      className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Expiry</span>
                      <input
                        required
                        placeholder="MM / YY"
                        className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">CVC</span>
                      <input
                        required
                        placeholder="123"
                        className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
                      />
                    </label>
                  </div>
                </div>
              )}
              {method !== "card" && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  You'll be redirected to {method === "paypal" ? "PayPal" : "Apple Pay"} to complete payment.
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 px-2">
              <input type="checkbox" required className="mt-1 accent-primary" />
              <span className="text-sm text-muted-foreground">
                I agree to the <a href="#" className="text-foreground story-link">Terms</a> and{" "}
                <a href="#" className="text-foreground story-link">Privacy Policy</a>.
              </span>
            </label>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="rounded-3xl bg-gradient-cream p-7 shadow-soft">
              <h3 className="font-serif text-xl mb-5">Your order</h3>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {detailed.map((i) => (
                  <div key={`${i.productId}-${i.size}-${i.color}`} className="flex gap-3 items-center">
                    <img src={i.product.img} alt={i.product.name} className="w-12 h-14 object-cover rounded-lg" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium leading-tight">{i.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.size} · {i.color} · ×{i.qty}
                      </p>
                    </div>
                    <span className="text-sm">€{i.product.price * i.qty}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-border/50 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{subtotal > 100 ? "Free" : "€9"}</span>
                </div>
                <div className="flex justify-between font-serif text-lg pt-3 border-t border-border/50 mt-3">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full mt-6 h-12 bg-primary hover:bg-primary/90 group">
                <Lock className="h-3.5 w-3.5 mr-2" />
                Pay €{total.toFixed(2)}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3 w-3" />
                256-bit SSL encryption
              </p>
            </div>
          </aside>
        </form>
      </section>
    </PageShell>
  );
};

export default Payment;
