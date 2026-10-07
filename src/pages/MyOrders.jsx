import { useState } from "react";
import { Link } from "react-router-dom";

const formatPrice = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [accessStep, setAccessStep] = useState("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const requestOtp = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(`${apiBaseUrl}/users/orders/email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || `Could not send verification code (${response.status}).`);
      }
      setIsOtpSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not send verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueToOtp = (event) => {
    event.preventDefault();
    setError("");
    setOtp("");
    setIsOtpSent(false);
    setAccessStep("otp");
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(`${apiBaseUrl}/users/orders/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || `Could not verify code (${response.status}).`);
      }
      if (!Array.isArray(payload.orders)) {
        throw new Error("The orders API returned an invalid response.");
      }

      setOrders(payload.orders);
      setIsEmailVerified(true);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Could not verify code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOrderList = () => (
    orders.length === 0 ? (
      <div className="my-orders-message">
        <h2>No orders found for this email</h2>
        <p>Check the email address used when placing your order.</p>
        <Link to="/products" className="order-summary-continue">Browse products</Link>
      </div>
    ) : (
      <div className="my-orders-list">
        {orders.map((order) => {
          const orderId = String(order._id || order.id || "");
          const items = Array.isArray(order.items) ? order.items : [];
          const quantities = Array.isArray(order.quantity)
            ? order.quantity
            : [order.quantity];

          return (
            <article className="my-order-card" key={orderId}>
              <div className="my-order-header">
                <div>
                  <span>ORDER</span>
                  <strong>#{orderId.slice(-8).toUpperCase()}</strong>
                </div>
                <span className="my-order-status">{order.status || "Pending"}</span>
              </div>
              <div className="my-order-details">
                <div>
                  <span>Items</span>
                  <strong>
                    {items.length
                      ? items.map((item, index) => `${item} × ${quantities[index] ?? 1}`).join(", ")
                      : "Order items"}
                  </strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>{formatPrice(order.totalAmount)}</strong>
                </div>
                <div>
                  <span>Placed</span>
                  <strong>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "Date unavailable"}
                  </strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    )
  );

  return (
    <section className="my-orders-page">
      <header className="my-orders-heading">
        <span className="dashboard-label">YOUR ACCOUNT</span>
        <h1>My Orders</h1>
        <p>
          {isEmailVerified
            ? `Showing orders associated with ${email}.`
            : "Verify your email to securely view orders placed with it."}
        </p>
      </header>

      {isEmailVerified ? (
        renderOrderList()
      ) : (
        <div className="my-orders-message my-orders-access">
          <h2>{accessStep === "email" ? "Find your orders" : "Check your email"}</h2>
          <p>
            {accessStep === "email"
              ? "Enter the email address used for your order. We'll send you a one-time verification code."
              : `Enter the six-digit code sent to ${email}.`}
          </p>
          <form onSubmit={accessStep === "email" ? continueToOtp : verifyOtp}>
            {accessStep === "email" ? (
              <label className="my-orders-field">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  maxLength={254}
                  required
                />
              </label>
            ) : (
              <label className="my-orders-field">
                Verification code
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                />
              </label>
            )}
            {error && <p className="my-orders-error" role="alert">{error}</p>}
            <div className="my-orders-access-actions">
              {accessStep === "otp" && (
                <>
                  <button
                    type="button"
                    className="my-orders-text-button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setAccessStep("email");
                      setError("");
                      setOtp("");
                      setIsOtpSent(false);
                    }}
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    className="order-summary-continue"
                    disabled={isSubmitting}
                    onClick={requestOtp}
                  >
                    {isSubmitting ? "Sending..." : isOtpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </>
              )}
              <button
                type="submit"
                className="order-summary-continue"
                disabled={isSubmitting || (accessStep === "otp" && !isOtpSent)}
              >
                {isSubmitting
                  ? "Please wait..."
                  : accessStep === "email"
                    ? "Next"
                    : "Verify OTP"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default MyOrders;
