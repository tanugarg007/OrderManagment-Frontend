import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ChevronRight, ShieldCheck, UserPlus } from "lucide-react";
import { getAuthorizationHeaders } from "../auth.js";

const roleLabels = {
  admin: "SuperAdmin (legacy)",
  superadmin: "SuperAdmin",
  inventory: "Inventory",
};

const AdminStaff = () => {
  const { searchTerm = "" } = useOutletContext();
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "inventory",
  });

  useEffect(() => {
    let isCurrent = true;

    const loadStaff = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
        const response = await fetch(`${apiBaseUrl}/users/staff`, {
          headers: getAuthorizationHeaders(),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.message || `Staff request failed (${response.status}).`);
        }
        if (!Array.isArray(payload.users)) {
          throw new Error("The staff API returned an invalid response.");
        }
        if (isCurrent) setStaff(payload.users);
      } catch (error) {
        if (isCurrent) {
          setLoadError(error instanceof Error ? error.message : "Could not load staff.");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadStaff();
    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleStaff = staff.filter((member) =>
    [member.name, member.email, roleLabels[member.role] || member.role]
      .some((value) => String(value || "").toLowerCase().includes(normalizedSearch))
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(`${apiBaseUrl}/users/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthorizationHeaders(),
        },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || `Staff account could not be created (${response.status}).`);
      }
      if (!payload.user || payload.user.role !== form.role) {
        throw new Error("The staff API returned an invalid account.");
      }

      setSuccessMessage(`${roleLabels[payload.user.role]} account created.`);
      setForm({ name: "", email: "", password: "", role: "inventory" });
      setReloadKey((key) => key + 1);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create staff account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-section-page">
      <div className="admin-section-heading">
        <div>
          <span className="dashboard-label">TEAM ACCESS</span>
          <h1>Staff accounts</h1>
          <p>Create SuperAdmin accounts or grant Inventory-only access.</p>
        </div>
        <Link className="section-back-link" to="/admin">
          Back to overview
          <ChevronRight size={15} />
        </Link>
      </div>

      <section className="premium-card section-table-card staff-create-card">
        <div className="premium-card-header">
          <div>
            <h2><UserPlus size={17} /> Add staff member</h2>
            <p>Inventory staff can manage products and stock. SuperAdmins can manage the full dashboard.</p>
          </div>
        </div>

        <form className="product-form staff-create-form" onSubmit={handleSubmit}>
          <label className="product-form-field">
            <span>Full name <b>*</b></span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
            />
          </label>
          <label className="product-form-field">
            <span>Email address <b>*</b></span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              autoComplete="email"
              required
            />
          </label>
          <label className="product-form-field">
            <span>Temporary password <b>*</b></span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
          <label className="product-form-field">
            <span>Role <b>*</b></span>
            <select
              name="role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <option value="inventory">Inventory</option>
              <option value="superadmin">SuperAdmin</option>
            </select>
          </label>
          <div className="staff-form-footer">
            {submitError && <p className="admin-table-error" role="alert">{submitError}</p>}
            {successMessage && <p className="staff-success-message" role="status">{successMessage}</p>}
            <button className="add-product-btn" type="submit" disabled={isSubmitting}>
              <ShieldCheck size={15} />
              {isSubmitting ? "Creating..." : "Create staff account"}
            </button>
          </div>
        </form>
      </section>

      <section className="premium-card section-table-card staff-list-card">
        <div className="premium-card-header">
          <div>
            <h2>Current staff</h2>
            <p>{staff.length} staff accounts</p>
          </div>
        </div>
        <div className="section-table-scroll">
          <table className="section-data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th></tr>
            </thead>
            <tbody>
              {isLoading && <tr><td className="section-empty" colSpan={4}>Loading staff...</td></tr>}
              {!isLoading && loadError && (
                <tr>
                  <td className="section-empty" colSpan={4}>
                    <div className="admin-table-error" role="alert">
                      <span>{loadError}</span>
                      <button type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && !loadError && visibleStaff.map((member) => (
                <tr key={member._id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{roleLabels[member.role] || member.role}</td>
                  <td>
                    {member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))}
              {!isLoading && !loadError && visibleStaff.length === 0 && (
                <tr>
                  <td className="section-empty" colSpan={4}>
                    {staff.length
                      ? `No staff match “${searchTerm}”.`
                      : "No staff accounts have been created yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default AdminStaff;
