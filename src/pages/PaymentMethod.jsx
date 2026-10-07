import { useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import DeliveryAddressForm from "../components/DeliveryAddressForm.jsx";
import { getStoredSession } from "../auth.js";

const formatPrice = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function PaymentMethod() {
  const { state } = useLocation();
  const [address, setAddress] = useState(state?.address);
  const [quantity, setQuantity] = useState(Math.max(1, Number(state?.quantity) || 1));
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const submitLock = useRef(false);
  const product = state?.product;

  if (!product || !address) {
    return <Navigate to="/" replace />;
  }

  const availableStock = Math.floor(Number(product.quantity));
  const maxQuantity =
    Number.isFinite(availableStock) && availableStock > 0
      ? availableStock
      : 1;
  const safeQuantity = Math.min(quantity, maxQuantity);
  const itemTotal = Number(product.price) * safeQuantity;
  const total = itemTotal;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const handlePlaceOrder = async () => {
    if (submitLock.current || isPlacingOrder || placedOrder) {
      console.log("[Checkout] Duplicate order submission prevented.");
      return;
    }
    submitLock.current = true;
    setError("");
    const session = getStoredSession();
    if (!session?.token || session.user?.role !== "user") {
      console.log("[Checkout] Order submission blocked: customer sign-in required.");
      setError("Please sign in to your customer account before placing an order.");
      submitLock.current = false;
      return;
    }

    setIsPlacingOrder(true);
    let orderCreated = false;
    console.log("[Checkout] Submitting order confirmation.");
    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(`${apiBaseUrl}/users/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": state?.checkoutRequestId || globalThis.crypto.randomUUID(),
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: safeQuantity,
          paymentMethod,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.message || `Could not place order (${response.status}).`
        );
      }
      if (!payload.order?._id) {
        throw new Error(
          "The order service did not return a valid order confirmation."
        );
      }

      setPlacedOrder(payload.order);
      orderCreated = true;
      console.log("[Checkout] Order confirmation succeeded.");
    } catch (placeOrderError) {
      console.log("[Checkout] Order confirmation failed.");
      setError(
        placeOrderError instanceof Error
          ? placeOrderError.message
          : "Could not place your order."
      );
    } finally {
      setIsPlacingOrder(false);
      if (!orderCreated) submitLock.current = false;
    }
  };

  if (placedOrder) {
    return (
      <section className="checkout-review-page">
        <div className="order-placed-card">
          <span className="order-placed-icon" aria-hidden="true">✓</span>
          <span className="dashboard-label">ORDER CONFIRMED</span>
          <h1>Thank you for your order!</h1>
          <p>Your order has been placed with Cash on Delivery.</p>
          <div className="order-placed-reference">
            <span>Order number</span>
            <strong>#{String(placedOrder._id).slice(-8).toUpperCase()}</strong>
          </div>
          <p className="order-placed-delivery">
            Delivering to {address.name} · {address.city}, {address.state}
          </p>
          <Link className="order-summary-continue" to="/">
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-review-page">
      <div className="checkout-review-layout">
        <div className="checkout-review-items">
          <section className="checkout-review-address">
            <div className="checkout-review-address-copy">
              <div className="checkout-review-deliver-to">
                <strong>Deliver to:</strong>
                <span>{address.name}, {address.pincode}</span>
                <span className="checkout-address-tag">HOME</span>
              </div>
              <p>
                {address.houseNumber}, {address.address}, {address.city},{" "}
                {address.state}
              </p>
              <span className="checkout-phone">Phone: {address.phoneNumber}</span>
            </div>
            <button
              className="order-summary-change"
              type="button"
              onClick={() => setIsChangingAddress(true)}
            >
              Change
            </button>
          </section>

          <article className="checkout-review-product">
            <div className="checkout-review-product-main">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="checkout-review-image-placeholder" aria-hidden="true">
                  {product.name?.slice(0, 1) || "P"}
                </div>
              )}
              <div className="checkout-review-product-info">
                <span className="order-summary-category">{product.category}</span>
                <h1>{product.name}</h1>
                <strong className="checkout-review-unit-price">
                  {formatPrice(product.price)}
                </strong>
                <label className="order-summary-quantity">
                  <span>Qty:</span>
                  <select
                    aria-label={`Quantity for ${product.name}`}
                    value={safeQuantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    disabled={isPlacingOrder}
                  >
                    {Array.from({ length: maxQuantity }, (_, index) => index + 1).map(
                      (value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>
            </div>
            <div className="checkout-review-delivery-date">
              <span className="order-summary-delivery-icon" aria-hidden="true">✓</span>
              <span>
                Delivery by{" "}
                <strong>
                  {deliveryDate.toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </strong>
              </span>
            </div>
          </article>
        </div>

        <aside className="checkout-review-sidebar">
          <section className="checkout-price-card">
            <h2>Price Details</h2>
            <div className="checkout-price-content">
              <div className="checkout-price-row">
                <span>Price ({safeQuantity} {safeQuantity === 1 ? "item" : "items"})</span>
                <span>{formatPrice(itemTotal)}</span>
              </div>
              <div className="checkout-price-row">
                <span>Delivery fee</span>
                <span className="order-summary-free">FREE</span>
              </div>
              <div className="checkout-price-row checkout-price-payment">
                <span>Payment method</span>
                <span>{paymentMethod === "cash" ? "Cash on Delivery" : "Select a payment method"}</span>
              </div>
              <div className="checkout-price-total">
                <strong>Total Amount</strong>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
          </section>

          <section className="checkout-payment-methods" aria-labelledby="payment-methods-title">
            <h2 id="payment-methods-title">Payment method</h2>
            <label className="checkout-payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(event) => setPaymentMethod(event.target.value)}
                disabled={isPlacingOrder}
              />
              <span className="checkout-payment-option-copy">
                <strong>Cash on Delivery</strong>
                <span>Pay with cash when your order arrives.</span>
              </span>
            </label>
          </section>

          <div className="checkout-security-note">
            <span className="checkout-security-icon" aria-hidden="true">✓</span>
            <span>Safe and secure checkout. Your order is placed after you confirm.</span>
          </div>

          {error && (
            <p className="payment-method-message" role="alert">
              {error}
            </p>
          )}

          <div className="checkout-place-order-bar">
            <div className="checkout-place-order-total">
              <span>To pay</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button
              className="checkout-place-order-button"
              type="button"
              disabled={isPlacingOrder || availableStock < 1}
              onClick={handlePlaceOrder}
            >
              {isPlacingOrder ? "Confirming order…" : "Confirm Order"}
            </button>
          </div>

          <Link
            className="payment-method-back"
            to="/place-order"
            state={{ ...state, address, quantity: safeQuantity }}
          >
            Back to place order
          </Link>
        </aside>
      </div>

      {isChangingAddress && (
        <DeliveryAddressForm
          initialAddress={address}
          onSaved={(savedAddress) => {
            setAddress(savedAddress);
            setIsChangingAddress(false);
          }}
          onCancel={() => setIsChangingAddress(false)}
        />
      )}
    </section>
  );
}

export default PaymentMethod;
