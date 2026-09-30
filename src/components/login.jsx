import { useState } from "react";
import "./login.css";

function Login({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className="login-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="login-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="login-header">
          <div className="login-logo">OM</div>
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>

            <div className="login-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="remember-row">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="login-submit"
          >
            Sign In
          </button>
        </form>

        <div className="login-register">
          <p>
            Don't have an account?
            <button type="button">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;