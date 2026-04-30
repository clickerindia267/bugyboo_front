import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";

const Field = ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</span>
    <input
      {...props}
      className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
    />
  </label>
);

const Address = () => {
  const navigate = useNavigate();
  const { subtotal, count } = useCart();
  const [shipping, setShipping] = useState("standard");

  if (count === 0) {
    return (
      <PageShell title="Your bag is empty" eyebrow="Address">
        <div className="container mx-auto pb-24 text-center">
          <Button className="rounded-full" onClick={() => navigate("/shop")}>
            Start shopping
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Where to?" eyebrow="Step 1 of 2" subtitle="Where should we deliver your little treasures?">
      <section className="container mx-auto pb-24">
        <div className="flex items-center justify-center gap-4 mb-10">
          {["Bag", "Address", "Payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  i <= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-sm ${i <= 1 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < 2 && <span className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/payment");
          }}
          className="grid lg:grid-cols-[1fr_380px] gap-10 max-w-5xl mx-auto"
        >
          <div className="space-y-8">
            <div className="rounded-3xl bg-card border border-border/50 p-7">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-serif text-xl">Contact</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First name" required defaultValue="Camille" />
                <Field label="Last name" required defaultValue="Moreau" />
                <Field label="Email" type="email" required defaultValue="camille@example.com" />
                <Field label="Phone" type="tel" required defaultValue="+33 6 12 34 56 78" />
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border/50 p-7">
              <h3 className="font-serif text-xl mb-5">Shipping address</h3>
              <div className="space-y-4">
                <Field label="Street address" required defaultValue="14 Rue de Rivoli" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="City" required defaultValue="Paris" />
                  <Field label="Postal code" required defaultValue="75004" />
                  <Field label="Country" required defaultValue="France" />
                </div>
                <Field label="Apartment, suite (optional)" />
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border/50 p-7">
              <h3 className="font-serif text-xl mb-5">Shipping method</h3>
              <div className="space-y-3">
                {[
                  { id: "standard", l: "Standard · 3–5 business days", price: subtotal > 100 ? "Free" : "₹9" },
                  { id: "express", l: "Express · 1–2 business days", price: "₹19" },
                  { id: "carbon", l: "Carbon-neutral · 5–7 days", price: "₹6" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      shipping === m.id ? "border-primary bg-secondary/40" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={m.id}
                        checked={shipping === m.id}
                        onChange={() => setShipping(m.id)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{m.l}</span>
                    </div>
                    <span className="text-sm font-medium">{m.price}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="rounded-3xl bg-gradient-cream p-7 shadow-soft">
              <h3 className="font-serif text-xl mb-5">Summary</h3>
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({count})</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{subtotal > 100 ? "Free" : "₹9"}</span>
                </div>
                <div className="flex justify-between font-serif text-lg pt-3 border-t border-border/50 mt-3">
                  <span>Total</span>
                  <span>₹{(subtotal + (subtotal > 100 ? 0 : 9)).toFixed(2)}</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full h-12 group bg-primary hover:bg-primary/90">
                Continue to payment
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </aside>
        </form>
      </section>
    </PageShell>
  );
};

export default Address;
