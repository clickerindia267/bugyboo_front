import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, MapPin, LogOut, Menu, X, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { logout } from "@/lib/api";
import { useAuth } from "@/store/auth";
import logo from "@/assets/logo.jpg";

const menuItems = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Cart", path: "/user/cart", icon: ShoppingCart },
  { name: "Orders", path: "/user/orders", icon: Package },
  { name: "Address", path: "/user/address", icon: MapPin },
];

export function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuth, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const navContent = (
    <>
      {/* Logo + Brand */}
      <div className="p-5 lg:p-6 border-b border-border/60">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="BugyBoo"
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover shadow-soft group-hover:scale-105 transition-transform duration-500"
          />
          <span className="font-serif text-xl tracking-tight text-primary">
            <span className="font-semibold">Bugy</span><span className="italic font-light">Boo</span>
          </span>
        </Link>
        <p className="text-[11px] text-muted-foreground mt-2 ml-[3px] font-sans tracking-wide uppercase">My Account</p>
      </div>

      {/* User info on mobile */}
      {user && (
        <div className="px-5 py-3 border-b border-border/40 lg:hidden">
          <p className="text-sm font-medium text-foreground font-sans truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground font-sans truncate">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 lg:py-6">
        <nav className="space-y-1 px-3 lg:px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-sans text-sm",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-border/60 space-y-1">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:bg-secondary hover:text-primary rounded-xl transition-all duration-300 font-sans text-sm"
        >
          <Home className="h-[18px] w-[18px]" />
          <span className="font-medium">Back to Store</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 font-sans text-sm"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-border/60 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="BugyBoo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-serif text-lg tracking-tight text-primary">
            <span className="font-semibold">Bugy</span><span className="italic font-light">Boo</span>
          </span>
        </Link>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-border/60 flex flex-col transition-transform duration-300 pt-14",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-border/60 flex-col h-full sticky top-0">
        {navContent}
      </aside>
    </>
  );
}
