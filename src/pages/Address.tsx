import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Smartphone, Truck, CheckCircle2, Loader2, X, PartyPopper, Plus } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { getUserAddresses, createOrder, createUserAddress, type UserAddress } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { loadRazorpayScript } from "@/lib/loadRazorpayScript";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayPayment,
} from "@/lib/paymentService";

const Field = ({
  label,
  value,
  onChange,
  ...props
}: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) => (
  <label className="block">
    <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</span>
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
    />
  </label>
);

const Address = () => {
  const navigate = useNavigate();
  const { subtotal, count, clear, refreshCart } = useCart();
  const { user, accessToken } = useAuth();

  // Contact form state
  const [contactName, setContactName] = useState(user?.name ?? "");
  const [contactMobile, setContactMobile] = useState(user?.mobile ?? "");
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");

  // Addresses
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Order
  const [placing, setPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Order Placed!");
  const paymentSessionRef = useRef(false);
  
  // New Address Dialog
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullAddress: "", city: "", pincode: "", country: "India" });
  const [savingAddress, setSavingAddress] = useState(false);

  // Fetch user addresses
  useEffect(() => {
    if (!accessToken) return;
    const fetchAddresses = async () => {
      try {
        const res = await getUserAddresses(accessToken);
        setAddresses(res.data);
        if (res.data.length > 0) {
          setSelectedAddressId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [accessToken]);

  // Pre-fill contact from user
  useEffect(() => {
    if (user) {
      setContactName(user.name ?? "");
      setContactMobile(user.mobile ?? "");
      setContactEmail(user.email ?? "");
    }
  }, [user]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (placing) {
      return;
    }

    if (!accessToken) {
      toast.error("Please log in to place an order");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!contactName.trim() || !contactMobile.trim()) {
      toast.error("Please fill in your contact details");
      return;
    }

    // COD flow: directly create order
    if (paymentMethod === "COD") {
      setPlacing(true);
      try {
        await createOrder(
          {
            contact: {
              name: contactName.trim(),
              mobile: contactMobile.trim(),
              email: contactEmail.trim(),
            },
            addressId: selectedAddressId,
            paymentMethod: "COD",
          },
          accessToken
        );
        clear();
        refreshCart();
        setSuccessMessage("Order Placed Successfully!");
        setShowSuccess(true);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to place order");
      } finally {
        setPlacing(false);
      }
      return;
    }

    // UPI flow: initiate Razorpay payment
    if (paymentMethod === "UPI") {
      await handleUPIPayment();
    }
  };

  /**
   * Handle UPI payment flow:
   * 1. Load Razorpay script
   * 2. Create Razorpay order
   * 3. Open Razorpay popup
   * 4. Verify payment
   * 5. Create ecommerce order
   */
  const handleUPIPayment = async () => {
    if (paymentSessionRef.current) {
      toast.error("Payment already in progress. Please wait.");
      return;
    }

    paymentSessionRef.current = true;
    setPlacing(true);

    try {
      // Step 1: Load Razorpay script
      await loadRazorpayScript();

      // Step 2: Calculate total amount in rupees (backend converts to paise)
      const shipping = subtotal > 500 ? 0 : 49;
      const totalAmount = subtotal + shipping;

      // Step 3: Create Razorpay order
      const orderResponse = await createRazorpayOrder(totalAmount, accessToken);

      const { key, order } = orderResponse.data;

      // Step 4: Open Razorpay payment popup
      const paymentDetails = await handleRazorpayPayment({
        key,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "BugyBoo",
        description: "Order Payment",
        contact: contactMobile.trim(),
        email: contactEmail.trim(),
      });

      // Step 5: Verify payment
      const verificationResponse = await verifyRazorpayPayment(
        paymentDetails,
        accessToken
      );

      if (!verificationResponse.success) {
        toast.error("Payment verification failed");
        setPlacing(false);
        return;
      }

      // Step 6: Create final ecommerce order
      await createOrder(
        {
          contact: {
            name: contactName.trim(),
            mobile: contactMobile.trim(),
            email: contactEmail.trim(),
          },
          addressId: selectedAddressId,
          paymentMethod: "UPI",
          paymentStatus: "paid",
          transactionId: paymentDetails.razorpay_payment_id,
        },
        accessToken
      );

      clear();
      refreshCart();
      setSuccessMessage("Payment Successful! Order Placed!");
      setShowSuccess(true);
    } catch (error) {
      // Handle payment cancellation gracefully
      if (error instanceof Error && error.message.includes("cancelled")) {
        toast.error("Payment cancelled. Please try again.");
      } else {
        toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
      }
    } finally {
      setPlacing(false);
      paymentSessionRef.current = false;
    }
  };

  const handleSaveAddress = async () => {
    if (!newAddress.fullAddress || !newAddress.city || !newAddress.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!accessToken) return;

    setSavingAddress(true);
    try {
      const res = await createUserAddress(newAddress, accessToken);
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddressId(res.data._id);
      setIsAddressDialogOpen(false);
      setNewAddress({ fullAddress: "", city: "", pincode: "", country: "India" });
      toast.success("Address added successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add address");
    } finally {
      setSavingAddress(false);
    }
  };

  if (count === 0 && !showSuccess) {
    return (
      <PageShell title="Your bag is empty" eyebrow="Address">
        <div className="container mx-auto pb-24 text-center">
          <Button className="rounded-full" onClick={() => navigate("/shop")}>
            Start shopping
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <>
      <PageShell title="Checkout" eyebrow="Secure Checkout" subtitle="Fill in your details to complete your order.">
        <section className="container mx-auto pb-24">
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {["Bag", "Checkout"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    i <= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-sm ${i <= 1 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < 1 && <span className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-[1fr_380px] gap-10 max-w-5xl mx-auto">
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="rounded-3xl bg-card border border-border/50 p-7">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-serif text-xl">Contact</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" required value={contactName} onChange={setContactName} />
                  <Field label="Phone" type="tel" required value={contactMobile} onChange={setContactMobile} />
                  <Field label="Email" type="email" value={contactEmail} onChange={setContactEmail} className="sm:col-span-2" />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-3xl bg-card border border-border/50 p-7">
                <h3 className="font-serif text-xl mb-5">Delivery address</h3>
                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading addresses...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-3">No saved addresses found.</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setIsAddressDialogOpen(true)}
                    >
                      Add an address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label
                          key={addr._id}
                          className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                            selectedAddressId === addr._id
                              ? "border-primary bg-secondary/40 shadow-sm"
                              : "border-border hover:border-foreground/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={addr._id}
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="accent-primary mt-0.5"
                          />
                          <div className="text-sm">
                            <p className="font-medium">{addr.fullAddress}</p>
                            <p className="text-muted-foreground">
                              {addr.city}, {addr.pincode}, {addr.country}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddressDialogOpen(true)}
                      className="text-sm text-primary font-medium hover:underline flex items-center gap-1 mt-2"
                    >
                      <Plus className="h-4 w-4" /> Add a new address
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="rounded-3xl bg-card border border-border/50 p-7">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <h3 className="font-serif text-xl">Payment method</h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      id: "COD",
                      label: "Cash on Delivery",
                      desc: "Pay when your order arrives",
                      Icon: Truck,
                    },
                    {
                      id: "UPI",
                      label: "UPI",
                      desc: "Pay via Google Pay, PhonePe, Paytm etc.",
                      Icon: Smartphone,
                    },
                  ].map(({ id, label, desc, Icon }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === id
                          ? "border-primary bg-secondary/40 shadow-sm"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)}
                        className="accent-primary"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="rounded-3xl bg-gradient-cream p-7 shadow-soft">
                <h3 className="font-serif text-xl mb-5">Summary</h3>
                <div className="space-y-2 text-sm mb-5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items ({count})</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{subtotal > 500 ? "Free" : "₹49"}</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg pt-3 border-t border-border/50 mt-3">
                    <span>Total</span>
                    <span>₹{(subtotal + (subtotal > 500 ? 0 : 49)).toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full h-12 group bg-primary hover:bg-primary/90"
                  disabled={placing || !selectedAddressId}
                >
                  {placing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {paymentMethod === "UPI" ? "Processing Payment..." : "Placing order..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {paymentMethod === "UPI" ? "Proceed to Payment" : "Confirm Order"}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free shipping on orders above ₹500 · Easy returns
                </p>
              </div>
            </aside>
          </form>
        </section>
      </PageShell>

      {/* Order Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowSuccess(false);
              navigate("/");
            }}
          />
          {/* Modal */}
          <div className="relative bg-card rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in z-10">
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/");
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Success icon */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
              <PartyPopper className="absolute -top-1 -right-1 h-6 w-6 text-amber-500 animate-bounce" />
            </div>

            <h2 className="font-serif text-2xl md:text-3xl mb-2">{successMessage}</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Thank you for shopping with BugyBoo! Your order has been placed successfully. We'll send you updates on your order status.
            </p>

            <div className="space-y-3">
              <Button
                className="w-full rounded-full h-12 bg-primary hover:bg-primary/90"
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/");
                }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full h-12"
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/user/orders");
                }}
              >
                View My Orders
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-w-md mx-4 rounded-2xl bg-card border-none shadow-elegant">
          <DialogHeader>
            <DialogTitle className="text-lg lg:text-xl font-serif">Add New Address</DialogTitle>
            <DialogDescription className="text-muted-foreground font-sans">
              Enter your delivery details to complete your order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 font-sans">
            <div className="space-y-2">
              <Label>Full Address *</Label>
              <Input
                value={newAddress.fullAddress}
                onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                placeholder="House no, Street, Locality"
                className="rounded-xl border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="e.g. Delhi"
                  className="rounded-xl border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Pincode *</Label>
                <Input
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  placeholder="e.g. 110001"
                  className="rounded-xl border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                className="rounded-xl border-border"
              />
            </div>
          </div>
          <div className="flex gap-2 font-sans">
            <Button
              variant="outline"
              onClick={() => setIsAddressDialogOpen(false)}
              className="rounded-xl flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAddress}
              disabled={savingAddress}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex-1"
            >
              {savingAddress ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Address"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Address;
