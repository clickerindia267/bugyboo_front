import { useState, useEffect } from "react";
import { Search, ShoppingBag, User, Menu, X, Moon, Sun, Heart } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = ["Home", "About", "Shop", "Blog", "Contact"];

const Header = () => {
  const { theme, toggle } = useTheme();
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
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-soft flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-500">
            <span className="font-serif text-lg italic text-primary">p</span>
          </div>
          <span className="font-serif text-xl md:text-2xl tracking-tight">
            Petite <span className="italic">Lune</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="story-link text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
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

          <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/50 relative" aria-label="Cart">
            <ShoppingBag className="h-[18px] w-[18px]" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
              2
            </span>
          </Button>

          {/* Desktop login/signup */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Button variant="ghost" className="rounded-full text-sm">
              Login
            </Button>
            <Button className="rounded-full text-sm bg-primary hover:bg-primary/90 shadow-soft">
              Sign up
            </Button>
          </div>

          {/* Mobile avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full" aria-label="Account">
                <div className="w-8 h-8 rounded-full bg-gradient-soft flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-border/50 rounded-2xl mr-2">
              <DropdownMenuItem className="rounded-lg">Login</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg">Sign up</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg">Profile</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg">Orders</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
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

      {/* Expandable search */}
      {searchOpen && (
        <div className="border-t border-border/40 glass animate-fade-in">
          <div className="container mx-auto py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search for dresses, knitwear, party wear…"
                className="w-full h-12 pl-12 pr-4 rounded-full bg-background/60 border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 glass animate-fade-in">
          <nav className="container mx-auto py-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-3 rounded-xl hover:bg-accent/40 text-base font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
