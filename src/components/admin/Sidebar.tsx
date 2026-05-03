import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Tags, Package, ShoppingCart, FileText, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { logout } from "@/lib/api";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Category", path: "/admin/categories", icon: Tags },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Blog", path: "/admin/blogs", icon: FileText },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    if (refreshToken) {
      try {
        await logout(refreshToken);
        toast.success("Logged out successfully");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Logout failed");
      }
    }

    navigate("/");
  };

  return (
    <aside className="w-64 lg:w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-serif text-primary font-bold tracking-tight">BugyBoo</h2>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-sans",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 font-sans"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
