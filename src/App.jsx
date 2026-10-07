import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Admin
import AdminLayout from "./Admin/adminlayout.jsx";
import AdminDashboard from "./Admin/admindashboard.jsx";
import AdminOrders from "./Admin/adminorders.jsx";
import AdminProducts from "./Admin/adminproducts.jsx";
import AdminCustomers from "./Admin/admincustomers.jsx";

// User pages
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Productss.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import PaymentMethod from "./pages/PaymentMethod.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

// Auth / role
import RoleRoute from "./components/RoleRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= USER WEBSITE ================= */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="products" element={<Products />} />

          <Route path="contact" element={<Contact />} />

          <Route path="order-summary" element={<OrderSummary />} />

          <Route path="place-order" element={<PlaceOrder />} />

          <Route path="payment-method" element={<PaymentMethod />} />

          <Route path="my-orders" element={<MyOrders />} />
        </Route>

        {/* Old dashboard URL */}
        <Route
          path="/dashboard"
          element={<Navigate to="/" replace />}
        />

        {/* ================= ADMIN PANEL ================= */}
        <Route element={<RoleRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>

            {/* /admin */}
            <Route index element={<AdminDashboard />} />

            {/* /admin/orders */}
            <Route path="orders" element={<AdminOrders />} />

            {/* /admin/products */}
            <Route path="products" element={<AdminProducts />} />

            {/* /admin/users */}
            <Route path="users" element={<AdminCustomers />} />

          </Route>
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;