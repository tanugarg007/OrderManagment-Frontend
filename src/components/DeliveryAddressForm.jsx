import { useEffect, useRef, useState } from "react";
import { getStoredSession, setStoredSession } from "../auth.js";
import "../App.css";

const emptyAddress = {
  name: "",
  state: "",
  city: "",
  phoneNumber: "",
  pincode: "",
  address: "",
  houseNumber: "",
};

const DeliveryAddressForm = ({ initialAddress, onSaved, onCancel }) => {
  const [form, setForm] = useState({ ...emptyAddress, ...initialAddress });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const redirectTimer = useRef(null);

  useEffect(
    () => () => {
      if (redirectTimer.current) {
        window.clearTimeout(redirectTimer.current);
      }
    },
    []
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  const session = getStoredSession();

  if (!session?.token) {
    setError("Please sign in again before saving your delivery address.");
    return;
  }

  setIsSaving(true);

  try {
    const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
    const response = await fetch(`${apiBaseUrl}/users/me/delivery-address`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(form),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload.message || `Address could not be saved (${response.status}).`
      );
    }

    if (!payload.user || !payload.user.deliveryAddress) {
      throw new Error("The address API did not return the saved delivery address.");
    }

    setStoredSession({ ...session, user: payload.user });
    setSavedAddress(payload.user.deliveryAddress);
    redirectTimer.current = window.setTimeout(() => {
      onSaved(payload.user.deliveryAddress);
    }, 2000);
  } catch (saveError) {
    setError(
      saveError instanceof Error
        ? saveError.message
        : "Could not save your delivery address."
    );
  } finally {
    setIsSaving(false);
  }
};
  return (
    <div
      className="delivery-address-overlay"
      onClick={() => {
        if (!isSaving && !savedAddress) onCancel();
      }}
    >
      <section
        className="delivery-address-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-address-title"
        onClick={(event) => event.stopPropagation()}
      >
        {!savedAddress && (
          <button
            type="button"
            className="delivery-address-close"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Close delivery address form"
          >
            ×
          </button>
        )}
        {savedAddress ? (
          <div className="delivery-address-success" role="status" aria-live="polite">
            <span className="delivery-address-success-icon" aria-hidden="true">✓</span>
            <span className="dashboard-label">ADDRESS SAVED</span>
            <h2 id="delivery-address-title">Delivery address saved</h2>
            <p className="delivery-address-description">
              Taking you to your order summary…
            </p>
          </div>
        ) : (
          <>
            <span className="dashboard-label">CHECKOUT</span>
            <h2 id="delivery-address-title">Where should we deliver?</h2>
            <p className="delivery-address-description">
              Save this address to your account once. Future Buy Now clicks will go straight to your order summary.
            </p>

            <form className="delivery-address-form" onSubmit={handleSubmit}>
          <label className="delivery-address-field delivery-address-field-full">
            <span>Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              maxLength={80}
              required
            />
          </label>

          <label className="delivery-address-field">
            <span>Phone Number</span>
            <input
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              autoComplete="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              title="Enter a 10-digit phone number."
              required
            />
          </label>

          <label className="delivery-address-field">
            <span>PIN Code</span>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              autoComplete="postal-code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              title="Enter a 6-digit PIN code."
              required
            />
          </label>

          <label className="delivery-address-field">
            <span>State</span>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              autoComplete="address-level1"
              maxLength={80}
              required
            />
          </label>

          <label className="delivery-address-field">
            <span>City</span>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              autoComplete="address-level2"
              maxLength={80}
              required
            />
          </label>

          <label className="delivery-address-field delivery-address-field-full">
            <span>House Number</span>
            <input
              name="houseNumber"
              value={form.houseNumber}
              onChange={handleChange}
              autoComplete="address-line1"
              maxLength={80}
              required
            />
          </label>

          <label className="delivery-address-field delivery-address-field-full">
            <span>Address</span>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              autoComplete="street-address"
              rows={3}
              maxLength={300}
              required
            />
          </label>

          {error && (
            <div className="delivery-address-error" role="alert">
              {error}
            </div>
          )}

          <div className="delivery-address-actions">
            <button
              type="button"
              className="delivery-address-cancel"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="delivery-address-save"
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save Address"}
            </button>
          </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default DeliveryAddressForm;
