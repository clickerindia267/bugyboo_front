import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { getUserCart, removeFromCart, updateCart, getProductById, type UserCart, type CartProduct, type PublicProduct } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";

interface CartItemWithProduct extends CartProduct {
  product?: PublicProduct;
  loadingProduct?: boolean;
}

const Cart = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { refreshCart } = useCart();
  const [cartData, setCartData] = useState<UserCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await getUserCart(accessToken);
      setCartData(response.data);
      return response.data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load cart");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const normalizeProductId = (productId: string | { _id: string }) =>
    typeof productId === "object" && productId !== null ? productId._id : productId;

  // Fetch product details for each cart item
  const fetchProductDetails = useCallback(async (cart: UserCart) => {
    const items: CartItemWithProduct[] = cart.products.map((p) => ({
      ...p,
      productId: normalizeProductId(p.productId as any),
      loadingProduct: true,
    }));
    setCartItems(items);

    const updated = await Promise.all(
      items.map(async (item) => {
        try {
          const res = await getProductById(item.productId);
          return { ...item, product: res.data, loadingProduct: false };
        } catch {
          return { ...item, loadingProduct: false };
        }
      })
    );
    setCartItems(updated);
  }, []);

  useEffect(() => {
    fetchCart().then((cart) => {
      if (cart && cart.products.length > 0) {
        fetchProductDetails(cart);
      }
    });
  }, [fetchCart, fetchProductDetails]);

  // Update quantity via API
  const handleUpdateQty = async (productId: string, newQty: number) => {
    if (!accessToken || newQty < 1) return;
    const normalizedId = normalizeProductId(productId as any);
    setUpdatingId(normalizedId);
    try {
      const response = await updateCart(normalizedId, newQty, accessToken);
      setCartData(response.data);
      // Update cart items locally
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === normalizedId ? { ...item, quantity: newQty } : item
        )
      );
      // Sync the global cart store
      refreshCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update cart");
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove item via dedicated cart remove API
  const handleRemove = async (productId: string) => {
    if (!accessToken || !cartData?._id) return;
    const normalizedId = normalizeProductId(productId as any);
    setUpdatingId(normalizedId);
    try {
      const response = await removeFromCart(normalizedId, accessToken);
      setCartData(response.data);
      setCartItems((prev) => prev.filter((item) => item.productId !== normalizedId));
      toast.success("Item removed from cart");
      // Sync the global cart store
      refreshCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  const count = cartItems.length;
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.sellPrice ?? 0;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <PageShell title="Your bag" eyebrow="Cart" subtitle="Loading your cart...">
        <section className="container mx-auto pb-24 px-4">
          <div className="text-center py-16">
            <div className="inline-flex w-20 h-20 rounded-full bg-secondary items-center justify-center mb-6">
              <ShoppingBag className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell title="Your bag" eyebrow="Cart" subtitle={count === 0 ? "Empty for now — let's find something lovely." : `${count} item${count > 1 ? "s" : ""} waiting for you.`}>
      <section className="container mx-auto pb-24 px-4">
        {count === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex w-20 h-20 rounded-full bg-secondary items-center justify-center mb-6">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-6">Your bag is empty</p>
            <Link to="/shop">
              <Button className="rounded-full px-8 h-12">Discover the collection</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            {/* Cart items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`flex gap-4 md:gap-6 p-4 md:p-5 rounded-2xl bg-card border border-border/30 transition-opacity ${
                    updatingId === item.productId ? "opacity-60" : ""
                  }`}
                >
                  {/* Product image */}
                  <Link
                    to={`/product/${item.productId}`}
                    className="shrink-0 w-24 h-28 md:w-28 md:h-32 rounded-xl overflow-hidden bg-secondary"
                  >
                    {item.loadingProduct ? (
                      <div className="w-full h-full shimmer" />
                    ) : (
                      <img
                        src={item.product?.images?.[0] ?? ""}
                        alt={item.product?.name ?? "Product"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </Link>

                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    {item.loadingProduct ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 w-3/4 rounded shimmer" />
                        <div className="h-3 w-1/2 rounded shimmer" />
                        <div className="h-5 w-20 rounded shimmer mt-2" />
                      </div>
                    ) : (
                      <>
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="font-serif text-base md:text-lg leading-tight hover:text-primary transition-colors">
                            {item.product?.name ?? "Product"}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 mb-3">
                          {item.product?.color && <span>Color: {item.product.color}</span>}
                          {item.product?.size && (
                            <>
                              <span>·</span>
                              <span>Size: {item.product.size}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-base font-medium">₹{item.product?.sellPrice ?? 0}</span>
                          {item.product && item.product.basePrice > item.product.sellPrice && (
                            <span className="text-xs text-muted-foreground line-through">₹{item.product.basePrice}</span>
                          )}
                        </div>
                      </>
                    )}

                    {/* Qty controls + remove */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-border rounded-full">
                        <button
                          onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                          disabled={updatingId === item.productId || item.quantity <= 1}
                          className="w-9 h-9 flex items-center justify-center hover:bg-secondary rounded-full disabled:opacity-40"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {updatingId === item.productId ? (
                            <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                          disabled={updatingId === item.productId}
                          className="w-9 h-9 flex items-center justify-center hover:bg-secondary rounded-full disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={updatingId === item.productId}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2 disabled:opacity-40"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <Link to="/shop" className="text-sm story-link text-muted-foreground hover:text-foreground">
                  ← Continue shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="rounded-3xl bg-gradient-cream p-7 shadow-soft">
                <h3 className="font-serif text-2xl mb-5">Order summary</h3>

                <div className="space-y-3 text-sm border-t border-border/50 pt-5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({count} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders above ₹500
                    </p>
                  )}
                  <div className="flex justify-between font-serif text-lg pt-3 border-t border-border/50">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full rounded-full mt-6 bg-primary hover:bg-primary/90 h-12 shadow-soft group"
                  onClick={() => navigate("/address")}
                  disabled={count === 0}
                >
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free shipping on orders above ₹500 · Easy returns
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
