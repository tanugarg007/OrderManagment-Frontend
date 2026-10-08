import React from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowDownToLine,
  ChevronLeft,
  CircleHelp,
  LayoutDashboard,
  Package,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { getStoredSession } from "../auth.js";

const AdminSidebar = ({ isOpen, onClose }) => {
  const role = getStoredSession()?.user?.role;
  const canManageDashboard = role === "admin" || role === "superadmin";

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand-mark">O</div>
        <div className="sidebar-brand-copy">
          <strong>Orderly</strong>
          <span>COMMERCE SUITE</span>
        </div>
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">WORKSPACE</span>
        {canManageDashboard && (
          <>
            <NavLink to="/admin" end onClick={onClose}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
              <span className="nav-active-marker" />
            </NavLink>
            <NavLink to="/admin/orders" onClick={onClose}>
              <ShoppingCart size={18} />
              <span>Orders</span>
              <span className="nav-count">12</span>
            </NavLink>
          </>
        )}
        <NavLink to="/admin/products" onClick={onClose}>
          <Package size={18} />
          <span>Inventory</span>
        </NavLink>
        {canManageDashboard && (
          <>
            <NavLink to="/admin/users" onClick={onClose}>
              <Users size={18} />
              <span>Customers</span>
            </NavLink>
            <NavLink to="/admin/staff" onClick={onClose}>
              <ShieldCheck size={18} />
              <span>Staff accounts</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-spacer" />
      <div className="sidebar-upgrade-card">
        <div className="upgrade-icon">
          <ArrowDownToLine size={16} />
        </div>
        <strong>Your store is growing</strong>
        <p>You're up 18% this month. Keep the momentum going.</p>
        <div className="upgrade-progress"><span /></div>
        <small>MONTHLY GOAL <b>72%</b></small>
      </div>

      <div className="sidebar-footer-links">
        <a href="mailto:support@orderly.com">
          <CircleHelp size={17} />
          <span>Help & support</span>
        </a>
      </div>
      <div className="sidebar-account">
        <div className="account-avatar">AD</div>
        <div className="account-copy">
          <strong>Alexandra Davis</strong>
          <span>{role === "inventory" ? "Inventory staff" : "Administrator"}</span>
        </div>
        <span className="account-status" />
      </div>
    </aside>
  );
};

export default AdminSidebar;