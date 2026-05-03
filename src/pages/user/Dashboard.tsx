import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package, Clock, CheckCircle2 } from "lucide-react";
import { getUserDashboard, UserDashboardData, getUserCart, UserCart } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";

export default function UserDashboard() {
  const { accessToken, user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData>({
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalCartItems: 0,
  });
  const [cartData, setCartData] = useState<UserCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    const loadData = async () => {
      try {
        const [dashboardResponse, cartResponse] = await Promise.all([
          getUserDashboard(accessToken),
          getUserCart(accessToken)
        ]);

        setDashboardData(dashboardResponse.data);
        setCartData(cartResponse.data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  const cartItemsCount = cartData?.products?.length || 0;

  const cards = [
    { title: "Total Orders", value: dashboardData.totalOrders, icon: Package, color: "bg-blue/30 text-blue-foreground" },
    { title: "Delivered", value: dashboardData.deliveredOrders, icon: CheckCircle2, color: "bg-accent text-accent-foreground" },
    { title: "Pending", value: dashboardData.pendingOrders, icon: Clock, color: "bg-beige text-beige-foreground" },
    { title: "Cart Items", value: cartItemsCount, icon: ShoppingCart, color: "bg-pink/30 text-pink-foreground" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-8 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">Welcome Back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1>
          <p className="text-sm lg:text-base text-muted-foreground font-sans">Loading your dashboard...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-none shadow-soft rounded-2xl bg-card overflow-hidden">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                    <div className="h-8 bg-muted rounded animate-pulse w-12"></div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted animate-pulse">
                    <div className="h-6 w-6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">Welcome Back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1>
        <p className="text-sm lg:text-base text-muted-foreground font-sans">Here's a quick look at your account activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="border-none shadow-soft rounded-2xl bg-card overflow-hidden hover:shadow-elegant transition-shadow duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground font-sans">{card.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground font-sans">{card.value}</p>
                </div>
                <div className={`p-2 lg:p-3 rounded-xl ${card.color}`}>
                  <card.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card className="shadow-soft rounded-2xl bg-card p-4 lg:p-6 border-2 border-dashed border-border">
          <p className="text-muted-foreground font-sans text-center py-6 lg:py-8 text-sm lg:text-base">Recent activity will appear here</p>
        </Card>
        <Card className="shadow-soft rounded-2xl bg-card p-4 lg:p-6 border-2 border-dashed border-border">
          <p className="text-muted-foreground font-sans text-center py-6 lg:py-8 text-sm lg:text-base">Wishlist coming soon</p>
        </Card>
      </div>
    </div>
  );
}
