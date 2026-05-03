import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Shop from "./pages/Shop.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";
import Cart from "./pages/Cart.tsx";
import Address from "./pages/Address.tsx";
import Blog from "./pages/Blog.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminLogin from "./pages/admin/Login.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import AdminCategories from "./pages/admin/Categories.tsx";
import AdminProducts from "./pages/admin/Products.tsx";
import AdminOrders from "./pages/admin/Orders.tsx";
import AdminBlogs from "./pages/admin/Blogs.tsx";
import UserLayout from "./layouts/UserLayout.tsx";
import UserDashboard from "./pages/user/Dashboard.tsx";
import UserCart from "./pages/user/UserCart.tsx";
import UserOrders from "./pages/user/UserOrders.tsx";
import UserOrderDetail from "./pages/user/UserOrderDetail.tsx";
import UserAddress from "./pages/user/UserAddress.tsx";
import { ThemeProvider } from "./components/ThemeProvider";
import { CartProvider } from "./store/cart";
import { AuthProvider } from "./store/auth";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

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
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
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
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
