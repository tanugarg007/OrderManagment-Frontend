import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ChevronDown,
  LogIn,
  LogOut,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";
import { clearStoredSession, getStoredSession } from "../auth.js";
import Login from "./login.jsx";
import Register from "./Register.jsx";


const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/#categories", label: "Categories" },
  { to: "/#deals", label: "Deals" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const navigate = useNavigate();
  const accountMenuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");
  const [session, setSession] = useState(() => getStoredSession());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const syncSession = () => setSession(getStoredSession());
    const closeAccountMenu = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setAccountMenuOpen(false);
    };

    window.addEventListener("storage", syncSession);
    window.addEventListener("orderflow-session-change", syncSession);
    document.addEventListener("pointerdown", closeAccountMenu);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("orderflow-session-change", syncSession);
      document.removeEventListener("pointerdown", closeAccountMenu);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  const handleSignOut = () => {
    clearStoredSession();
    setAccountMenuOpen(false);
    closeMobileMenu();
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (!session?.token || session.user?.role !== "user" || isDeletingAccount) {
      return;
    }

    setIsDeletingAccount(true);
    setDeleteAccountError("");

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(`${apiBaseUrl}/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || `Could not delete account (${response.status}).`);
      }

      clearStoredSession();
      setDeleteAccountOpen(false);
      setAccountMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      setDeleteAccountError(
        error instanceof Error ? error.message : "Could not delete account."
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const switchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const switchToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
        <nav className="navbar">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <span className="logo-icon">
              OM
            </span>

            <span className="logo-text">
              Order<span>Management</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            <div className="account-menu" ref={accountMenuRef}>
              <button
                type="button"
                className={`account-menu-trigger ${accountMenuOpen ? "open" : ""}`}
                aria-haspopup="menu"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen((open) => !open)}
              >
                <UserRound size={18} aria-hidden="true" />
                <span>Profile</span>
                <ChevronDown size={15} className="account-menu-chevron" />
              </button>
              {accountMenuOpen && (
                <div className="account-menu-panel" role="menu">
                  {session && (
                    <div className="account-menu-identity">
                      <span className="account-menu-avatar">
                        <UserRound size={17} />
                      </span>
                      <span>
                        <strong>{session.user.name || "Account"}</strong>
                        <small>{session.user.email}</small>
                      </span>
                    </div>
                  )}
                  {session ? (
                    <>
                      <Link
                        to="/my-orders"
                        className="account-menu-item"
                        role="menuitem"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <ShoppingBag size={16} />
                        My Order
                      </Link>
                      <button
                        type="button"
                        className="account-menu-item account-menu-signout"
                        role="menuitem"
                        onClick={handleSignOut}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                      {session.user?.role === "user" && (
                        <button
                          type="button"
                          className="account-menu-item account-menu-delete"
                          role="menuitem"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setDeleteAccountError("");
                            setDeleteAccountOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                          Delete account
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="account-menu-item"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setLoginOpen(true);
                      }}
                    >
                      <LogIn size={16} />
                      Sign in
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>

          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "mobile-nav-link active"
                    : "mobile-nav-link"
                }
              >
                {item.label}
                <span>→</span>
              </NavLink>
            ))}
          </div>

        </div>
      </header>

      {/* Login Popup */}
      {loginOpen && (
        <Login
          onClose={() => setLoginOpen(false)}
          onSwitchToRegister={switchToRegister}
        />
      )}

      {/* Register Popup */}
      {registerOpen && (
        <Register
          onClose={() => setRegisterOpen(false)}
          onSwitchToLogin={switchToLogin}
        />
)}

      {deleteAccountOpen && (
        <div
          className="delete-account-overlay"
          onClick={() => {
            if (!isDeletingAccount) setDeleteAccountOpen(false);
          }}
        >
          <section
            className="delete-account-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            aria-describedby="delete-account-description"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="delete-account-icon" aria-hidden="true">
              <AlertTriangle size={22} />
            </span>
            <h2 id="delete-account-title">Delete your account?</h2>
            <p id="delete-account-description">
              This permanently deletes your account and order history. This action cannot be undone.
            </p>
            {deleteAccountError && (
              <p className="delete-account-error" role="alert">{deleteAccountError}</p>
            )}
            <div className="delete-account-actions">
              <button
                type="button"
                className="delete-account-cancel"
                disabled={isDeletingAccount}
                onClick={() => setDeleteAccountOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-account-confirm"
                disabled={isDeletingAccount}
                onClick={handleDeleteAccount}
              >
                {isDeletingAccount ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Navbar;