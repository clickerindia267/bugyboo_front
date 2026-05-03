import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUserOrders, getUserOrder, UserOrder } from "@/lib/api";
import { toast } from "sonner";

export default function UserOrders() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
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

  const handleViewOrderDetails = async (orderId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    try {
      const response = await getUserOrder(orderId, accessToken);
      setSelectedOrder(response.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load order details");
    }
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

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 font-sans">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground">Order ID</p>
                  <p className="text-muted-foreground">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Order Date</p>
                  <p className="text-muted-foreground">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Status</p>
                  <p className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1
                    ${selectedOrder.orderStatus === 'completed' ? 'bg-accent text-accent-foreground' : ''}
                    ${selectedOrder.orderStatus === 'ordered' ? 'bg-beige text-beige-foreground' : ''}
                    ${selectedOrder.orderStatus === 'cancelled' ? 'bg-destructive/10 text-destructive' : ''}
                  `}>
                    {selectedOrder.orderStatus === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                    {selectedOrder.orderStatus === 'ordered' && <Clock className="w-3 h-3" />}
                    {selectedOrder.orderStatus === 'ordered' ? 'Pending' : selectedOrder.orderStatus === 'completed' ? 'Delivered' : selectedOrder.orderStatus}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Total Amount</p>
                  <p className="text-primary font-bold">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Customer Details</h3>
                <div className="bg-secondary/30 rounded-lg p-4 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.contact.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.contact.email}</p>
                  <p><span className="font-medium">Mobile:</span> {selectedOrder.contact.mobile}</p>
                </div>
              </div>

              {selectedOrder.address && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Shipping Address</h3>
                  <div className="bg-secondary/30 rounded-lg p-4 text-sm">
                    <p>{selectedOrder.address}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-foreground mb-3">Payment Details</h3>
                <div className="bg-secondary/30 rounded-lg p-4 text-sm">
                  <p><span className="font-medium">Method:</span> {selectedOrder.paymentMethod}</p>
                  <p><span className="font-medium">Status:</span> {selectedOrder.paymentStatus}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.products.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 bg-secondary/30 rounded-lg p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product?.name || "Product"} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.product?.name || "Product"}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
