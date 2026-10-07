import React, { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";

const orderStatuses = [
  "Pending",
  "Processing",
  "Completed",
  "Delivered",
  "Cancelled",
];

const initialForm = (order) => ({
  name: order?.name || "",
  email: order?.email === "-" ? "" : order?.email || "",
  items: order?.itemList?.join(", ") || "",
  quantity: order?.quantities?.join(", ") || "",
  totalAmount: order ? String(order.total) : "",
  status: order?.status || "Pending",
});

function AddOrderForm({ order = null, onClose, onSubmit }) {
  const [orderForm, setOrderForm] = useState(() => initialForm(order));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const isEditing = Boolean(order);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSaving, onClose]);

  const updateField = (field, value) => {
    setOrderForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const items = orderForm.items
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const quantity = orderForm.quantity
      .split(",")
      .map((value) => Number(value.trim()));

    if (!items.length || quantity.some((value) => !Number.isInteger(value) || value < 1)) {
      setError("Enter item names and a positive whole-number quantity for each item.");
      return;
    }

    if (items.length !== quantity.length) {
      setError("Enter one quantity for each comma-separated item.");
      return;
    }

    setIsSaving(true);

    try {
      await onSubmit(
        {
          name: orderForm.name.trim(),
          email: orderForm.email.trim().toLowerCase(),
          items,
          quantity,
          totalAmount: Number(orderForm.totalAmount),
          status: orderForm.status,
        },
        order?.id
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : `Could not ${isEditing ? "update" : "create"} the order.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="product-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-form-title"
      >
        <div className="product-modal-header">
          <div className="product-modal-heading-icon">
            <ShoppingCart size={19} />
          </div>
          <div>
            <span className="dashboard-label">ORDER MANAGEMENT</span>
            <h2 id="order-form-title">
              {isEditing ? "Edit order" : "Add an order"}
            </h2>
            <p>
              {isEditing
                ? `Update the details for ${order.orderNumber}.`
                : "Enter customer and order details."}
            </p>
          </div>
          <button
            className="product-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close order form"
            disabled={isSaving}
          >
            <X size={18} />
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <label className="product-form-field">
            <span>Name <b>*</b></span>
            <input
              autoFocus
              required
              maxLength={80}
              value={orderForm.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Customer name"
            />
          </label>

          <label className="product-form-field">
            <span>Email <b>*</b></span>
            <input
              required
              type="email"
              maxLength={254}
              value={orderForm.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="customer@example.com"
            />
          </label>

          <label className="product-form-field product-form-field-full">
            <span>Items <b>*</b></span>
            <input
              required
              value={orderForm.items}
              onChange={(event) => updateField("items", event.target.value)}
              placeholder="Separate item names with commas"
            />
          </label>

          <label className="product-form-field product-form-field-full">
            <span>Quantity <b>*</b></span>
            <input
              required
              inputMode="numeric"
              value={orderForm.quantity}
              onChange={(event) => updateField("quantity", event.target.value)}
              placeholder="One quantity per item, e.g. 1, 2"
            />
          </label>

          <label className="product-form-field">
            <span>Total amount (₹) <b>*</b></span>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={orderForm.totalAmount}
              onChange={(event) => updateField("totalAmount", event.target.value)}
              placeholder="e.g. 2499"
            />
          </label>

          <label className="product-form-field">
            <span>Status <b>*</b></span>
            <select
              required
              value={orderForm.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {!orderStatuses.includes(orderForm.status) && (
                <option value={orderForm.status}>{orderForm.status}</option>
              )}
              {orderStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          {error && (
            <div className="product-submit-error" role="alert">
              {error}
            </div>
          )}

          <div className="product-form-footer">
            <span>
              {isEditing
                ? `Order ${order.orderNumber}`
                : "Email is saved as the order contact; a customer account is optional."}
            </span>
            <div>
              <button
                className="product-cancel-btn"
                type="button"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="product-save-btn"
                type="submit"
                disabled={isSaving}
              >
                {isSaving
                  ? isEditing ? "Saving..." : "Adding..."
                  : isEditing ? "Save changes" : "Add order"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddOrderForm;
