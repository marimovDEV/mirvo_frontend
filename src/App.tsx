/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import HomePage from './pages/Home';
import ProductDetailPage from './pages/ProductDetail';
import CheckoutPage from './pages/Checkout';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import B2BPage from './pages/B2BPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CatalogPage from './pages/CatalogPage';
import DealsPage from './pages/DealsPage';
import SportHubPage from './pages/SportHubPage';
import CategoriesPage from './pages/CategoriesPage';
import DeliveryPage from './pages/DeliveryPage';
import ReturnsPage from './pages/ReturnsPage';
import ContactPage from './pages/ContactPage';

// Profile Sub-pages
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import PromocodesPage from './pages/PromocodesPage';
import NotificationsPage from './pages/NotificationsPage';

import { MarketBottomNav } from './components/Navigation';
import { cn } from './lib/utils';

const Error404 = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white">
    <h1 className="text-8xl font-black text-black mb-4 opacity-5 italic">404</h1>
    <h2 className="text-2xl font-black uppercase text-on-surface mb-2">Sahifa topilmadi</h2>
    <p className="text-on-surface-variant mb-8 max-w-sm font-medium">Kechirasiz, siz qidirayotgan sahifa <span className="font-black italic">MIRVO</span> katalogida mavjud emas.</p>
    <a href="/" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">Asosiyga qaytish</a>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppLayout>
          <Routes>
            {/* Marketplace Screens */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/deals/today" element={<DealsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Account Management (auth required) */}
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
            <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
            <Route path="/promocodes" element={<ProtectedRoute><PromocodesPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

            <Route path="/sport/:sportId" element={<SportHubPage />} />
            <Route path="/b2b" element={<B2BPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Screens */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
            <Route path="/admin/support" element={<AdminDashboard />} />
            
            {/* Fallback */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </AppLayout>
      </CartProvider>
    </AuthProvider>
  );
}

/** Redirects unauthenticated users to /auth with returnUrl */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth() as any;
  const location = useLocation();
  if (!user) {
    return <Navigate to={`/auth?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideNavRoutes = [
    '/cart', '/checkout', '/auth',
    '/orders', '/addresses', '/payment-methods', '/promocodes', '/notifications'
  ];
  const isProductDetail = location.pathname.startsWith('/product/');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideNav = hideNavRoutes.includes(location.pathname) || isProductDetail || isAdminRoute;

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-300",
      !shouldHideNav ? "pb-20 md:pb-0" : ""
    )}>
      {children}
      {!shouldHideNav && <MarketBottomNav />}
    </div>
  );
}
