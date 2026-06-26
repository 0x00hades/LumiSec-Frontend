import React, { useState } from "react";
import { Link } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import PhishingIntegrationActions from "../../Components/Shared/PhishingIntegrationActions";
import RoleGate from "../../Components/Shared/RoleGate";
import { canViewReports } from "../../utils/roles";
import useReports from "../../hooks/useReports";
import { getReportStats } from "../../services/phishingApi";
import { calcRate, formatNumber } from "../../utils/normalizers";
import "../../Components/Shared/PhishingShared.css";

export default function ReportViewer() {
  const { campaigns, loading, error, reload, generateReport, download } = useReports();
  const [selectedId, setSelectedId] = useState("");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [actionError, setActionError] = useState(null);

  const handleSelectCampaign = async (campaignId) => {
    setSelectedId(campaignId);
    if (!campaignId) {
      setStats(null);
      return;
    }
    setStatsLoading(true);
    setActionError(null);
    try {
      const data = await getReportStats(campaignId);
      setStats(data);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedId) return;
    setGenerating(true);
    setActionError(null);
    try {
      await generateReport(selectedId);
      await handleSelectCampaign(selectedId);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedId) return;
    setActionError(null);
    try {
      await download(selectedId);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const selectedCampaign = campaigns.find((c) => c.id === selectedId);

  if (loading) return <PhishingLoading message="Loading campaigns..." />;

  return (
    <RoleGate allow={canViewReports} fallback={<p className="text-danger p-3">Report access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h5 className="text-white">Campaign Reports</h5>
            <p className="dashboard-desc">Per-campaign statistics, PDF generation & download</p>
          </div>
        </div>
        <PhishingAlert type="danger" message={error || actionError} onRetry={reload} />

        <div className="dashboard-card p-3 mb-3">
          <label className="text-secondary mb-2 d-block">Select Campaign</label>
          <select
            className="form-select scanType-select border-0"
            value={selectedId}
            onChange={(e) => handleSelectCampaign(e.target.value)}
          >
            <option value="">Choose a campaign...</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({String(c.status).toLowerCase()})</option>
            ))}
          </select>
        </div>

        {statsLoading && <PhishingLoading message="Loading campaign statistics..." />}

        {stats && !statsLoading && (
          <>
            <div className="d-flex gap-2 mb-3">
              <button type="button" className="btn add-btn text-white border-0" disabled={generating} onClick={handleGenerate}>
                {generating ? "Generating..." : "Generate Report"}
              </button>
              <button type="button" className="btn integration-btn" onClick={handleDownload}>Download PDF</button>
              <Link to={`/Phishing/Reports/download/${selectedId}`} className="btn integration-btn">Download Page</Link>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-3 dashboard-card p-3"><p className="text-secondary">Emails Sent</p><h4 className="text-white">{formatNumber(stats.emailsSent)}</h4></div>
              <div className="col-md-3 dashboard-card p-3"><p className="text-secondary">Opened</p><h4 className="text-white">{formatNumber(stats.opened)}</h4></div>
              <div className="col-md-3 dashboard-card p-3"><p className="text-secondary">Clicked</p><h4 className="text-warning">{formatNumber(stats.clicked)}</h4></div>
              <div className="col-md-3 dashboard-card p-3"><p className="text-secondary">Submitted</p><h4 className="text-danger">{formatNumber(stats.submitted)}</h4></div>
            </div>

            <div className="dashboard-card p-3 mb-3">
              <h6 className="text-white mb-3">Conversion Rates</h6>
              <table className="w-100 discover-tabel">
                <thead><tr><th>Metric</th><th>Rate</th></tr></thead>
                <tbody>
                  <tr><td className="text-white">Open Rate</td><td>{calcRate(stats.opened, stats.emailsSent)}%</td></tr>
                  <tr><td className="text-white">Click Rate</td><td>{calcRate(stats.clicked, stats.emailsSent)}%</td></tr>
                  <tr><td className="text-white">Submit Rate</td><td className={calcRate(stats.submitted, stats.emailsSent) > 15 ? "text-danger" : "text-success"}>{calcRate(stats.submitted, stats.emailsSent)}%</td></tr>
                </tbody>
              </table>
            </div>

            {selectedCampaign && (
              <div className="dashboard-card p-3">
                <h6 className="text-white mb-2">Push Results to Integrations</h6>
                <PhishingIntegrationActions campaign={selectedCampaign} />
              </div>
            )}
          </>
        )}
      </div>
    </RoleGate>
  );
}
