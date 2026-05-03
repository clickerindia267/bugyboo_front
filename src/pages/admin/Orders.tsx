import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminOrders, getAdminPendingOrders, AdminOrder } from "@/lib/api";
import { toast } from "sonner";

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pendingOrders, setPendingOrders] = useState<AdminOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    setIsLoadingOrders(true);
    Promise.all([
      getAdminOrders(accessToken).then((response) => setOrders(response.data)),
      getAdminPendingOrders(accessToken).then((response) => setPendingOrders(response.data)),
    ])
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load orders");
      })
      .finally(() => setIsLoadingOrders(false));
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(order => order._id === id ? { ...order, orderStatus: newStatus } : order));
    setPendingOrders(pendingOrders.filter(order => order._id !== id));
    toast.success(`Order ${newStatus.toLowerCase()}`);
  };

  const OrderCard = ({ order }: { order: AdminOrder }) => {
    const productItem = order.products?.[0];
    const productName = productItem?.product?.name ?? "Product";
    const productImage = productItem?.product?.images?.[0] ?? "";
    const statusLabel = order.orderStatus === 'ordered' ? 'Pending' : order.orderStatus === 'completed' ? 'Completed' : order.orderStatus === 'cancelled' ? 'Declined' : order.orderStatus;

    return (
      <Card className="border-none shadow-soft rounded-2xl bg-card mb-4 overflow-hidden hover:shadow-elegant transition-shadow duration-300">
        <CardContent className="p-4 lg:p-6 font-sans">
          <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-foreground mb-1">{order._id}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 self-start
                  ${statusLabel === 'Completed' ? 'bg-accent text-accent-foreground' : ''}
                  ${statusLabel === 'Pending' ? 'bg-beige text-beige-foreground' : ''}
                  ${statusLabel === 'Declined' ? 'bg-destructive/10 text-destructive' : ''}
                `}>
                  {statusLabel === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                  {statusLabel === 'Pending' && <Clock className="w-3 h-3" />}
                  {statusLabel === 'Declined' && <XCircle className="w-3 h-3" />}
                  {statusLabel}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-1">Customer Details</p>
                  <p className="text-muted-foreground text-sm">{order.user.name}</p>
                  <p className="text-muted-foreground text-sm">{order.user.email}</p>
                  <p className="text-muted-foreground text-sm">{order.contact.mobile}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Shipping Address</p>
                  <p className="text-muted-foreground leading-relaxed text-sm">{order.address}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 lg:border-l lg:border-border lg:pl-6">
              <p className="font-semibold text-foreground mb-3">Order Items</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  {productImage ? <img src={productImage} alt={productName} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{productName}</p>
                  <p className="text-sm font-bold text-primary mt-1">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>
          {statusLabel === 'Pending' && (
            <div className="mt-4 lg:mt-6 pt-4 border-t border-border flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 order-2 sm:order-1" onClick={() => handleUpdateStatus(order._id, 'cancelled')}>Decline Order</Button>
              <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground order-1 sm:order-2" onClick={() => handleUpdateStatus(order._id, 'completed')}>Accept Order</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">Orders</h1>
        <p className="text-sm lg:text-base text-muted-foreground font-sans">Manage and process customer orders</p>
      </div>
      <Tabs defaultValue="total" className="w-full">
        <TabsList className="bg-card p-1 rounded-xl shadow-sm mb-4 lg:mb-6 h-auto font-sans flex flex-wrap">
          <TabsTrigger value="total" className="rounded-lg px-3 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Total ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-3 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg px-3 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Completed ({orders.filter(o => o.orderStatus === 'completed').length})</TabsTrigger>
        </TabsList>
        <TabsContent value="total" className="mt-0 outline-none">
          {orders.map(order => <OrderCard key={order._id} order={order} />)}
          {orders.length === 0 && <p className="text-muted-foreground text-center py-8 font-sans">No orders found.</p>}
        </TabsContent>
        <TabsContent value="pending" className="mt-0 outline-none">
          {pendingOrders.map(order => <OrderCard key={order._id} order={order} />)}
          {pendingOrders.length === 0 && <p className="text-muted-foreground text-center py-8 font-sans">No pending orders.</p>}
        </TabsContent>
        <TabsContent value="completed" className="mt-0 outline-none">
          {orders.filter(o => o.orderStatus === 'completed').map(order => <OrderCard key={order._id} order={order} />)}
          {orders.filter(o => o.orderStatus === 'completed').length === 0 && <p className="text-muted-foreground text-center py-8 font-sans">No completed orders.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
