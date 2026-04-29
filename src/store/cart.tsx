import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { products, Product } from "@/data/products";

export type CartItem = {
  productId: number;
  size: string;
  color: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: number, size: string, color: string) => void;
  setQty: (productId: number, size: string, color: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: (CartItem & { product: Product })[];
};

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("petite-lune-cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("petite-lune-cart", JSON.stringify(items));
  }, [items]);

  const add: CartCtx["add"] = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  };

  const remove: CartCtx["remove"] = (productId, size, color) =>
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color)));

  const setQty: CartCtx["setQty"] = (productId, size, color, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size && i.color === color ? { ...i, qty: Math.max(1, qty) } : i,
      ),
    );

  const clear = () => setItems([]);

  const detailed = useMemo(
    () =>
      items
        .map((i) => {
          const product = products.find((p) => p.id === i.productId);
          return product ? { ...i, product } : null;
        })
        .filter(Boolean) as (CartItem & { product: Product })[],
    [items],
  );

  const count = detailed.reduce((s, i) => s + i.qty, 0);
  const subtotal = detailed.reduce((s, i) => s + i.qty * i.product.price, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal, detailed }}>{children}</Ctx.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
