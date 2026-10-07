import { useRef } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const formatPrice = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function PlaceOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const checkoutRequestId = useRef(state?.checkoutRequestId);
  if (!checkoutRequestId.current) {
    checkoutRequestId.current = globalThis.crypto.randomUUID();
  }
  const product = state?.product;
  const address = state?.address;
  const quantity = Math.max(1, Number(state?.quantity) || 1);

  if (!product || !address) {
    return <Navigate to="/" replace />;
  }

  const itemTotal = Number(product.price) * quantity;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const paymentState = {
    ...state,
    checkoutRequestId: checkoutRequestId.current,
    quantity,
    itemTotal,
    deliveryFee: 0,
    orderTotal: itemTotal,
    deliveryDate: deliveryDate.toISOString(),
  };

  const handlePlaceOrder = () => {
    console.log("[Checkout] Place-order step confirmed; opening payment method.");
    navigate("/payment-method", { state: paymentState });
  };

  return (
    <section className="order-summary-page">
      <div className="order-summary-heading">
        <span className="dashboard-label">CHECKOUT</span>
        <h1>Place your order</h1>
        <p>Review your order details before choosing how to pay.</p>
      </div>

      <div className="order-summary-sections">
        <section className="order-summary-card">
          <div className="order-summary-card-heading">
            <span className="order-summary-step">1</span>
            <h2>Delivery address</h2>
          </div>
          <address className="order-summary-address">
            <strong>{address.name}</strong>
            <span>{address.houseNumber}</span>
            <span>{address.address}</span>
            <span>{address.city}, {address.state} {address.pincode}</span>
            <span>Phone: {address.phoneNumber}</span>
          </address>
        </section>

        <section className="order-summary-card">
          <div className="order-summary-card-heading">
            <span className="order-summary-step">2</span>
            <h2>Order details</h2>
          </div>
          <div className="order-summary-product">
            {product.image && <img src={product.image} alt={product.name} />}
            <div>
              <span className="order-summary-category">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{quantity} {quantity === 1 ? "item" : "items"} · {formatPrice(itemTotal)}</p>
            </div>
          </div>
          <div className="order-summary-delivery-date">
            <span className="order-summary-delivery-icon" aria-hidden="true">✓</span>
            <p>
              Delivery by{" "}
              <strong>
                {deliveryDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </strong>
            </p>
          </div>
        </section>

        <section className="order-summary-card order-summary-price-card">
          <div className="order-summary-card-heading">
            <span className="order-summary-step">3</span>
            <h2>Order total</h2>
          </div>
          <div className="order-summary-price-row">
            <span>Items ({quantity})</span>
            <span>{formatPrice(itemTotal)}</span>
          </div>
          <div className="order-summary-price-row">
            <span>Delivery fee</span>
            <span className="order-summary-free">FREE</span>
          </div>
          <div className="order-summary-price-total">
            <strong>Total amount</strong>
            <strong>{formatPrice(itemTotal)}</strong>
          </div>
          <button
            className="order-summary-continue"
            type="button"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </section>

        <Link
          className="payment-method-back"
          to="/order-summary"
          state={state}
        >
          Back to order summary
        </Link>
      </div>
    </section>
  );
}

export default PlaceOrder;
