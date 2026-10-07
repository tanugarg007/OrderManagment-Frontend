import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ShoppingBag,
  IndianRupee,
  Users,
  PackageCheck,
  MoreHorizontal,
  ChevronRight,
  Clock3,
  Plus,
} from "lucide-react";
import "./admin.css";
import { getStoredSession } from "../auth.js";

const AdminDashboard = () => {
  const session = getStoredSession();
  const adminName = session?.user?.name || "Admin";
  const [orders, setOrders] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { searchTerm = "" } = useOutletContext();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleOrders = orders
    .map((order) => {
      const customer = order.name || "Unknown customer";
      const initials = customer
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      const createdAt = order.createdAt ? new Date(order.createdAt) : null;

      return {
        id: order.orderNumber || `#ORD-${String(order._id || "").slice(-4)}`,
        customer,
        initials,
        product: Array.isArray(order.items) ? order.items.join(", ") : "—",
        amount: `₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}`,
        status: order.status || "Pending",
        date:
          createdAt && !Number.isNaN(createdAt.getTime())
            ? createdAt.toLocaleDateString("en-IN")
            : "—",
      };
    })
    .filter((order) =>
      [
        order.id,
        order.customer,
        order.product,
        order.status,
        order.amount,
      ].some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );
  const deliveredOrders = orders.filter((order) =>
    ["completed", "delivered"].includes(String(order.status || "").toLowerCase())
  ).length;
  const processingOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "processing"
  ).length;
  const pendingOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "pending"
  ).length;
  const statusShare = (count) =>
    orders.length ? `${Math.round((count / orders.length) * 100)}%` : "0%";

  useEffect(() => {
    let isCurrent = true;

    const loadMetrics = async () => {
      if (!session?.token) {
        setLoadError("Please sign in again to load business statistics.");
        setIsLoading(false);
        return;
      }

      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const headers = { Authorization: `Bearer ${session.token}` };

      try {
        const [ordersResponse, customersResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/users/orders`, { headers }),
          fetch(`${apiBaseUrl}/users/users`, { headers }),
        ]);
        const [ordersPayload, customersPayload] = await Promise.all([
          ordersResponse.json().catch(() => ({})),
          customersResponse.json().catch(() => ({})),
        ]);

        if (!ordersResponse.ok) {
          throw new Error(
            ordersPayload.message ||
              `Orders request failed (${ordersResponse.status}).`
          );
        }
        if (!customersResponse.ok) {
          throw new Error(
            customersPayload.message ||
              `Customers request failed (${customersResponse.status}).`
          );
        }
        if (
          !Array.isArray(ordersPayload.orders) ||
          !Number.isFinite(Number(customersPayload.count))
        ) {
          throw new Error("The dashboard API returned invalid statistics.");
        }

        if (isCurrent) {
          setOrders(ordersPayload.orders);
          setCustomerCount(Number(customersPayload.count));
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load business statistics."
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadMetrics();
    return () => {
      isCurrent = false;
    };
  }, [session?.token]);

  return (
    <div className="premium-dashboard">

      {/* HEADER */}
      <div className="dashboard-top">

        <div>
          <span className="dashboard-label">
            DASHBOARD
          </span>

          <h1>Welcome, {adminName} <span>✦</span></h1>

          <p>
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="dashboard-actions">
          <button className="filter-btn" type="button">
            <Clock3 size={15} />
            Last 30 days
          </button>

          <button className="create-order-btn" type="button">
            <Plus size={17} />
            New order
          </button>
        </div>

      </div>

      {loadError && <div className="admin-table-error" role="alert">{loadError}</div>}

      {/* STAT CARDS */}
      <div className="premium-stat-grid">

        <div className="premium-stat">

          <div className="premium-stat-top">
            <div className="premium-stat-icon">
              <ShoppingBag size={20} />
            </div>

            <MoreHorizontal size={19} />
          </div>

          <span className="premium-stat-title">
            Total Orders
          </span>

          <strong>{isLoading ? "—" : orders.length.toLocaleString("en-IN")}</strong>

          <div className="stat-growth">
            <span>All-time orders</span>
          </div>

        </div>


        <div className="premium-stat">

          <div className="premium-stat-top">
            <div className="premium-stat-icon">
              <IndianRupee size={20} />
            </div>

            <MoreHorizontal size={19} />
          </div>

          <span className="premium-stat-title">
            Total Revenue
          </span>

          <strong>{isLoading ? "—" : `₹${Math.round(totalRevenue).toLocaleString("en-IN")}`}</strong>

          <div className="stat-growth">
            <span>Revenue from all orders</span>
          </div>

        </div>


        <div className="premium-stat">

          <div className="premium-stat-top">
            <div className="premium-stat-icon">
              <Users size={20} />
            </div>

            <MoreHorizontal size={19} />
          </div>

          <span className="premium-stat-title">
            Customers
          </span>

          <strong>{isLoading ? "—" : customerCount.toLocaleString("en-IN")}</strong>

          <div className="stat-growth">
            <span>Registered accounts</span>
          </div>

        </div>


        <div className="premium-stat">

          <div className="premium-stat-top">
            <div className="premium-stat-icon">
              <PackageCheck size={20} />
            </div>

            <MoreHorizontal size={19} />
          </div>

          <span className="premium-stat-title">
            Delivered
          </span>

          <strong>{isLoading ? "—" : deliveredOrders.toLocaleString("en-IN")}</strong>

          <div className="stat-growth">
            <span>Completed or delivered</span>
          </div>

        </div>

      </div>


      {/* ANALYTICS */}
      <div className="analytics-grid">

        {/* Revenue */}
        <div className="premium-card revenue-card">

          <div className="premium-card-header">

            <div>
              <h2>Total Revenue</h2>

              <p>
                Revenue from all orders
              </p>
            </div>

            <button className="more-btn">
              <MoreHorizontal size={20} />
            </button>

          </div>


          <div className="revenue-value">

            <strong>{isLoading ? "—" : `₹${Math.round(totalRevenue).toLocaleString("en-IN")}`}</strong>

          </div>


          <div className="fake-chart">

            <div className="chart-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="chart-bars">

              <i style={{ height: "35%" }}></i>
              <i style={{ height: "48%" }}></i>
              <i style={{ height: "42%" }}></i>
              <i style={{ height: "63%" }}></i>
              <i style={{ height: "55%" }}></i>
              <i style={{ height: "76%" }}></i>
              <i style={{ height: "68%" }}></i>
              <i style={{ height: "91%" }}></i>
              <i style={{ height: "78%" }}></i>
              <i style={{ height: "96%" }}></i>

            </div>

            <div className="chart-labels">
              <span>May 01</span>
              <span>May 07</span>
              <span>May 14</span>
              <span>May 21</span>
              <span>May 30</span>
            </div>

          </div>

        </div>


        {/* Order Status */}
        <div className="premium-card status-card">

          <div className="premium-card-header">

            <div>
              <h2>Order Status</h2>

              <p>
                Current order distribution
              </p>
            </div>

            <button className="more-btn">
              <MoreHorizontal size={20} />
            </button>

          </div>


          <div className="donut">

            <div className="donut-center">
              <strong>{isLoading ? "—" : orders.length.toLocaleString("en-IN")}</strong>
              <span>Orders</span>
            </div>

          </div>


          <div className="status-items">

            <div>
              <span>
                <i className="status-dot completed"></i>
                Completed
              </span>

              <strong>{deliveredOrders} · {statusShare(deliveredOrders)}</strong>
            </div>

            <div>
              <span>
                <i className="status-dot processing"></i>
                Processing
              </span>

              <strong>{processingOrders} · {statusShare(processingOrders)}</strong>
            </div>

            <div>
              <span>
                <i className="status-dot pending"></i>
                Pending
              </span>

              <strong>{pendingOrders} · {statusShare(pendingOrders)}</strong>
            </div>

          </div>

        </div>

      </div>


      {/* RECENT ORDERS */}
      <div className="premium-card orders-card">

        <div className="premium-card-header">

          <div>
            <h2>Recent Orders</h2>

            <p>
              Latest orders from your customers
            </p>
          </div>

          <button className="view-orders-btn">
            View all
            <ChevronRight size={16} />
          </button>

        </div>


        <div className="orders-table">

          <div className="orders-head">

            <span>ORDER</span>
            <span>CUSTOMER</span>
            <span>PRODUCT</span>
            <span>AMOUNT</span>
            <span>STATUS</span>
            <span>DATE</span>

          </div>


          {visibleOrders.map((order) => (

            <div className="orders-row" key={order.id}>

              <strong>
                {order.id}
              </strong>


              <div className="customer">

                <div className="customer-avatar">
                  {order.initials}
                </div>

                <span>
                  {order.customer}
                </span>

              </div>


              <span className="product">
                {order.product}
              </span>


              <strong>
                {order.amount}
              </strong>


              <span
                className={`badge ${order.status.toLowerCase()}`}
              >
                {order.status}
              </span>


              <span className="order-date">
                {order.date}
              </span>

            </div>

          ))}

          {visibleOrders.length === 0 && (
            <div className="orders-empty">
              {isLoading
                ? "Loading recent orders…"
                : loadError
                  ? "Recent orders are unavailable."
                  : searchTerm
                    ? `No orders match “${searchTerm}”. Try a different search.`
                    : "No orders yet."}
            </div>
          )}

        </div>

      </div>


      {/* BOTTOM CARDS */}
      <div className="bottom-grid">

        <div className="premium-card quick-card">

          <div className="premium-card-header">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Manage your store quickly
              </p>
            </div>

          </div>


          <div className="quick-actions">

            <button>
              <Plus size={20} />
              Create Order
            </button>

            <button>
              <PackageCheck size={20} />
              Add Product
            </button>

            <button>
              <Users size={20} />
              Add Customer
            </button>

          </div>

        </div>


        <div className="premium-card activity-card">

          <div className="premium-card-header">

            <div>
              <h2>Recent Activity</h2>

              <p>
                Latest updates
              </p>
            </div>

          </div>


          <div className="activity">

            <div className="activity-row">

              <div className="activity-icon">
                <ShoppingBag size={15} />
              </div>

              <div>
                <p>
                  New order <b>#ORD-1048</b>
                </p>

                <span>5 minutes ago</span>
              </div>

            </div>


            <div className="activity-row">

              <div className="activity-icon">
                <Users size={15} />
              </div>

              <div>
                <p>
                  New customer registered
                </p>

                <span>32 minutes ago</span>
              </div>

            </div>


            <div className="activity-row">

              <div className="activity-icon">
                <Clock3 size={15} />
              </div>

              <div>
                <p>
                  Order #ORD-1041 delivered
                </p>

                <span>1 hour ago</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;