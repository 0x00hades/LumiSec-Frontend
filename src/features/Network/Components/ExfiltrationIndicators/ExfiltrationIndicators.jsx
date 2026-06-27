import React from "react";
import "./ExfiltrationIndicators.css";

export default function ExfiltrationIndicators({ indicators = [] }) {
  return (
    <div className="dashboard-card">
      <div className="row justify-content-between align-items-center p-2">
      <div className="col-12 d-flex align-items-center mb-3 mx-0 p-0">
        <i className="fa-solid fa-arrow-up-right-from-square me-2" style={{ color: "#F97316" }} />
        <h6 className="text-white m-0">Data Exfiltration Indicators</h6>
      </div>

      {!indicators.length && (
        <p className="text-secondary">No exfiltration indicators in current traffic window.</p>
      )}

      {indicators.map((item) => (
        <div key={item.id} className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <p className="text-white mb-0">{item.label}</p>
            <span className={item.score >= 80 ? "spike-highlight" : "text-secondary"}>{item.score}%</span>
          </div>
          <p className="text-secondary mb-2">Host: {item.host}</p>
          <div className="progress" style={{ height: "6px", backgroundColor: "#2A3042" }}>
            <div
              className="progress-bar"
              style={{
                width: `${item.score}%`,
                background: item.score >= 80
                  ? "linear-gradient(90deg, #EF4444, #F59E0B)"
                  : "linear-gradient(90deg, #7F56D9, #539BFF)",
              }}
            />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
