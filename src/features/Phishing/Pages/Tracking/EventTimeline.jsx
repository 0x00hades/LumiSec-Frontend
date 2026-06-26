import React from "react";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import EventTimeline from "../../Components/Shared/EventTimeline";
import RoleGate from "../../Components/Shared/RoleGate";
import { canViewTracking } from "../../utils/roles";
import useTracking from "../../hooks/useTracking";
import "../../Components/Shared/PhishingShared.css";

export default function EventTimelinePage() {
  const { events, loading, error, reload } = useTracking(null, true, "timeline");

  return (
    <RoleGate allow={canViewTracking} fallback={<p className="text-danger p-3">Tracking access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="text-white">Phishing Activity Timeline</h5>
            <p className="dashboard-desc">Live SIEM event stream — opens, clicks, visits, submits</p>
          </div>
          <span className="badge" style={{ background: "#10B981" }}>POLLING 2s</span>
        </div>
        <PhishingAlert type="danger" message={error} onRetry={reload} />
        {loading && !events.length ? (
          <PhishingLoading message="Connecting to event stream..." />
        ) : (
          <EventTimeline events={events} live />
        )}
      </div>
    </RoleGate>
  );
}
