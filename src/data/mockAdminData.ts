export const mockCategories = [
  { id: "1", name: "Baby Wardrobe" },
  { id: "2", name: "Girls Wardrobe" },
  { id: "3", name: "Boys Wardrobe" },
  { id: "4", name: "Accessories" },
];

export const mockProducts = [
  {
    id: "1",
    name: "Classic Baby Onesie",
    category: "Baby Wardrobe",
    color: "White",
    size: "0-3 Months",
    basePrice: 500,
    sellingPrice: 450,
    gst: 18,
    status: "Active",
    description: "Soft cotton onesie for babies.",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "Floral Girl Dress",
    category: "Girls Wardrobe",
    color: "Pink",
    size: "3-4 Years",
    basePrice: 1200,
    sellingPrice: 999,
    gst: 18,
    status: "Active",
    description: "Beautiful floral dress for girls.",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Denim Boys Jacket",
    category: "Boys Wardrobe",
    color: "Blue",
    size: "5-6 Years",
    basePrice: 1500,
    sellingPrice: 1299,
    gst: 18,
    status: "Paused",
    description: "Stylish denim jacket for boys.",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80",
  },
];

export const mockOrders = [
  {
    id: "ORD-001",
    user: { name: "John Doe", email: "john@example.com", phone: "+91 9876543210", address: "123 Main St, Mumbai" },
    product: { name: "Classic Baby Onesie", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=100&q=80" },
    status: "Pending",
    total: 450,
    date: "2026-05-01",
  },
  {
    id: "ORD-002",
    user: { name: "Jane Smith", email: "jane@example.com", phone: "+91 9876543211", address: "456 Park Ave, Delhi" },
    product: { name: "Floral Girl Dress", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=100&q=80" },
    status: "Completed",
    total: 999,
    date: "2026-05-02",
  },
  {
    id: "ORD-003",
    user: { name: "Amit Kumar", email: "amit@example.com", phone: "+91 9876543212", address: "789 Sea Link, Bangalore" },
    product: { name: "Denim Boys Jacket", image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=100&q=80" },
    status: "Pending",
    total: 1299,
    date: "2026-05-03",
  },
];

export const mockBlogs = [
  {
    id: "1",
    title: "Choosing the Right Fabric for Your Baby",
    shortDescription: "A guide to selecting the softest and safest fabrics for your little ones.",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80",
    date: "2026-04-15",
  },
  {
    id: "2",
    title: "Summer Wardrobe Essentials for Kids",
    shortDescription: "Keep your kids cool and stylish this summer with these must-have items.",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80",
    date: "2026-04-20",
  },
];

export const dashboardStats = {
  totalOrders: 1254,
  totalRevenue: 543200,
  totalPayments: 500100,
  pendingOrders: 45,
  pendingPayments: 43100,
};
