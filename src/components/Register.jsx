import { useState } from "react";
import "../App.css";

function Register({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  };

  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) return "";

    if (password.length < 6) return "weak";

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return "strong";
    }

    return "medium";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setMessage("Please accept the Terms & Conditions.");
      return;
    }

    console.log("Register submitted:", form);

    setMessage("Account created successfully!");
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="register-overlay" onClick={onClose}>
      <div
        className="register-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="register-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="register-decoration register-decoration-one"></div>
        <div className="register-decoration register-decoration-two"></div>

        <div className="register-header">
          <div className="register-logo">
            <span>OM</span>
          </div>

          <div className="register-badge">
            <span></span>
            GET STARTED
          </div>

          <h2>Create Your Account</h2>

          <p>
            Join Order Management and manage your business
            <br />
            smarter, faster and easier.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label>Full Name</label>

            <div className="register-input-box">
              <span className="register-icon">♙</span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label>Email Address</label>

            <div className="register-input-box">
              <span className="register-icon">@</span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label>Password</label>

            <div className="register-input-box">
              <span className="register-icon">⌑</span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {passwordStrength && (
              <div className="password-strength">
                <div className={`strength-line ${passwordStrength}`}></div>

                <span className={passwordStrength}>
                  {passwordStrength === "weak" && "Weak password"}
                  {passwordStrength === "medium" && "Medium password"}
                  {passwordStrength === "strong" && "Strong password"}
                </span>
              </div>
            )}
          </div>

          <div className="register-field">
            <label>Confirm Password</label>

            <div className="register-input-box">
              <span className="register-icon">⌑</span>

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <label className="terms-row">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />

            <span>
              I agree to the{" "}
              <button type="button">Terms & Conditions</button>
              {" "}and{" "}
              <button type="button">Privacy Policy</button>
            </span>
          </label>

          {message && (
            <div
              className={`register-message ${
                message.includes("successfully") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <button type="submit" className="register-submit">
            <span>Create Account</span>
            <span className="register-submit-arrow">↗</span>
          </button>
        </form>

        <div className="register-login">
          <span>Already have an account?</span>

          <button type="button" onClick={onClose}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;