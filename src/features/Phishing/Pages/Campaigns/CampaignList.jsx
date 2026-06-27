import React from "react";
import { Link } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canDeleteResources, canManageCampaigns, canLaunchCampaigns } from "../../utils/roles";
import useCampaigns from "../../hooks/useCampaigns";
import { isCampaignRunning } from "../../utils/normalizers";
import "../../Components/Shared/PhishingShared.css";

export default function CampaignList() {
  const { campaigns, loading, error, reload, deleteCampaign } = useCampaigns();
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await deleteCampaign(id);
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PhishingLoading message="Loading campaigns..." skeleton rows={5} />;

  return (
    <div className="phishing-soc-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="text-white">Campaigns</h5>
          <p className="dashboard-desc">{campaigns.length} total campaigns</p>
        </div>
        <RoleGate allow={canManageCampaigns}>
          <Link to="/Phishing/Campaigns/create" className="btn add-btn text-white border-0">
            <i className="fa-solid fa-plus me-2" />New Campaign
          </Link>
        </RoleGate>
      </div>

      <PhishingAlert type="danger" message={error} onRetry={reload} />

      <div className="dashboard-card p-0">
        <table className="w-100 discover-tabel">
          <thead>
            <tr>
              <th className='p-3 '>Name</th>
              <th>Status</th>
              <th>Sent</th>
              <th>Opened</th>
              <th>Clicked</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td className="text-white fw-medium">{c.name}</td>
                <td><span className="badge text-capitalize">{String(c.status).toLowerCase()}</span></td>
                <td>{c.sent}</td>
                <td>{c.opened}</td>
                <td>{c.clicked}</td>
                <td className={c.submitted > 10 ? "text-danger fw-bold" : ""}>{c.submitted}</td>
                <td>
                  <Link to={`/Phishing/Campaigns/${c.id}`} className="btn btn-sm integration-btn me-1">Details</Link>
                  <RoleGate allow={canManageCampaigns}>
                    <Link to={`/Phishing/Campaigns/${c.id}/edit`} className="btn btn-sm integration-btn me-1">Edit</Link>
                  </RoleGate>
                  <RoleGate allow={canLaunchCampaigns}>
                    {(isCampaignRunning(c) || String(c.status).toUpperCase() === "PAUSED") && (
                      <Link to={`/Phishing/Campaigns/${c.id}/launch`} className="btn btn-sm integration-btn me-1">Console</Link>
                    )}
                  </RoleGate>
                  <RoleGate allow={canDeleteResources}>
                    <button type="button" className="btn btn-sm integration-btn text-danger" onClick={() => handleDelete(c.id)}>Delete</button>
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
