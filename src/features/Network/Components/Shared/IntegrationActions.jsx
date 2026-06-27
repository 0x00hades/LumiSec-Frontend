import React, { useState } from "react";
import { useToast } from "../../../../components/toast/ToastContext";
import {
  DEFAULT_ERROR,
  extractApiMessage,
  resolveResponseToastType,
} from "../../../../components/toast/toastMessages";
import {
  buildIntegrationPayload,
  sendToGrc,
  sendToOpenCti,
  sendToSiem,
  sendToSoar,
  sendToUctc,
} from "../../services/networkApi";
import "./NetworkShared.css";

const ACTIONS = [
  { key: "grc", label: "Send to GRC", icon: "fa-clipboard-check", className: "integration-btn-grc", fn: sendToGrc },
  { key: "soar", label: "Create Incident", icon: "fa-triangle-exclamation", className: "integration-btn-soar", fn: sendToSoar },
  { key: "siem", label: "Send to SIEM", icon: "fa-server", className: "integration-btn-siem", fn: sendToSiem },
  { key: "opencti", label: "Enrich IOC", icon: "fa-magnifying-glass", className: "integration-btn-cti", fn: sendToOpenCti },
  { key: "uctc", label: "UCTC Gap", icon: "fa-shield-halved", className: "integration-btn-cti", fn: sendToUctc },
];

const TOAST_HANDLERS = {
  success: (toast, message) => toast.success(message),
  error: (toast, message) => toast.error(message),
  warning: (toast, message) => toast.warning(message),
  info: (toast, message) => toast.info(message),
};

function showToast(toast, type, message) {
  const handler = TOAST_HANDLERS[type] ?? toast.info;
  handler(toast, message);
}

export default function IntegrationActions({ item, source = "network", compact = false, onSuccess }) {
  const toast = useToast();
  const [loadingKey, setLoadingKey] = useState(null);

  const handleAction = async (action) => {
    setLoadingKey(action.key);
    try {
      const payloads = buildIntegrationPayload(source, item);
      const result = await action.fn(payloads[action.key]);
      const message = extractApiMessage(
        result,
        `${action.label} completed successfully.`
      );
      const type = resolveResponseToastType(result);
      showToast(toast, type, message);
      onSuccess?.(action.key, item, result);
    } catch (err) {
      const message = extractApiMessage(
        err.response?.data ?? err.data ?? err,
        err.message || DEFAULT_ERROR
      );
      showToast(toast, "error", message);
    } finally {
      setLoadingKey(null);
    }
  };

  const visibleActions = compact
    ? ACTIONS.filter((a) => ["grc", "soar", "siem", "opencti"].includes(a.key))
    : ACTIONS;

  return (
    <div>
      <div className="integration-action col">
        {visibleActions.map((action) => (
          <button
            key={action.key}
            type="button"
            className={`btn integration-btn ${action.className}`}
            disabled={loadingKey !== null}
            onClick={() => handleAction(action)}
          >
            {loadingKey === action.key ? (
              <i className="fa-solid fa-spinner fa-spin me-1" />
            ) : (
              <i className={`fa-solid text-white ${action.icon} me-1`} />
            )}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
