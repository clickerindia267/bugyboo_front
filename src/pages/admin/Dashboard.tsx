import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, IndianRupee, ShoppingCart, Clock, CreditCard } from "lucide-react";
import { getAdminDashboard, AdminDashboardData } from "@/lib/api";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalPayments: 0,
    pendingOrders: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    getAdminDashboard(accessToken)
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load dashboard data");
      });
  }, []);

  const cards = [
    {
      title: "Total Orders",
      value: dashboardData.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue/30 text-blue-foreground",
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardData.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-accent text-accent-foreground",
    },
    {
      title: "Total Payments",
      value: `₹${dashboardData.totalPayments.toLocaleString("en-IN")}`,
      icon: CreditCard,
      color: "bg-lavender/30 text-lavender-foreground",
    },
    {
      title: "Pending Orders",
      value: dashboardData.pendingOrders,
      icon: Package,
      color: "bg-beige text-beige-foreground",
    },
    {
      title: "Pending Payments",
      value: `₹${dashboardData.pendingPayments.toLocaleString("en-IN")}`,
      icon: Clock,
      color: "bg-pink/30 text-pink-foreground",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">Welcome Back, Admin 👋</h1>
        <p className="text-sm lg:text-base text-muted-foreground font-sans">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {cards.map((card, index) => (
          <Card key={index} className="border-none shadow-soft rounded-2xl bg-card overflow-hidden hover:shadow-elegant transition-shadow duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between space-x-3 lg:space-x-4">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground font-sans truncate">{card.title}</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground font-sans truncate">{card.value}</p>
                </div>
                <div className={`p-2 lg:p-3 rounded-xl flex-shrink-0 ${card.color}`}>
                  <card.icon className="h-4 w-4 lg:h-6 lg:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Placeholder for future charts/graphs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mt-6 lg:mt-8">
        <Card className="shadow-soft rounded-2xl bg-card p-4 lg:p-6 h-[250px] lg:h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-border">
          <p className="font-sans text-sm lg:text-base text-center">Revenue Chart Area</p>
        </Card>
        <Card className="shadow-soft rounded-2xl bg-card p-4 lg:p-6 h-[250px] lg:h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-border">
          <p className="font-sans text-sm lg:text-base text-center">Recent Orders Area</p>
        </Card>
      </div>
    </div>
  );
}
