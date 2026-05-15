import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import { addToCart, getUserCart, updateCart, removeFromCart, getProductById, type ProductVariant } from "@/lib/api";
import { useAuth } from "./auth";
import type { PublicProduct } from "@/lib/api";

export type CartItem = {
  productId: string;
  quantity: number;
  variantId?: string;
  selectedAgeGroup?: string;
  selectedPrice?: number;
  basePrice?: number;
  variant?: ProductVariant;
  _id: string;
  product?: {
    _id: string;
    name: string;
    images: string[];
  };
};

type CartCtx = {
  items: CartItem[];
  add: (
    productId: string,
    quantity: number,
    ageGroup: string,
    selectedPrice: number,
    variant?: ProductVariant,
    basePrice?: number,
    variantId?: string,
  ) => Promise<void>;
  update: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => void;
  refreshCart: () => Promise<void>;
  count: number;
  subtotal: number;
  loading: boolean;
};

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, accessToken } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [isLoggedIn, accessToken]);

  const fetchCart = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const response = await getUserCart(accessToken);
      setCartId(response.data._id);
      const baseItems: CartItem[] = response.data.products.map((p: any) => ({
        productId: typeof p.productId === 'string' ? p.productId : p.productId._id,
        quantity: p.quantity,
        variantId: p.variantId,
        selectedAgeGroup: p.selectedAgeGroup,
        selectedPrice: p.selectedPrice,
        basePrice: p.basePrice,
        variant: p.variant,
        _id: p._id,
        product: typeof p.productId === 'object' ? {
          _id: p.productId._id,
          name: p.productId.name,
          images: p.productId.images,
        } : undefined,
      }));

      // Fetch product details for items that don't have them
      const itemsWithProducts = await Promise.all(
        baseItems.map(async (item) => {
          if (item.product) return item;
          try {
            const productRes = await getProductById(item.productId);
            return {
              ...item,
              product: {
                _id: productRes.data._id,
                name: productRes.data.name,
                sellPrice: productRes.data.sellPrice,
                images: productRes.data.images,
              },
            };
          } catch (error) {
            console.error(`Failed to fetch product details for ${item.productId}:`, error);
            return item;
          }
        })
      );

      setItems(itemsWithProducts);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const add: CartCtx["add"] = async (
    productId,
    quantity,
    ageGroup,
    selectedPrice,
    variant,
    basePrice,
    variantId,
  ) => {
    if (!accessToken) throw new Error('Not logged in');
    try {
      await addToCart(productId, quantity, ageGroup, accessToken, {
        basePrice,
        sellPrice: selectedPrice,
        variantId,
        variant,
      });
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const update: CartCtx["update"] = async (productId, quantity) => {
    if (!accessToken) throw new Error('Not logged in');
    try {
      await updateCart(productId, quantity, accessToken);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const remove: CartCtx["remove"] = async (productId) => {
    if (!accessToken) throw new Error('Not logged in');
    if (!cartId) throw new Error('Cart not loaded');
    try {
      // Use the dedicated remove endpoint (DELETE /cart/remove/:cartId)
      await removeFromCart(productId, accessToken);
      // Optimistically remove from local state
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      // Then refresh from server to ensure consistency
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clear = () => {
    setItems([]);
    setCartId(null);
  };

  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.quantity * (i.selectedPrice ?? 0), 0);

  return (
    <Ctx.Provider value={{ items, add, update, remove, clear, refreshCart, count, subtotal, loading }}>
      {children}
    </Ctx.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
