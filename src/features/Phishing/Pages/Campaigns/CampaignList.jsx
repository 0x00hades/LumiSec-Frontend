import React from "react";
import { Link } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageCampaigns } from "../../utils/roles";
import useCampaigns from "../../hooks/useCampaigns";
import "../../Components/Shared/PhishingShared.css";

export default function CampaignList() {
  const { campaigns, loading, error, isMock, reload } = useCampaigns();

  if (loading) return <PhishingLoading message="Loading campaigns..." skeleton rows={5} />;

  return (
    <div className="phishing-soc-page">
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col col-lg-10">
          <h5 className="text-white">Campaigns</h5>
          <p className="dashboard-desc">{campaigns.length} total campaigns</p>
        </div>
        <RoleGate allow={canManageCampaigns}>
          <Link to="/Phishing/Campaigns/create" className="btn col me-3 add-btn w-fit-content text-white border-0">
            <i className="fa-solid fa-plus me-2" />New Campaign
          </Link>
        </RoleGate>
      </div>

      <PhishingAlert type="danger" message={error} isMock={isMock} onRetry={reload} />

      <div className="dashboard-card p-0 d-block overflow-x-auto ">
        <table className="w-100 discover-tabel overflow-hidden">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th className="text-center">Sent</th>
              <th className="text-center">Opened</th>
              <th className="text-center">Clicked</th>
              <th className="text-center">Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td className="text-white fw-medium p-2">{c.name}</td>
                <td><span className="badge text-capitalize">{c.status}</span></td>
                <td className="text-white text-center">{c.sent}</td>
                <td className="purple-number text-center">{c.opened}</td>
                <td className="orange-number text-center">{c.clicked}</td>
                <td className={c.submitted > 10 ? "text-danger fw-bold text-center" : ""}>{c.submitted}</td>
                <td>
                <div className="d-flex flex-column flex-md-row">
                  <Link to={`/Phishing/Campaigns/${c.id}`} className="btn btn-danger btn-sm integration-btn mb-2 mb-md-0 me-md-1">
                    Details
                  </Link>
                  
                  {c.status === "active" && (
                    <Link to={`/Phishing/Campaigns/${c.id}/launch`} className="btn btn-secondary btn-sm integration-btn">
                      Console
                    </Link>
                  )}
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
