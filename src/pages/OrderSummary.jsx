import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import DeliveryAddressForm from "../components/DeliveryAddressForm.jsx";

const formatPrice = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;
  const [address, setAddress] = useState(state?.address);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const stock = Number(product?.quantity);
  const maxQuantity =
    Number.isFinite(stock) && stock > 0 ? Math.floor(stock) : 1;
  const [quantity, setQuantity] = useState(
    Math.min(Math.max(1, Number(state?.quantity) || 1), maxQuantity)
  );

  if (!product || !address) {
    return <Navigate to="/" replace />;
  }

  const itemTotal = Number(product.price) * quantity;
  const deliveryFee = 0;
  const orderTotal = itemTotal + deliveryFee;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const handleContinue = () => {
    console.log("[Checkout] Order summary confirmed; opening place-order step.");
    navigate("/place-order", {
      state: {
        product,
        address,
        quantity,
        itemTotal,
        deliveryFee,
        orderTotal,
        deliveryDate: deliveryDate.toISOString(),
      },
    });
  };

  return (
    <section className="order-summary-page">
      <div className="order-summary-heading">
        <span className="dashboard-label">CHECKOUT</span>
        <h1>Order summary</h1>
        <p>Review your delivery details and order before continuing.</p>
      </div>

      <div className="order-summary-sections">
        <section className="order-summary-card order-summary-address-card">
          <div className="order-summary-card-heading">
            <span className="order-summary-step">1</span>
            <div>
              <span className="order-summary-eyebrow">DELIVERED TO</span>
              <h2>Delivery address</h2>
            </div>
            <button
              className="order-summary-change"
              type="button"
              onClick={() => setIsChangingAddress(true)}
            >
              Change
            </button>
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
            <h2>Item details</h2>
          </div>
          <div className="order-summary-product">
            {product.image && (
              <img src={product.image} alt={product.name} />
            )}
            <div>
              <span className="order-summary-category">{product.category}</span>
              <h3>{product.name}</h3>
              <label className="order-summary-quantity">
                <span>Quantity</span>
                <select
                  aria-label={`Quantity for ${product.name}`}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
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
            <h2>Price details</h2>
          </div>
          <div className="order-summary-price-row">
            <span>Price ({quantity} {quantity === 1 ? "item" : "items"})</span>
            <span>{formatPrice(itemTotal)}</span>
          </div>
          <div className="order-summary-price-row">
            <span>Delivery fee</span>
            <span className="order-summary-free">FREE</span>
          </div>
          <div className="order-summary-price-total">
            <strong>Total amount</strong>
            <strong>{formatPrice(orderTotal)}</strong>
          </div>
          <p className="order-summary-note">
            Your order has not been placed yet.
          </p>
          <button
            className="order-summary-continue"
            type="button"
            onClick={handleContinue}
          >
            Continue
          </button>
        </section>
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

export default OrderSummary;
