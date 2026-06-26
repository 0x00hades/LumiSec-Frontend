import React, { useEffect } from "react";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import EventTimeline from "../../Components/Shared/EventTimeline";
import RoleGate from "../../Components/Shared/RoleGate";
import { canViewTracking } from "../../utils/roles";
import useTracking from "../../hooks/useTracking";
import "../../Components/Shared/PhishingShared.css";

export default function TrackingLogs() {
  const { events, loading, error, loadLogs } = useTracking(null, false, "logs");

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <RoleGate allow={canViewTracking} fallback={<p className="text-danger p-3">Tracking access denied.</p>}>
      <div className="phishing-soc-page">
        <h5 className="text-white">Tracking Logs</h5>
        <p className="dashboard-desc">Phishing event log derived from recipient tracking state</p>
        <PhishingAlert type="danger" message={error} onRetry={loadLogs} />
        {loading ? <PhishingLoading message="Loading logs..." /> : <EventTimeline events={events} />}
      </div>
    </RoleGate>
  );
}
