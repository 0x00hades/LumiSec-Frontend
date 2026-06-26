import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageCampaigns } from "../../utils/roles";
import useCampaigns from "../../hooks/useCampaigns";
import useTemplates from "../../hooks/useTemplates";
import "../../Components/Shared/PhishingShared.css";

export default function CampaignEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaign, loading, error, updateCampaign } = useCampaigns(id);
  const { templates } = useTemplates();
  const [form, setForm] = useState({ name: "", description: "", templateId: "" });
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (campaign) {
      setForm({
        name: campaign.name ?? "",
        description: campaign.description ?? "",
        templateId: campaign.templateId ?? "",
      });
    }
  }, [campaign]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await updateCampaign(id, form);
      navigate(`/Phishing/Campaigns/${id}`);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PhishingLoading message="Loading campaign..." />;

  return (
    <RoleGate allow={canManageCampaigns} fallback={<p className="text-danger p-3">Access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">Edit Campaign</h5>
          <Link to={`/Phishing/Campaigns/${id}`} className="btn integration-btn">Back</Link>
        </div>
        <PhishingAlert type="danger" message={error || saveError} />
        <form onSubmit={handleSave} className="dashboard-card p-3">
          <div className="mb-3">
            <label className="text-secondary">Campaign Name</label>
            <input className="form-control header-search-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="text-secondary">Description</label>
            <textarea className="form-control header-search-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="text-secondary">Email Template</label>
            <select className="form-select scanType-select border-0" value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })} required>
              <option value="">Select template</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn add-btn text-white border-0" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
