import React from "react";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../auth.js";

const AdminNavbar = ({ onMenuClick, searchTerm, onSearchChange }) => {
  const navigate = useNavigate();
  const session = getStoredSession();

  const handleLogout = () => {
    clearStoredSession();
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="admin-navbar">

      {/* LEFT */}
      <div className="navbar-left">

        <button
          className="mobile-menu-btn"
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        <div className="navbar-brand">

          <div className="brand-logo" aria-hidden="true">
            OF
          </div>

          <div className="brand-text">
            <h2>
              Order<span>Flow</span>
            </h2>

            <p>Admin Panel</p>
          </div>

        </div>

      </div>


      {/* SEARCH */}
      <label className="navbar-search">

        <Search size={19} />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search orders, customers..."
          aria-label="Search orders and customers"
        />

        <kbd>⌘ K</kbd>
      </label>


      {/* RIGHT */}
      <div className="navbar-right">

        <button
          type="button"
          className="admin-add-account-btn"
          onClick={() => navigate("/admin/staff")}
          hidden={session?.user?.role === "inventory"}
        >
          <UserPlus size={16} />
          <span>Add staff</span>
        </button>

        <button
          className="notification-btn"
          aria-label="Notifications"
          type="button"
        >
          <Bell size={19} />

          <span className="notification-dot"></span>
        </button>

        <span className="navbar-divider" aria-hidden="true" />

        <div className="navbar-profile">

          <div className="profile-avatar" aria-hidden="true">
            AD
          </div>

          <div className="profile-text">
            <strong>{session?.user?.name || "Admin"}</strong>
            <span>Administrator</span>
          </div>

          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>

      </div>

      </header>
    </>
  );
};

export default AdminNavbar;