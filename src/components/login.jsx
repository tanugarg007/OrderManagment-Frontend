import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setStoredSession } from "../auth.js";
import "./login.css";

function Login({ onClose, onSuccess, onSwitchToRegister }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (step === "email") {
      setStep("password");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(`${apiBaseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || `Sign in failed (${response.status}).`);
      }
      if (
        typeof payload.token !== "string" ||
        !payload.user ||
        !["admin", "user"].includes(payload.user.role)
      ) {
        throw new Error("The login API returned an invalid account.");
      }

      setStoredSession({ token: payload.token, user: payload.user });
      onSuccess?.(payload.user);
      onClose(true);
      navigate(payload.user.role === "admin" ? "/admin" : "/", {
        replace: true,
      });
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Could not sign in."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-overlay" onClick={() => onClose(false)}>
      <div
        className="login-popup"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button
          type="button"
          className="login-close"
          aria-label="Close sign in"
          onClick={() => onClose(false)}
        >
          ×
        </button>

        <div className="login-header">
          <div className="login-logo">OM</div>
          <span className="login-eyebrow">YOUR ORDER MANAGEMENT ACCOUNT</span>
          <h2 id="login-title">{step === "email" ? "Sign in" : "Welcome back"}</h2>
          <p>
            {step === "email"
              ? "Enter your email to access your account"
              : `Continue securely as ${email}`}
          </p>
        </div>

        <div className="login-step-indicator" aria-label={`Step ${step === "email" ? 1 : 2} of 2`}>
          <span className={step === "email" ? "active" : "complete"} />
          <span className={step === "password" ? "active" : ""} />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {step === "email" ? (
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          ) : (
            <>
              <button
                type="button"
                className="login-email-back"
                onClick={() => {
                  setError("");
                  setPassword("");
                  setStep("email");
                }}
              >
                ← Change email
              </button>
              <div className="login-field">
                <label htmlFor="login-password">Password</label>
                <div className="login-input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    className="show-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </>
          )}

          {error && <div className="login-error" role="alert">{error}</div>}

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Signing in…"
              : step === "email"
                ? "Continue"
                : "Sign In"}
          </button>
        </form>

        <div className="login-register">
          <p>
            <span>New to Order Management?</span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              disabled={!onSwitchToRegister}
            >
              Create your account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;