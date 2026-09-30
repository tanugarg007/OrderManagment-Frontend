import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/#products', label: 'Products' },
  { to: '/#categories', label: 'Categories' },
  { to: '/#deals', label: 'Deals' },
  { to: '/contact', label: 'Contact' }
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onClick = (e) => {
      const nav = document.getElementById('navLinks');
      const ham = document.getElementById('hamburger');
      if (menuOpen && nav && ham && !nav.contains(e.target) && !ham.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [menuOpen]);

  const handleHashLink = (e, to) => {
    if (to.startsWith('/#')) {
      const id = to.slice(2);
      if (location.pathname !== '/') return;
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMenuOpen(false);
      }
    }
  };

  const isSectionActive = (hash, exact = false) => {
    if (location.pathname !== '/') return false;
    if (!location.hash) return exact;
    return location.hash === hash;
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>OrderPro</span>
        </Link>

        <ul id="navLinks" className={`nav-links${menuOpen ? ' open' : ''}`}>
          {navItems.map((item) => {
            if (item.to.startsWith('/#')) {
              const hash = item.to.slice(1);
              return (
                <li key={item.to}>
                  <a
                    href={item.to}
                    className={`nav-link${isSectionActive(hash) ? ' active' : ''}`}
                    onClick={(e) => handleHashLink(e, item.to)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            }
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link${isActive && location.pathname === item.to ? ' active' : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="nav-actions">
          <button className="btn btn-outline">Login</button>
          <button className="btn btn-primary">Register</button>
        </div>

        <button
          id="hamburger"
          className={`hamburger${menuOpen ? ' open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
