import { ShoppingBag } from "lucide-react";

const FloatingCart = () => {
  return (
    <button
      aria-label="Open cart"
      className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elegant flex items-center justify-center hover:scale-110 transition-transform duration-500 animate-float"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink text-pink-foreground text-[10px] flex items-center justify-center font-medium border-2 border-background">
        2
      </span>
    </button>
  );
};

export default FloatingCart;
