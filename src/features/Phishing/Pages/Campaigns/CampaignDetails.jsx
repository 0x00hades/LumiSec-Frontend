import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import PhishingIntegrationActions from "../../Components/Shared/PhishingIntegrationActions";
import EventTimeline from "../../Components/Shared/EventTimeline";
import RoleGate from "../../Components/Shared/RoleGate";
import {
  canDeleteResources,
  canLaunchCampaigns,
  canManageCampaigns,
} from "../../utils/roles";
import useCampaigns from "../../hooks/useCampaigns";
import useTracking from "../../hooks/useTracking";
import { isCampaignPausable, isCampaignResumable, isCampaignRunning } from "../../utils/normalizers";
import "../../Components/Shared/PhishingShared.css";

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    campaign,
    loading,
    error,
    reload,
    pauseCampaign,
    resumeCampaign,
    stopCampaign,
    deleteCampaign,
  } = useCampaigns(id);
  const { events } = useTracking(id, true);

  const handleControl = async (fn) => {
    await fn(id);
    reload();
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this campaign?")) return;
    await deleteCampaign(id);
    navigate("/Phishing/Campaigns");
  };

  if (loading) return <PhishingLoading message="Loading campaign..." />;

  return (
    <div className="phishing-soc-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="text-white">{campaign?.name}</h5>
          <p className="dashboard-desc text-capitalize">Status: {String(campaign?.status).toLowerCase()}</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <RoleGate allow={canManageCampaigns}>
            <Link to={`/Phishing/Campaigns/${id}/edit`} className="btn integration-btn">Edit</Link>
          </RoleGate>
          <RoleGate allow={canLaunchCampaigns}>
            <Link to={`/Phishing/Campaigns/${id}/launch`} className="btn add-btn text-white border-0">Launch Console</Link>
          </RoleGate>
          <RoleGate allow={canLaunchCampaigns}>
            {isCampaignPausable(campaign) && (
              <button type="button" className="btn integration-btn" onClick={() => handleControl(pauseCampaign)}>Pause</button>
            )}
            {isCampaignResumable(campaign) && (
              <button type="button" className="btn integration-btn" onClick={() => handleControl(resumeCampaign)}>Resume</button>
            )}
            {(isCampaignRunning(campaign) || isCampaignResumable(campaign)) && (
              <button type="button" className="btn integration-btn" onClick={() => handleControl(stopCampaign)}>Stop</button>
            )}
          </RoleGate>
          <RoleGate allow={canDeleteResources}>
            <button type="button" className="btn integration-btn text-danger" onClick={handleDelete}>Delete</button>
          </RoleGate>
        </div>
      </div>

      <PhishingAlert type="danger" message={error} onRetry={reload} />

      <div className="row g-3 mb-3">
        <div className="col-md-3 dashboard-card p-3"><p className="text-secondary mb-1">Recipients</p><h4 className="text-white">{campaign?.recipientsCount}</h4></div>
        <div className="col-md-3 dashboard-card p-3"><p className="text-secondary mb-1">Opened</p><h4 className="text-white">{campaign?.opened}</h4></div>
        <div className="col-md-3 dashboard-card p-3"><p className="text-secondary mb-1">Clicked</p><h4 className="text-warning">{campaign?.clicked}</h4></div>
        <div className="col-md-3 dashboard-card p-3"><p className="text-secondary mb-1">Submitted</p><h4 className="text-danger">{campaign?.submitted}</h4></div>
      </div>

      {campaign?.attachments?.length > 0 && (
        <div className="dashboard-card p-3 mb-3">
          <h6 className="text-white mb-3">Attachments</h6>
          <table className="w-100 discover-tabel">
            <thead><tr><th>Filename</th><th>Type</th></tr></thead>
            <tbody>
              {campaign.attachments.map((a) => (
                <tr key={a.id}>
                  <td className="text-white">{a.filename}</td>
                  <td className="text-secondary">{a.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RoleGate allow={canManageCampaigns}>
        <div className="dashboard-card p-3 mb-3">
          <h6 className="text-white mb-2">Integrations</h6>
          <PhishingIntegrationActions campaign={campaign} />
        </div>
      </RoleGate>

      <div className="dashboard-card p-3">
        <h6 className="text-white mb-3">Live Tracking Events</h6>
        <EventTimeline events={events} live />
      </div>
    </div>
  );
}
