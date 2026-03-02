import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { Layout } from '@/components/shared/Layout';

/* Merchant pages */
import MerchantDashboard     from '@/pages/merchant/Dashboard';
import MerchantProducts      from '@/pages/merchant/Products';
import MerchantProductDetail from '@/pages/merchant/ProductDetail';
import CheckoutPage          from '@/pages/merchant/Checkout';
import MerchantReports       from '@/pages/merchant/Reports';
import MerchantPlaceholder   from '@/pages/merchant/Placeholder';

/* Supplier pages */
import SupplierDashboard        from '@/pages/supplier/Dashboard';
import SupplierAddProduct       from '@/pages/supplier/AddProduct';
import SupplierReports          from '@/pages/supplier/Reports';
import SupplierSalesMonitoring  from '@/pages/supplier/SalesMonitoring';
import SupplierPlaceholder      from '@/pages/supplier/Placeholder';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/merchant/dashboard" replace />} />

          {/* ── Merchant Panel ── */}
          <Route path="/merchant" element={<Layout role="merchant" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"      element={<MerchantDashboard />} />
            <Route path="products"       element={<MerchantProducts />} />
            <Route path="products/:id"   element={<MerchantProductDetail />} />
            <Route path="checkout"       element={<CheckoutPage />} />
            <Route path="reports"        element={<MerchantReports />} />
            <Route path="suppliers"      element={<MerchantPlaceholder />} />
            <Route path="orders"         element={<MerchantPlaceholder />} />
            <Route path="inventory"      element={<MerchantPlaceholder />} />
            <Route path="payments"       element={<MerchantPlaceholder />} />
            <Route path="invoices"       element={<MerchantPlaceholder />} />
            <Route path="analytics"      element={<MerchantPlaceholder />} />
            <Route path="users"          element={<MerchantPlaceholder />} />
            <Route path="ai"             element={<MerchantPlaceholder />} />
          </Route>

          {/* ── Supplier Panel ── */}
          <Route path="/supplier" element={<Layout role="supplier" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<SupplierDashboard />} />
            <Route path="add-product"  element={<SupplierAddProduct />} />
            <Route path="products"     element={<SupplierPlaceholder />} />
            <Route path="inventory"    element={<SupplierPlaceholder />} />
            <Route path="orders"       element={<SupplierPlaceholder />} />
            <Route path="payments"     element={<SupplierPlaceholder />} />
            <Route path="invoices"     element={<SupplierPlaceholder />} />
            <Route path="reports"          element={<SupplierReports />} />
            <Route path="sales-monitoring" element={<SupplierSalesMonitoring />} />
            <Route path="analytics"        element={<SupplierPlaceholder />} />
            <Route path="storefront"   element={<SupplierPlaceholder />} />
            <Route path="profile"      element={<SupplierPlaceholder />} />
            <Route path="users"        element={<SupplierPlaceholder />} />
            <Route path="support"      element={<SupplierPlaceholder />} />
            <Route path="ai"           element={<SupplierPlaceholder />} />
          </Route>

          <Route path="*" element={<Navigate to="/merchant/dashboard" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
