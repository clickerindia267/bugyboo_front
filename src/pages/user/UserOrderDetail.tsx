import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CreditCard, 
  User, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Calendar,
  IndianRupee,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserOrder, type UserOrder } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";

const UserOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [order, setOrder] = useState<UserOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getUserOrder(id, accessToken);
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, accessToken]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-sans">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 px-4">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl mb-2">Order not found</h2>
        <p className="text-muted-foreground mb-6 font-sans">We couldn't find the order you're looking for.</p>
        <Button onClick={() => navigate("/user/orders")} className="rounded-full">
          Back to My Orders
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-destructive" />;
      default: return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const statusLabel = order.orderStatus === 'ordered' ? 'Pending' : order.orderStatus === 'completed' ? 'Delivered' : order.orderStatus === 'cancelled' ? 'Cancelled' : order.orderStatus;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/user/orders")}
          className="rounded-full hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">Order Details</h1>
          <p className="text-muted-foreground font-sans text-sm">Order #{order._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Status & Summary */}
          <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-card">
            <CardHeader className="bg-secondary/30 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium font-sans">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                  {getStatusIcon(order.orderStatus)}
                  {statusLabel}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 font-sans">
              <div className="space-y-4">
                {order.products.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground text-base leading-tight mb-1">
                            {item.product?.name || "Product"}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-foreground">₹{item.price * item.quantity}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Price per unit: ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6 bg-border/40" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/40">
                  <span className="font-serif text-lg font-semibold">Total Amount</span>
                  <span className="font-serif text-xl font-bold text-primary">₹{order.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline / Additional info could go here */}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer & Shipping */}
          <Card className="border-none shadow-soft rounded-3xl bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Customer info
              </CardTitle>
            </CardHeader>
            <CardContent className="font-sans text-sm space-y-4">
              <div>
                <p className="font-medium text-foreground mb-0.5">{order.contact.name}</p>
                <p className="text-muted-foreground">{order.contact.mobile}</p>
                {order.contact.email && <p className="text-muted-foreground">{order.contact.email}</p>}
              </div>
              
              <Separator className="bg-border/40" />
              
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-1">Shipping address</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {typeof order.address === 'object' && order.address !== null 
                      ? `${(order.address as any).fullAddress}, ${(order.address as any).city}, ${(order.address as any).pincode}, ${(order.address as any).country}`
                      : (order.address as string) || "Address details not provided."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card className="border-none shadow-soft rounded-3xl bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Payment details
              </CardTitle>
            </CardHeader>
            <CardContent className="font-sans text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                  {order.paymentStatus === 'pending' ? 'Pending' : order.paymentStatus}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Help button */}
          <Button variant="outline" className="w-full rounded-full border-primary/20 hover:bg-primary/5 text-primary" asChild>
            <Link to="/contact">Need help with this order?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetail;
