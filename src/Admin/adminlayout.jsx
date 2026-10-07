import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminNavbar from "./adminnavbar.jsx";
import AdminSidebar from "./adminsidebar.jsx";

import "./admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="admin-layout">
      <AdminNavbar
        onMenuClick={() => setSidebarOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="admin-main">
        <Outlet context={{ searchTerm }} />
      </main>
    </div>
  );
};

export default AdminLayout;