import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, User, Mail, Phone, MapPin, Package, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getAdminOrders, getAdminPendingOrders, AdminOrder } from "@/lib/api";
import { toast } from "sonner";

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pendingOrders, setPendingOrders] = useState<AdminOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [fetchedProducts, setFetchedProducts] = useState<Record<string, any>>({});

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    setIsLoadingOrders(true);
    Promise.all([
      getAdminOrders(accessToken).then((response) => setOrders(response.data)),
      getAdminPendingOrders(accessToken).then((response) => setPendingOrders(response.data)),
    ])
      .then(async ([allRes, pendingRes]) => {
        // Collect all unique product IDs that need detail fetching
        const allItems = [...allRes.data, ...pendingRes.data].flatMap(o => o.products);
        const productIdsToFetch = new Set<string>();
        
        allItems.forEach(item => {
          if (item.product?._id && (!item.product.images || item.product.images.length === 0)) {
            productIdsToFetch.add(item.product._id);
          }
        });

        // Fetch missing product details
        const productDetails: Record<string, any> = {};
        await Promise.all(Array.from(productIdsToFetch).map(async (id) => {
          try {
            const res = await getProductById(id);
            productDetails[id] = res.data;
          } catch (err) {
            console.error(`Failed to fetch product ${id}`, err);
          }
        }));
        
        setFetchedProducts(productDetails);
      })
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
    const statusLabel = order.orderStatus === 'ordered' ? 'Pending' : order.orderStatus === 'completed' ? 'Completed' : order.orderStatus === 'cancelled' ? 'Declined' : order.orderStatus;
    
    const formattedAddress = typeof order.address === 'object' && order.address !== null 
      ? `${order.address.fullAddress}, ${order.address.city}, ${order.address.pincode}, ${order.address.country}`
      : order.address || "No address provided";

    return (
      <Card className="border-none shadow-soft rounded-3xl bg-card mb-6 overflow-hidden hover:shadow-elegant transition-all duration-300 group">
        <CardContent className="p-0 font-sans">
          {/* Header Bar */}
          <div className="bg-secondary/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary shadow-sm">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border shadow-sm
              ${statusLabel === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : ''}
              ${statusLabel === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : ''}
              ${statusLabel === 'Declined' ? 'bg-red-100 text-red-700 border-red-200' : ''}
            `}>
              {statusLabel === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {statusLabel === 'Pending' && <Clock className="w-3.5 h-3.5" />}
              {statusLabel === 'Declined' && <XCircle className="w-3.5 h-3.5" />}
              {statusLabel}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Customer & Shipping Section */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User className="w-3 h-3" /> Customer Details
                  </h4>
                  <div className="bg-background/50 rounded-2xl p-4 border border-border/40 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary/70 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{order.user.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary/70 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-muted-foreground truncate">{order.user.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary/70 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-muted-foreground">{order.contact.mobile}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Shipping Address
                  </h4>
                  <div className="bg-background/50 rounded-2xl p-4 border border-border/40 flex gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary/70 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{formattedAddress}</p>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="lg:col-span-7">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Package className="w-3 h-3" /> Order Items ({order.products.length})
                </h4>
                <div className="space-y-3">
                  {order.products.map((item, idx) => {
                    const productData = item.product?._id ? fetchedProducts[item.product._id] || item.product : item.product;
                    const productName = productData?.name || "Deleted Product";
                    const productImage = productData?.images?.[0];

                    return (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl border border-border/30 bg-secondary/10 hover:bg-secondary/20 transition-colors group/item">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0 border border-border/50 shadow-sm">
                          {productImage ? (
                            <img src={productImage} alt={productName} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground text-sm lg:text-base truncate">{productName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Qty: {item.quantity}</span>
                            <span className="text-xs text-muted-foreground font-medium">Price: ₹{item.price.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm lg:text-base font-black text-primary">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-6 bg-border/40" />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/40 border border-border/40">
                      <CreditCard className="w-4 h-4 text-primary/70" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Payment Method</span>
                        <span className="text-xs font-bold">{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Total Revenue</span>
                      <span className="text-xl font-black text-primary tracking-tighter">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {statusLabel === 'Pending' && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-10 px-6 font-bold" 
                        onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 font-bold shadow-soft" 
                        onClick={() => handleUpdateStatus(order._id, 'completed')}
                      >
                        Accept Order
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground font-sans text-sm lg:text-base">Review and process your customer orders with elegance.</p>
      </div>

      <Tabs defaultValue="total" className="w-full">
        <TabsList className="bg-card p-1 rounded-2xl shadow-soft mb-8 h-auto font-sans flex flex-wrap inline-flex border border-border/40">
          <TabsTrigger value="total" className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            All Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            Pending ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            Completed ({orders.filter(o => o.orderStatus === 'completed').length})
          </TabsTrigger>
        </TabsList>

        <div className="mt-0">
          {isLoadingOrders ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase">Fetching Orders...</p>
            </div>
          ) : (
            <>
              <TabsContent value="total" className="mt-0 outline-none">
                {orders.map(order => <OrderCard key={order._id} order={order} />)}
                {orders.length === 0 && (
                  <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border/60">
                    <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-serif text-xl italic">Your order history is currently empty.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-0 outline-none">
                {pendingOrders.map(order => <OrderCard key={order._id} order={order} />)}
                {pendingOrders.length === 0 && (
                  <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border/60">
                    <CheckCircle2 className="w-16 h-16 text-green-500/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-serif text-xl italic">All orders have been processed. Great job!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-0 outline-none">
                {orders.filter(o => o.orderStatus === 'completed').map(order => <OrderCard key={order._id} order={order} />)}
                {orders.filter(o => o.orderStatus === 'completed').length === 0 && (
                  <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border/60">
                    <Clock className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-serif text-xl italic">No completed orders found.</p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}
