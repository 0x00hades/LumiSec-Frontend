import React from "react";
import { Link } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageRecipients } from "../../utils/roles";
import useRecipients from "../../hooks/useRecipients";
import "../../Components/Shared/PhishingShared.css";

export default function RecipientsList() {
  const { recipients, loading, error, search, setSearch, reload, deleteRecipient } = useRecipients();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipient?")) return;
    await deleteRecipient(id);
    reload();
  };

  if (loading) return <PhishingLoading message="Loading recipients..." skeleton rows={5} />;

  return (
    <div className="phishing-soc-page">
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h5 className="text-white">Recipients</h5>
          <p className="dashboard-desc">{recipients.length} recipients</p>
        </div>
        <RoleGate allow={canManageRecipients}>
          <Link to="/Phishing/Recipients/import" className="btn integration-btn me-2">Import CSV</Link>
        </RoleGate>
      </div>
      <PhishingAlert type="danger" message={error} onRetry={reload} />

      <div className="search-container mb-3">
        <i className="fa-brands fa-sistrix discover-search-icon" />
        <input className="form-control header-search-input rounded-3" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="dashboard-card p-0">
        <table className="w-100 discover-tabel">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Risk</th>
              <th>Tracking</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipients.map((r) => (
              <tr key={r.id}>
                <td className="text-white">{r.name}</td>
                <td>{r.email}</td>
                <td>{r.department}</td>
                <td>{r.riskScore}</td>
                <td className="text-secondary small">
                  {r.emailSent && "Sent "}
                  {r.opened && "Opened "}
                  {r.clicked && "Clicked "}
                  {r.submitted && <span className="text-danger">Submitted</span>}
                </td>
                <td>
                  <Link to={`/Phishing/Recipients/${r.id}`} className="btn btn-sm integration-btn me-1">Details</Link>
                  <RoleGate allow={canManageRecipients}>
                    <Link to={`/Phishing/Recipients/${r.id}/edit`} className="btn btn-sm integration-btn me-1">Edit</Link>
                    <button type="button" className="btn btn-sm integration-btn text-danger" onClick={() => handleDelete(r.id)}>Delete</button>
                  </RoleGate>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
