import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageRecipients } from "../../utils/roles";
import useRecipients from "../../hooks/useRecipients";
import "../../Components/Shared/PhishingShared.css";

export default function RecipientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipient, loading, error, updateRecipient } = useRecipients(id);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    department: "",
    jobTitle: "",
    manager: "",
    status: "",
  });
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (recipient) {
      setForm({
        fullName: recipient.fullName ?? recipient.name ?? "",
        email: recipient.email ?? "",
        department: recipient.department ?? "",
        jobTitle: recipient.jobTitle ?? "",
        manager: recipient.manager ?? "",
        status: recipient.status ?? "",
      });
    }
  }, [recipient]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await updateRecipient(id, form);
      navigate(`/Phishing/Recipients/${id}`);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PhishingLoading message="Loading recipient..." />;

  return (
    <RoleGate allow={canManageRecipients} fallback={<p className="text-danger p-3">Access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">Edit Recipient</h5>
          <Link to={`/Phishing/Recipients/${id}`} className="btn integration-btn">Back</Link>
        </div>
        <PhishingAlert type="danger" message={error || saveError} />
        <form onSubmit={handleSave} className="dashboard-card p-3">
          <div className="mb-3">
            <label className="text-secondary">Full Name</label>
            <input className="form-control header-search-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="text-secondary">Email</label>
            <input type="email" className="form-control header-search-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="text-secondary">Department</label>
            <input className="form-control header-search-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="text-secondary">Job Title</label>
            <input className="form-control header-search-input" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="text-secondary">Manager</label>
            <input className="form-control header-search-input" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
          </div>
          <button type="submit" className="btn add-btn text-white border-0" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
