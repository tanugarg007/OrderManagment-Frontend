import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import Login from "./login.jsx";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/#products", label: "Products" },
  { to: "/#categories", label: "Categories" },
  { to: "/#deals", label: "Deals" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  console.log("NEW NAVBAR LOADED");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>

        {/* Logo */}
        <Link to="/" className="logo">
          Order<span>Management</span>
        </Link>

        {/* Desktop Menu */}
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
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Buttons */}
        <div className="nav-actions">

          {/* LOGIN BUTTON */}
 <button
  type="button"
  className="btn btn-outline"
  onClick={() => {
    console.log("LOGIN BUTTON CLICKED");
    setLoginOpen(true);
  }}
>
  Login
</button>
          <button
            type="button"
            className="btn btn-primary"
          >
            Register
          </button>

        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </nav>

      {/* LOGIN POPUP */}
      {loginOpen && (
        <Login
          onClose={() => setLoginOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;