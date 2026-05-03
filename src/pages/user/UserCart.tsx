import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

export default function UserCart() {
  const { detailed, setQty, remove, subtotal, count, clear } = useCart();

  const handleRemove = (productId: number, size: string, color: string) => {
    remove(productId, size, color);
    toast.success("Item removed from cart");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">My Cart</h1>
        <p className="text-muted-foreground mt-1 font-sans">{count === 0 ? "Your cart is empty" : `${count} item${count > 1 ? "s" : ""} in your cart`}</p>
      </div>

      {detailed.length === 0 ? (
        <Card className="border-none shadow-soft rounded-2xl bg-card">
          <CardContent className="p-12 text-center">
            <div className="inline-flex w-20 h-20 rounded-full bg-secondary items-center justify-center mb-6">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-sans mb-4">No items in your cart yet.</p>
            <Link to="/shop">
              <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-sans">Browse Shop</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {detailed.map((item) => (
            <Card key={`${item.productId}-${item.size}-${item.color}`} className="border-none shadow-soft rounded-2xl bg-card overflow-hidden hover:shadow-elegant transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6 font-sans">
                <div className="flex gap-4">
                  <Link to={`/product/${item.product.slug}`} className="shrink-0">
                    <img src={item.product.img} alt={item.product.name} className="w-20 h-24 sm:w-24 sm:h-32 object-cover rounded-xl" />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-3 mb-1">
                      <Link to={`/product/${item.product.slug}`}>
                        <h3 className="font-serif text-lg leading-tight text-foreground">{item.product.name}</h3>
                      </Link>
                      <p className="font-serif text-base whitespace-nowrap text-foreground">₹{item.product.price * item.qty}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-auto">{item.color} · Size {item.size}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-border rounded-full">
                        <button onClick={() => setQty(item.productId, item.size, item.color, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-full transition-colors"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => setQty(item.productId, item.size, item.color, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-full transition-colors"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => handleRemove(item.productId, item.size, item.color)} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary */}
          <Card className="border-none shadow-soft rounded-2xl bg-card overflow-hidden">
            <CardContent className="p-6 font-sans">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{subtotal > 100 ? "Free" : "₹9"}</span></div>
                <div className="flex justify-between font-serif text-lg pt-3 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground font-bold">₹{(subtotal + (subtotal > 100 ? 0 : 9)).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="rounded-xl font-sans" onClick={clear}>Clear Cart</Button>
                <Link to="/address" className="flex-1">
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-sans">Proceed to Checkout</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
