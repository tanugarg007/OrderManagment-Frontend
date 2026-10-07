import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Download,
  Users,
} from "lucide-react";

const customers = [
  ["Aarav Sharma", "aarav.s@example.com", "12", "₹48,920", "Active"],
  ["Meera Kapoor", "meera.k@example.com", "8", "₹32,640", "Active"],
  ["Rahul Verma", "rahul.v@example.com", "5", "₹18,450", "Active"],
  ["Simran Kaur", "simran.k@example.com", "3", "₹9,280", "New"],
  ["Kabir Singh", "kabir.s@example.com", "7", "₹26,790", "Active"],
];
const columns = ["Customer", "Email", "Orders", "Lifetime value", "Status"];
const metrics = [
  { label: "Total customers", value: "3,842", change: "+5.2%", direction: "up" },
  { label: "New this month", value: "184", change: "+12.1%", direction: "up" },
  { label: "Returning customers", value: "68%", change: "+3.4%", direction: "up" },
];

const AdminCustomers = () => {
  const { searchTerm = "" } = useOutletContext();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) =>
    customer.some((value) => value.toLowerCase().includes(normalizedSearch))
  );

  const exportCustomers = () => {
    const csv = [columns, ...filteredCustomers]
      .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "customers.csv";
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="admin-section-page">
      <div className="admin-section-heading">
        <div>
          <span className="dashboard-label">CUSTOMER RELATIONSHIPS</span>
          <h1>Customers</h1>
          <p>Get to know your community and the people behind every order.</p>
        </div>
        <div className="section-heading-actions">
          <Link className="section-back-link" to="/admin">
            Back to overview
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>

      <div className="section-metric-grid">
        {metrics.map((metric) => {
          const TrendIcon = metric.direction === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <article className="section-metric-card" key={metric.label}>
              <div className="section-metric-icon"><Users size={17} /></div>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small className={metric.direction}>
                <TrendIcon size={13} />
                {metric.change}
              </small>
            </article>
          );
        })}
      </div>

      <section className="premium-card section-table-card">
        <div className="premium-card-header">
          <div>
            <h2>All customers</h2>
            <p>Showing the latest activity from your store</p>
          </div>
          <button className="section-export-btn" type="button" onClick={exportCustomers}>
            <Download size={15} />
            Export
          </button>
        </div>

        <div className="section-table-scroll">
          <table className="section-data-table">
            <thead>
              <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer[0]}>
                  {customer.map((value, index) => (
                    <td key={`${customer[0]}-${index}`}>
                      {index === customer.length - 1 ? (
                        <span className={`section-status ${value.toLowerCase()}`}>
                          <i />
                          {value}
                        </span>
                      ) : value}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td className="section-empty" colSpan={columns.length}>
                    No customers match “{searchTerm}”.
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

export default AdminCustomers;
