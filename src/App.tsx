import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { CartProvider } from "./store/cart";
import { AuthProvider } from "./store/auth";
import ScrollToTop from "./components/ScrollToTop";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Shop = lazy(() => import("./pages/Shop.tsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Address = lazy(() => import("./pages/Address.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogDetail = lazy(() => import("./pages/BlogDetail.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));

// Admin pages
const AdminLayout = lazy(() => import("./layouts/AdminLayout.tsx"));
const AdminLogin = lazy(() => import("./pages/admin/Login.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.tsx"));
const AdminCategories = lazy(() => import("./pages/admin/Categories.tsx"));
const AdminProducts = lazy(() => import("./pages/admin/Products.tsx"));
const AdminOrders = lazy(() => import("./pages/admin/Orders.tsx"));
const AdminBlogs = lazy(() => import("./pages/admin/Blogs.tsx"));

// User dashboard pages
const UserLayout = lazy(() => import("./layouts/UserLayout.tsx"));
const UserDashboard = lazy(() => import("./pages/user/Dashboard.tsx"));
const UserCart = lazy(() => import("./pages/user/UserCart.tsx"));
const UserOrders = lazy(() => import("./pages/user/UserOrders.tsx"));
const UserOrderDetail = lazy(() => import("./pages/user/UserOrderDetail.tsx"));
const UserAddress = lazy(() => import("./pages/user/UserAddress.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <GoogleAnalytics />
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <Loader2 className="h-8 w-8 animate-spin text-[#3f646f]" />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                  </Route>

                  {/* User Dashboard Routes */}
                  <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="cart" element={<UserCart />} />
                    <Route path="orders" element={<UserOrders />} />
                    <Route path="orders/:id" element={<UserOrderDetail />} />
                    <Route path="address" element={<UserAddress />} />
                  </Route>

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
