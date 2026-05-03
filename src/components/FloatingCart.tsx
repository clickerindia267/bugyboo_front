import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";

const FloatingCart = () => {
  const navigate = useNavigate();
  const { count } = useCart();
  const { isLoggedIn } = useAuth();

  const handleClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate(`/login?redirectUrl=${encodeURIComponent("/cart")}`);
    }
  };

  return (
    <button
      aria-label="Open cart"
      onClick={handleClick}
      className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elegant flex items-center justify-center hover:scale-110 transition-transform duration-500 animate-float"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink text-pink-foreground text-[10px] flex items-center justify-center font-medium border-2 border-background">
          {count}
        </span>
      )}
    </button>
  );
};

export default FloatingCart;
