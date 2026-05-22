import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ShoppingBag, Search, Heart, User, X, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { searchProducts, type PublicProduct } from "@/lib/api";
import { toast } from "sonner";

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { isLoggedIn } = useAuth();

  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PublicProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await searchProducts(searchQuery.trim());
        setSearchResults(res.data ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  const handleSearchResultClick = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/product/${productId}`);
  };

  const handleWishlistClick = () => {
    toast("Wishlist Coming Soon", {
      description: "We are crafting this feature with love for you and your little ones! 🧸",
      duration: 3000,
    });
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate(`/login?redirectUrl=${encodeURIComponent("/cart")}`);
    }
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate("/user/dashboard");
    } else {
      navigate("/login");
    }
  };

  // Helper to determine active state
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-t border-border/40 px-2 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-300 ${
            isActive("/") ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-5 w-5 transition-transform duration-300" />
          <span className="text-[10px] font-medium tracking-tight">Home</span>
          {isActive("/") && (
            <span className="w-1 h-1 rounded-full bg-primary animate-scale-in" />
          )}
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-300 ${
            isActive("/shop") ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="h-5 w-5 transition-transform duration-300" />
          <span className="text-[10px] font-medium tracking-tight">Shop</span>
          {isActive("/shop") && (
            <span className="w-1 h-1 rounded-full bg-primary animate-scale-in" />
          )}
        </Link>

        {/* Search Toggle */}
        <button
          onClick={() => setSearchOpen(true)}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-300 ${
            searchOpen ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="h-5 w-5 transition-transform duration-300" />
          <span className="text-[10px] font-medium tracking-tight">Search</span>
        </button>

        {/* Cart */}
        <button
          onClick={handleCartClick}
          className={`flex flex-col items-center gap-1 flex-1 py-1 relative transition-all duration-300 ${
            isActive("/cart") ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 transition-transform duration-300" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold px-0.5 animate-bounce">
                {count}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">Cart</span>
          {isActive("/cart") && (
            <span className="w-1 h-1 rounded-full bg-primary animate-scale-in" />
          )}
        </button>

        {/* Wishlist */}
        <button
          onClick={handleWishlistClick}
          className="flex flex-col items-center gap-1 flex-1 py-1 text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          <Heart className="h-5 w-5 hover:scale-105 transition-transform" />
          <span className="text-[10px] font-medium tracking-tight">Wishlist</span>
        </button>

        {/* Account */}
        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-300 ${
            isActive("/user") || isActive("/login") ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-5 w-5 transition-transform duration-300" />
          <span className="text-[10px] font-medium tracking-tight">Account</span>
          {(isActive("/user") || isActive("/login")) && (
            <span className="w-1 h-1 rounded-full bg-primary animate-scale-in" />
          )}
        </button>
      </div>

      {/* Search Sheet Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-lg flex flex-col p-5 md:hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-primary font-semibold">Search BugyBoo</h3>
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-1.5 rounded-full hover:bg-secondary/80 transition-colors"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cute dresses, tops, etc..."
              className="w-full h-12 pl-12 pr-10 rounded-full bg-secondary/30 border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-sans"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto min-h-0 pb-10">
            {searchQuery.trim().length >= 2 ? (
              isSearching ? (
                // Beautiful Loading Skeleton
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-4 p-3 rounded-2xl bg-secondary/10 animate-pulse">
                      <div className="w-16 h-16 rounded-xl bg-secondary/30 flex-shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-secondary/30 rounded w-2/3" />
                        <div className="h-3 bg-secondary/30 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <div className="text-4xl mb-3">🧸</div>
                  <p className="text-sm font-medium">No clothes or products found</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">Try another keyword, e.g. "frock", "pink"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {searchResults.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleSearchResultClick(product._id)}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-secondary/10 hover:bg-secondary/20 active:bg-secondary/30 transition-colors text-left"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={product.images?.[0] ?? ""}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground mb-1 capitalize">{product.category?.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-primary">₹{product.sellPrice}</span>
                          {product.basePrice > product.sellPrice && (
                            <span className="text-xs text-muted-foreground line-through">₹{product.basePrice}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              // Initial State / Popular Search Queries
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Suggested Collections</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Frock", "Nightwear", "Pink Top", "Occasions", "Boys", "Girls"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-4 py-2 rounded-full bg-secondary/20 hover:bg-secondary/30 active:scale-95 transition-all text-xs font-medium text-foreground"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                    💖
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-primary">Handcrafted with Care</h5>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Every piece at BugyBoo is slowly crafted with child-safe organic fabrics.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
