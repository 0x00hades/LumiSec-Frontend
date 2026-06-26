import React, { useEffect, useRef } from "react";
import { EVENT_TYPE_LABELS } from "../../utils/normalizers";
import "./PhishingShared.css";

const TYPE_LABELS = {
  email_sent: "Email Sent",
  open: "Email Opened",
  click: "Link Clicked",
  visit: "Landing Page Visit",
  submit: "Credential Submission",
  download: "Attachment Download",
  qr_scanned: "QR Scanned",
};

function eventClass(event) {
  if (event.severity === "critical" || event.type === "submit") return "siem-event-critical";
  if (event.severity === "warning" || event.type === "click" || event.type === "visit") return "siem-event-warning";
  return "siem-event-info";
}

function labelForEvent(event) {
  if (event.eventType && EVENT_TYPE_LABELS[event.eventType]) {
    return EVENT_TYPE_LABELS[event.eventType];
  }
  return TYPE_LABELS[event.type] ?? event.type;
}

export default function EventTimeline({ events = [], live = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && live) {
      ref.current.scrollTop = 0;
    }
  }, [events, live]);

  return (
    <div className="siem-event-stream" ref={ref}>
      {live && (
        <div className="p-2 border-bottom border-secondary">
          <span className="badge" style={{ background: "#10B981" }}>
            <i className="fa-solid fa-circle me-1" style={{ fontSize: 8 }} />
            LIVE
          </span>
          <span className="text-secondary ms-2">Phishing activity stream</span>
        </div>
      )}
      {!events.length && (
        <div className="p-3 text-secondary">No tracking events yet.</div>
      )}
      {events.map((ev) => (
        <div key={ev.id} className={`siem-event-row ${eventClass(ev)}`}>
          <span className="siem-event-time">
            {new Date(ev.timestamp).toLocaleTimeString()}
          </span>
          <span className={`siem-event-type siem-event-type-${ev.type}`}>
            {labelForEvent(ev)}
          </span>
          <span className="text-white flex-grow-1">
            {ev.email}
            {ev.campaignId && (
              <span className="text-secondary ms-2">campaign:{ev.campaignId}</span>
            )}
          </span>
          {ev.type === "submit" && (
            <span className="badge bg-danger">ALERT</span>
          )}
        </div>
      ))}
    </div>
  );
}
