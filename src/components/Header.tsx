import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, Moon, Sun, Heart } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
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
  const { theme, toggle } = useTheme();
  const { count } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-soft flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-500">
            <span className="font-serif text-lg italic text-primary">p</span>
          </div>
          <span className="font-serif text-xl md:text-2xl tracking-tight">
            Petite <span className="italic">Lune</span>
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
            onClick={() => setSearchOpen((s) => !s)}
            className="rounded-full hover:bg-accent/50"
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="rounded-full hover:bg-accent/50"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          </Button>

          <Button variant="ghost" size="icon" className="hidden md:inline-flex rounded-full hover:bg-accent/50" aria-label="Wishlist">
            <Heart className="h-[18px] w-[18px]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/50 relative"
            aria-label="Cart"
            onClick={() => navigate("/cart")}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Button>

          <div className="hidden md:flex items-center gap-2 ml-2">
            <Button variant="ghost" className="rounded-full text-sm" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button
              className="rounded-full text-sm bg-primary hover:bg-primary/90 shadow-soft"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full" aria-label="Account">
                <div className="w-8 h-8 rounded-full bg-gradient-soft flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-border/50 rounded-2xl mr-2">
              <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/login")}>Login</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/signup")}>Sign up</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/cart")}>Cart</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg" onClick={() => navigate("/address")}>Addresses</DropdownMenuItem>
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
        <div className="border-t border-border/40 glass animate-fade-in">
          <div className="container mx-auto py-4">
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                setSearchOpen(false);
                navigate("/shop");
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search for dresses, knitwear, party wear…"
                className="w-full h-12 pl-12 pr-4 rounded-full bg-background/60 border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
              />
            </form>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 glass animate-fade-in">
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
