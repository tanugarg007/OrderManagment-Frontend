import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Login from "./login.jsx";
import Register from "./Register.jsx";


const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/#products", label: "Products" },
  { to: "/#categories", label: "Categories" },
  { to: "/#deals", label: "Deals" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
const [registerOpen, setRegisterOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMenuOpen(false);
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

            <button
              type="button"
              className="login-btn"
              onClick={() => setLoginOpen(true)}
            >
              <span>Login</span>
              <span className="login-arrow">↗</span>
            </button>

        <button
  type="button"
  className="register-btn"
  onClick={() => {
    console.log("REGISTER BUTTON CLICKED");
    setRegisterOpen(true);
  }}
>
  Register
</button>

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

          <div className="mobile-actions">
            <button
              type="button"
              className="mobile-login"
              onClick={() => {
                setLoginOpen(true);
                closeMobileMenu();
              }}
            >
              Login
            </button>

            <button
              type="button"
              className="mobile-register"
              onClick={() => {
                setRegisterOpen(true);
                closeMobileMenu();
              }}
            >
              Register
            </button>
          </div>

        </div>
      </header>

      {/* Login Popup */}
      {loginOpen && (
        <Login
          onClose={() => setLoginOpen(false)}
        />
      )}

      {/* Register Popup */}
      {registerOpen && (
  <Register onClose={() => setRegisterOpen(false)} />
)}
    </>
  );
}

export default Navbar;