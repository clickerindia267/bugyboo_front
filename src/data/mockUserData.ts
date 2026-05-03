import p1 from "@/assets/pinktop1.jpeg";
import p2 from "@/assets/nightwear2.jpeg";

export const mockUserOrders = [
  {
    id: "ORD-1001",
    product: { id: 1, name: "Rosé Knit Cardigan", image: p1, price: 68, color: "Rosé", size: "2-3Y" },
    status: "Pending",
    date: "2026-05-01",
    payment: { method: "UPI", transactionId: "TXN789456123" },
    address: { fullAddress: "House no 12, Sector 45", city: "Delhi", pincode: "110001", country: "India" },
  },
];

export const mockUserAddresses = [
  { id: "1", fullAddress: "House no 123, Street ABC", city: "Delhi", pincode: "110001", country: "India" },
  { id: "2", fullAddress: "Flat 4B, Tower C, Palm Greens", city: "Noida", pincode: "201301", country: "India" },
];

export const userDashboardStats = {
  totalOrders: 1,
  deliveredOrders: 0,
  pendingOrders: 1,
  totalCartItems: 0,
};
