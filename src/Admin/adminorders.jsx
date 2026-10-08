import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Download,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import AddOrderForm from "./AddOrderForm";
import { getAuthorizationHeaders } from "../auth.js";

const columns = [
  "Order",
  "Name",
  "Email",
  "Items",
  "Quantity",
  "Total Amount",
  "Status",
];

const AdminOrders = () => {
  const { searchTerm = "" } = useOutletContext();

  const [orders, setOrders] = useState([]);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [deleteError, setDeleteError] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const fetchOrders = async () => {
      if (isCurrent) {
        setIsLoading(true);
        setLoadError("");
      }

      try {
        const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
        const response = await fetch(`${apiBaseUrl}/users/orders`, {
          headers: getAuthorizationHeaders(),
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            payload.message || `Orders request failed (${response.status})`
          );
        }

        if (!Array.isArray(payload.orders)) {
          throw new Error("The orders API returned an invalid response.");
        }

        const databaseOrders = payload.orders.map((order) => {
          const id = String(order._id || order.id || "");

          return {
            id,
            orderNumber: order.orderNumber || `#ORD-${id.slice(-4)}`,
            name: order.name || "-",
            email: order.email || "-",
            items: Array.isArray(order.items) ? order.items.join(", ") : "-",
            quantity: Array.isArray(order.quantity)
              ? order.quantity.join(", ")
              : String(order.quantity ?? "-"),
            itemList: Array.isArray(order.items) ? order.items : [],
            quantities: Array.isArray(order.quantity) ? order.quantity : [],
            total: Number(order.totalAmount ?? 0),
            status: order.status || "Pending",
          };
        });

        if (isCurrent) {
          setOrders(databaseOrders);
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            error instanceof Error ? error.message : "Could not load orders."
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((value) =>
      String(value).toLowerCase().includes(normalizedSearch)
    )
  );

  const awaitingFulfillment = orders.filter(
    (order) =>
      !["completed", "delivered", "cancelled"].includes(
        order.status.toLowerCase()
      )
  ).length;

  const averageOrderValue = orders.length
    ? orders.reduce((total, order) => total + order.total, 0) / orders.length
    : 0;

  const orderMetrics = [
    {
      label: "Total orders",
      value: orders.length.toLocaleString("en-IN"),
      change: "From database",
      direction: "up",
    },
    {
      label: "Awaiting fulfillment",
      value: awaitingFulfillment.toLocaleString("en-IN"),
      change: "Pending or processing",
      direction: "down",
    },
    {
      label: "Average order value",
      value: `₹${Math.round(averageOrderValue).toLocaleString("en-IN")}`,
      change: "From database",
      direction: "up",
    },
  ];

  const saveOrder = async (orderData, orderId) => {
    const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
    const response = await fetch(
      `${apiBaseUrl}/users/orders${orderId ? `/${encodeURIComponent(orderId)}` : ""}`,
      {
        method: orderId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthorizationHeaders(),
        },
        body: JSON.stringify(orderData),
      }
    );
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload.message ||
          `Order could not be ${orderId ? "updated" : "created"} (${response.status}).`
      );
    }

    setIsOrderFormOpen(false);
    setEditingOrder(null);
    setReloadKey((key) => key + 1);
  };

  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`Delete order ${order.orderNumber}? This action cannot be undone.`)) {
      return;
    }

    setDeletingOrderId(order.id);
    setDeleteError("");

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(
        `${apiBaseUrl}/users/orders/${encodeURIComponent(order.id)}`,
        {
          method: "DELETE",
          headers: getAuthorizationHeaders(),
        }
      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.message || `Order could not be deleted (${response.status}).`
        );
      }

      setReloadKey((key) => key + 1);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete the order."
      );
    } finally {
      setDeletingOrderId("");
    }
  };

  const openAddOrderForm = () => {
    setEditingOrder(null);
    setIsOrderFormOpen(true);
  };

  const openEditOrderForm = (order) => {
    setEditingOrder(order);
    setIsOrderFormOpen(true);
  };

  const exportOrders = () => {
    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      order.name,
      order.email,
      order.items,
      order.quantity,
      `₹${order.total.toLocaleString("en-IN")}`,
      order.status,
    ]);

    const csv = [columns, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="admin-section-page">
      <div className="admin-section-heading">
        <div>
          <span className="dashboard-label">ORDER MANAGEMENT</span>
          <h1>Orders</h1>
          <p>Keep every order moving, from checkout to delivery.</p>
        </div>

        <div className="section-heading-actions">
          <button
            className="add-product-btn"
            type="button"
            onClick={openAddOrderForm}
          >
            <Plus size={16} />
            Add order
          </button>

          <Link className="section-back-link" to="/admin">
            Back to overview <ChevronRight size={15} />
          </Link>
        </div>
      </div>

      <div className="section-metric-grid">
        {orderMetrics.map((metric) => {
          const Icon =
            metric.direction === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <article className="section-metric-card" key={metric.label}>
              <div className="section-metric-icon">
                <ShoppingCart size={17} />
              </div>

              <span>{metric.label}</span>
              <strong>{metric.value}</strong>

              <small className={metric.direction}>
                <Icon size={13} /> {metric.change}
              </small>
            </article>
          );
        })}
      </div>

      <section className="premium-card section-table-card">
        <div className="premium-card-header">
          <div>
            <h2>All orders</h2>
            <p>Showing the latest activity from your store</p>
          </div>

          <button
            className="section-export-btn"
            type="button"
            onClick={exportOrders}
          >
            <Download size={15} />
            Export
          </button>
        </div>

        <div className="section-table-scroll">
          <table className="section-data-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="section-empty" colSpan={8}>
                    Loading orders...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td className="section-empty" colSpan={8}>
                    <div className="admin-table-error" role="alert">
                      <span>Couldn't load orders: {loadError}</span>

                      <button
                        type="button"
                        onClick={() => setReloadKey((key) => key + 1)}
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.name}</td>
                    <td>{order.email}</td>
                    <td>{order.items}</td>
                    <td>{order.quantity}</td>
                    <td>
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={`section-status ${order.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        <i /> {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="product-row-actions">
                        <button
                          className="product-row-action product-row-action-edit"
                          type="button"
                          onClick={() => openEditOrderForm(order)}
                          disabled={Boolean(deletingOrderId)}
                          aria-label={`Edit ${order.orderNumber}`}
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          className="product-row-action product-row-action-delete"
                          type="button"
                          onClick={() => handleDeleteOrder(order)}
                          disabled={Boolean(deletingOrderId)}
                          aria-label={`Delete ${order.orderNumber}`}
                        >
                          <Trash2 size={13} />
                          {deletingOrderId === order.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="section-empty" colSpan={8}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {deleteError && (
          <div className="admin-table-error" role="alert">
            <span>Couldn’t delete order: {deleteError}</span>
          </div>
        )}
      </section>

      {isOrderFormOpen && (
        <AddOrderForm
          order={editingOrder}
          onClose={() => {
            setIsOrderFormOpen(false);
            setEditingOrder(null);
          }}
          onSubmit={saveOrder}
        />
      )}
    </section>
  );
};

export default AdminOrders;