import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUserOrders, getUserOrder, UserOrder } from "@/lib/api";
import { toast } from "sonner";

export default function UserOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    setIsLoading(true);
    getUserOrders(accessToken)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load orders");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/user/orders/${orderId}`);
  };

  const OrderCard = ({ order }: { order: UserOrder }) => {
    const productItem = order.products?.[0];
    const productName = productItem?.product?.name ?? "Product";
    const productImage = productItem?.product?.images?.[0] ?? "";
    const statusLabel = order.orderStatus === 'ordered' ? 'Pending' : order.orderStatus === 'completed' ? 'Delivered' : order.orderStatus === 'cancelled' ? 'Cancelled' : order.orderStatus;

    return (
      <Card className="border-none shadow-soft rounded-2xl bg-card mb-4 overflow-hidden hover:shadow-elegant transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6 font-sans">
          <div className="flex gap-4">
            <img src={productImage} alt={productName} className="w-20 h-24 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-serif text-lg text-foreground">{productName}</h3>
                  <p className="text-xs text-muted-foreground">{order._id} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
                  ${statusLabel === 'Delivered' ? 'bg-accent text-accent-foreground' : ''}
                  ${statusLabel === 'Pending' ? 'bg-beige text-beige-foreground' : ''}
                  ${statusLabel === 'Cancelled' ? 'bg-destructive/10 text-destructive' : ''}
                `}>
                  {statusLabel === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                  {statusLabel === 'Pending' && <Clock className="w-3 h-3" />}
                  {statusLabel}
                </div>
              </div>
              <p className="text-sm font-bold text-primary">₹{order.totalAmount}</p>
              <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg px-3 font-sans" onClick={() => handleViewOrderDetails(order._id)}>
                <Eye className="h-4 w-4 mr-1" /> View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground font-sans">No orders found</p>
    </div>
  );

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">My Orders</h1>
        <p className="text-sm lg:text-base text-muted-foreground font-sans">Track and manage your orders</p>
      </div>

      <Tabs defaultValue="total" className="w-full">
        <TabsList className="bg-card p-1 rounded-xl shadow-sm mb-4 lg:mb-6 h-auto font-sans flex flex-wrap">
          <TabsTrigger value="total" className="rounded-lg px-3 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="delivered" className="rounded-lg px-3 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Delivered ({orders.filter(o => o.orderStatus === 'completed').length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-3 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pending ({orders.filter(o => o.orderStatus === 'ordered').length})</TabsTrigger>
        </TabsList>
        <TabsContent value="total" className="mt-0 outline-none">
          {isLoading ? <div className="text-center py-8">Loading...</div> : orders.length === 0 ? <EmptyState /> : orders.map(o => <OrderCard key={o._id} order={o} />)}
        </TabsContent>
        <TabsContent value="delivered" className="mt-0 outline-none">
          {isLoading ? <div className="text-center py-8">Loading...</div> : orders.filter(o => o.orderStatus === 'completed').length === 0 ? <EmptyState /> : orders.filter(o => o.orderStatus === 'completed').map(o => <OrderCard key={o._id} order={o} />)}
        </TabsContent>
        <TabsContent value="pending" className="mt-0 outline-none">
          {isLoading ? <div className="text-center py-8">Loading...</div> : orders.filter(o => o.orderStatus === 'ordered').length === 0 ? <EmptyState /> : orders.filter(o => o.orderStatus === 'ordered').map(o => <OrderCard key={o._id} order={o} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
