import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, Heart, LogOut, Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { logout, searchProducts, type PublicProduct } from "@/lib/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {

  const { count } = useCart();
  const { isLoggedIn, user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PublicProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  /** Navigate to cart — if not logged in, send to login with redirectUrl */
  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate(`/login?redirectUrl=${encodeURIComponent("/cart")}`);
    }
  };

  /** Logout — clear auth, go to homepage */
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    clearAuth();

    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch {
        // silently ignore
      }
    }

    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSearchResultClick = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/product/${productId}`);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[60] transition-all duration-500 bg-white ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="BugyBoo Baby Shop"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-soft group-hover:scale-105 transition-transform duration-500"
          />
          <span className="font-serif text-xl md:text-2xl tracking-tight text-primary">
            <span className="font-semibold">Bugy</span><span className="italic font-light">Boo</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `story-link text-sm font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchOpen((s) => !s);
              if (searchOpen) {
                setSearchQuery("");
                setSearchResults([]);
              }
            }}
            className="rounded-full hover:bg-accent/50"
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </Button>


          <Button variant="ghost" size="icon" className="hidden md:inline-flex rounded-full hover:bg-accent/50" aria-label="Wishlist">
            <Heart className="h-[18px] w-[18px]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/50 relative"
            aria-label="Cart"
            onClick={handleCartClick}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Button>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full text-sm gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border/50 rounded-2xl min-w-[180px]">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/user/dashboard")}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/user/orders")}>My Orders</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/user/address")}>Addresses</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="rounded-full text-sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button
                  className="rounded-full text-sm bg-primary hover:bg-primary/90 shadow-soft"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full" aria-label="Account">
                <div className="w-8 h-8 rounded-full bg-gradient-soft flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-border/50 rounded-2xl mr-2">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/user/dashboard")}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/user/orders")}>My Orders</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg" onClick={handleCartClick}>Cart</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/user/address")}>Addresses</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/login")}>Login</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/signup")}>Sign up</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg" onClick={handleCartClick}>Cart</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border/40 bg-background animate-fade-in">
          <div className="container mx-auto py-4 px-4">
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                  navigate(`/shop`);
                }
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products…"
                className="w-full h-12 pl-12 pr-4 rounded-full bg-background/60 border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </form>

            {/* Search results dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border/40 bg-background shadow-elegant">
                {isSearching && (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    Searching...
                  </div>
                )}
                {!isSearching && searchResults.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No products found for "{searchQuery}"
                  </div>
                )}
                {!isSearching && searchResults.length > 0 && (
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleSearchResultClick(product._id)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-accent/30 transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                          <img
                            src={product.images?.[0] ?? ""}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">₹{product.sellPrice}</span>
                            {product.basePrice > product.sellPrice && (
                              <span className="text-xs text-muted-foreground line-through">₹{product.basePrice}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background animate-fade-in">
          <nav className="container mx-auto py-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                className="px-4 py-3 rounded-xl hover:bg-accent/40 text-base font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
