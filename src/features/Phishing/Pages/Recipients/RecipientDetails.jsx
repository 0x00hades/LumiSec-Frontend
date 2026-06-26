import React from "react";
import { Link, useParams } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageRecipients } from "../../utils/roles";
import useRecipients from "../../hooks/useRecipients";
import { riskLevelClass } from "../../utils/normalizers";
import "../../Components/Shared/PhishingShared.css";

export default function RecipientDetails() {
  const { id } = useParams();
  const { recipient, loading, error, reload } = useRecipients(id);

  if (loading) return <PhishingLoading message="Loading recipient..." />;

  return (
    <div className="phishing-soc-page">
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h5 className="text-white">{recipient?.fullName ?? recipient?.name}</h5>
          <p className="dashboard-desc">{recipient?.email}</p>
        </div>
        <div className="d-flex gap-2">
          <RoleGate allow={canManageRecipients}>
            <Link to={`/Phishing/Recipients/${id}/edit`} className="btn integration-btn">Edit</Link>
          </RoleGate>
          <Link to="/Phishing/Recipients" className="btn integration-btn">Back</Link>
        </div>
      </div>

      <PhishingAlert type="danger" message={error} onRetry={reload} />

      <div className="row g-3 mb-3">
        <div className="col-md-3 dashboard-card p-3"><p className="text-secondary mb-1">Department</p><h6 className="text-white">{recipient?.department || "—"}</h6></div>
        <div className="col-md-3 dashboard-card p-3"><p className="text-secondary mb-1">Job Title</p><h6 className="text-white">{recipient?.jobTitle || "—"}</h6></div>
        <div className="col-md-3 dashboard-card p-3"><p className="text-secondary mb-1">Manager</p><h6 className="text-white">{recipient?.manager || "—"}</h6></div>
        <div className="col-md-3 dashboard-card p-3"><p className="text-secondary mb-1">Risk Score</p><h6 className="text-white">{recipient?.riskScore ?? 0}</h6></div>
      </div>

      <div className="dashboard-card p-3 mb-3">
        <h6 className="text-white mb-3">Tracking Status</h6>
        <table className="w-100 discover-tabel">
          <thead><tr><th>Event</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td className="text-white">Email Sent</td><td>{recipient?.emailSent ? "Yes" : "No"}</td></tr>
            <tr><td className="text-white">Opened</td><td>{recipient?.opened ? "Yes" : "No"}</td></tr>
            <tr><td className="text-white">Clicked</td><td>{recipient?.clicked ? "Yes" : "No"}</td></tr>
            <tr><td className="text-white">Submitted</td><td className={recipient?.submitted ? "text-danger" : ""}>{recipient?.submitted ? "Yes" : "No"}</td></tr>
            <tr><td className="text-white">Tracking ID</td><td className="text-secondary">{recipient?.trackingId || "—"}</td></tr>
          </tbody>
        </table>
      </div>

      {recipient?.credentialCaptures?.length > 0 && (
        <div className="dashboard-card p-3">
          <h6 className="text-white mb-3">Credential Captures</h6>
          <table className="w-100 discover-tabel">
            <thead><tr><th>Username</th><th>Timestamp</th></tr></thead>
            <tbody>
              {recipient.credentialCaptures.map((c) => (
                <tr key={c.id}>
                  <td className="text-white">{c.username}</td>
                  <td className="text-secondary">{new Date(c.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {recipient?.submitted && (
        <div className="dashboard-card p-3 mt-3">
          <span className={`rounded-3 px-2 py-1 ${riskLevelClass("high")}`}>High risk — credential submitted during simulation</span>
        </div>
      )}
    </div>
  );
}
