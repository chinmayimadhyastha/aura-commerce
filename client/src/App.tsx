import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "./contexts/WishListContext.tsx";
import Index from "./pages/Index.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import SocialShopping from "./pages/SocialShopping.tsx";
import CompareProducts from "./pages/CompareProducts.tsx";
import GroupDeals from "./pages/GroupDeals.tsx";
import Cart from "./pages/Cart.tsx";
import WishList from "./pages/WishList.tsx";
import SearchPage from "./pages/Search.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/social-shopping" element={<SocialShopping />} />
                <Route path="/compare" element={<CompareProducts />} />
                <Route path="/group-deals" element={<GroupDeals />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<WishList />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;