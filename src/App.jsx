import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Admin
import AdminLayout from "./Admin/adminlayout.jsx";
import AdminDashboard from "./Admin/admindashboard.jsx";
import AdminOrders from "./Admin/adminorders.jsx";
import AdminProducts from "./Admin/adminproducts.jsx";
import AdminCustomers from "./Admin/admincustomers.jsx";
import AdminStaff from "./Admin/adminstaff.jsx";

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
import SuperAdminLogin from "./pages/SuperAdminLogin.jsx";

// Auth / role
import RoleRoute from "./components/RoleRoute.jsx";
import { getStoredSession } from "./auth.js";

const AdminLanding = () => {
  const session = getStoredSession();
  return session?.user?.role === "inventory"
    ? <Navigate to="/admin/products" replace />
    : <AdminDashboard />;
};

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
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          element={
            <RoleRoute
              roles={["admin", "superadmin", "inventory"]}
              redirectTo="/superadmin/login"
            />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="products" element={<AdminProducts />} />

            <Route index element={<AdminLanding />} />
            <Route element={<RoleRoute roles={["admin", "superadmin"]} />}>
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminCustomers />} />
              <Route path="staff" element={<AdminStaff />} />
            </Route>
          </Route>
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;