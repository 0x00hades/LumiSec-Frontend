import axios from "axios";
import { getToken, clearAuth } from "../features/auth/utils/authStorage";

/* =========================================================
   BASE CONFIG
========================================================= */

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://lumisec.tech";

const GRC_BASE = "/api/grc";

/* =========================================================
   ERROR CLASS
========================================================= */

export class GrcApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "GrcApiError";
    this.status = status ?? null;
    this.data = data ?? null;
  }

  get isRateLimit() {
    return this.status === 429;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isServerError() {
    return this.status != null && this.status >= 500;
  }
}

/* =========================================================
   AXIOS CLIENTS
========================================================= */

function attachAuth(config) {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

function handleError(error) {
  const status = error.response?.status ?? null;

  if (status === 401) {
    clearAuth();
    window.location.href = "/?session=expired";
    return Promise.reject(
      new GrcApiError("Session expired", { status })
    );
  }

  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "GRC API error";

  return Promise.reject(new GrcApiError(message, { status }));
}

/* =========================================================
   CLIENTS
========================================================= */

export const grcClient = axios.create({
  baseURL: `${API_BASE_URL}${GRC_BASE}`,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

export const grcStreamClient = axios.create({
  baseURL: `${API_BASE_URL}${GRC_BASE}`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

grcClient.interceptors.request.use(attachAuth);
grcClient.interceptors.response.use((r) => r, handleError);
grcStreamClient.interceptors.request.use(attachAuth);
grcStreamClient.interceptors.response.use((r) => r, handleError);

/* =========================================================
   RETRY HELPER
========================================================= */

async function withRetry(fn, { retries = 2, delayMs = 1000, label } = {}) {
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const status = err?.status || err?.response?.status;

      if (status === 401 || status === 429 || i === retries) break;

      console.warn(
        `[GRC] ${label || "request"} failed (attempt ${i + 1}/${retries + 1})`
      );

      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }

  throw lastError;
}

/* =========================================================
   FINDINGS
========================================================= */

export const getFindings = (params) =>
  grcClient.get("/findings", { params }).then((r) => r.data);

export const getFinding = (id) =>
  grcClient.get(`/findings/${id}`).then((r) => r.data);

export const createFinding = (payload) =>
  grcClient.post("/findings", payload).then((r) => r.data);

export const updateFinding = (id, payload) =>
  grcClient.patch(`/findings/${id}`, payload).then((r) => r.data);

export const assignFinding = (id, userId) =>
  grcClient.patch(`/findings/${id}/assign`, { userId }).then((r) => r.data);

export const closeFinding = (id) =>
  grcClient.patch(`/findings/${id}/close`).then((r) => r.data);

export const reopenFinding = (id) =>
  grcClient.patch(`/findings/${id}/reopen`).then((r) => r.data);

export const deleteFinding = (id) =>
  grcClient.delete(`/findings/${id}`).then((r) => r.data);

export const getFindingHistory = (id) =>
  grcClient.get(`/findings/${id}/history`).then((r) => r.data);

export const retestFinding = (id, payload) =>
  grcClient.post(`/findings/${id}/retest`, payload).then((r) => r.data);

/* =========================================================
   RISKS
========================================================= */

export const getRisks = (params) =>
  grcClient.get("/risks", { params }).then((r) => r.data);

export const getRisk = (id) =>
  grcClient.get(`/risks/${id}`).then((r) => r.data);

export const createRisk = (payload) =>
  grcClient.post("/risks", payload).then((r) => r.data);

export const updateRisk = (id, payload) =>
  grcClient.patch(`/risks/${id}`, payload).then((r) => r.data);

export const acceptRisk = (id) =>
  grcClient.patch(`/risks/${id}/accept`).then((r) => r.data);

export const mitigateRisk = (id) =>
  grcClient.patch(`/risks/${id}/mitigate`).then((r) => r.data);

export const closeRisk = (id) =>
  grcClient.patch(`/risks/${id}/close`).then((r) => r.data);

/* =========================================================
   TASKS
========================================================= */

export const getTasks = (params) =>
  grcClient.get("/tasks", { params }).then((r) => r.data);

export const getTask = (id) =>
  grcClient.get(`/tasks/${id}`).then((r) => r.data);

export const createTask = (payload) =>
  grcClient.post("/tasks", payload).then((r) => r.data);

export const updateTask = (id, payload) =>
  grcClient.patch(`/tasks/${id}`, payload).then((r) => r.data);

export const completeTask = (id) =>
  grcClient.patch(`/tasks/${id}/complete`).then((r) => r.data);

export const verifyTask = (id) =>
  grcClient.patch(`/tasks/${id}/verify`).then((r) => r.data);

/* =========================================================
   EVIDENCE (multipart)
========================================================= */

export const uploadEvidence = (formData) =>
  grcClient
    .post("/evidence", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const getEvidence = (id) =>
  grcClient.get(`/evidence/${id}`).then((r) => r.data);

export const deleteEvidence = (id) =>
  grcClient.delete(`/evidence/${id}`).then((r) => r.data);

/* =========================================================
   REPORTS
========================================================= */

export const createReport = (payload) =>
  grcClient.post("/reports", payload).then((r) => r.data);

export const getReports = (params) =>
  grcClient.get("/reports", { params }).then((r) => r.data);

export const getReport = (id) =>
  grcClient.get(`/reports/${id}`).then((r) => r.data);

export const updateReport = (id, payload) =>
  grcClient.patch(`/reports/${id}`, payload).then((r) => r.data);

export const deleteReport = (id) =>
  grcClient.delete(`/reports/${id}`).then((r) => r.data);

export const attachFindingsToReport = (id, payload) =>
  grcClient.post(`/reports/${id}/findings`, payload).then((r) => r.data);

export const generateReport = (id) =>
  grcClient.post(`/reports/${id}/generate`).then((r) => r.data);

export const downloadReport = (id) =>
  grcClient
    .get(`/reports/${id}/download`, { responseType: "blob" })
    .then((r) => r.data);

/* =========================================================
   COMPLIANCE
========================================================= */

export const getControls = (params) =>
  grcClient.get("/compliance/controls", { params }).then((r) => r.data);

export const getControl = (id) =>
  grcClient.get(`/compliance/controls/${id}`).then((r) => r.data);

export const createControl = (payload) =>
  grcClient.post("/compliance/controls", payload).then((r) => r.data);

export const updateControl = (id, payload) =>
  grcClient.patch(`/compliance/controls/${id}`, payload).then((r) => r.data);

export const linkFindingToControl = (id, payload) =>
  grcClient
    .post(`/compliance/controls/${id}/link-finding`, payload)
    .then((r) => r.data);

export const getComplianceStatus = () =>
  grcClient.get("/compliance/status").then((r) => r.data);

/* =========================================================
   DASHBOARD
========================================================= */

export const getDashboardOverview = () =>
  grcClient.get("/dashboard/overview").then((r) => r.data);

export const getDashboardRisks = () =>
  grcClient.get("/dashboard/risks").then((r) => r.data);

export const getDashboardCompliance = () =>
  grcClient.get("/dashboard/compliance").then((r) => r.data);

export const getDashboardTasks = () =>
  grcClient.get("/dashboard/tasks").then((r) => r.data);

export const getRiskHeatmap = () =>
  grcClient.get("/dashboard/risk-heatmap").then((r) => r.data);

/* =========================================================
   AUDIT LOGS
========================================================= */

export const getAuditLogs = () =>
  grcClient.get("/audit-logs").then((r) => r.data);

export const getEntityAuditLogs = (type, id) =>
  grcClient
    .get(`/audit-logs/${type}/${id}`)
    .then((r) => r.data);

/* =========================================================
   NOTIFICATIONS
========================================================= */

export const getNotifications = () =>
  grcClient.get("/notifications").then((r) => r.data);

export const markNotificationRead = (id) =>
  grcClient.patch(`/notifications/${id}/read`).then((r) => r.data);

/* =========================================================
   INTEGRATIONS
========================================================= */

export const ingestNetworkFinding = (payload) =>
  grcClient.post("/integrations/network/findings", payload).then((r) => r.data);

export const ingestPhishingRisk = (payload) =>
  grcClient.post("/integrations/phishing/risk", payload).then((r) => r.data);

export const ingestSiemAlert = (payload) =>
  grcClient.post("/integrations/siem/alerts", payload).then((r) => r.data);

export const ingestOpenCtiIoc = (payload) =>
  grcClient.post("/integrations/opencti/ioc", payload).then((r) => r.data);

export const ingestSoarIncident = (payload) =>
  grcClient.post("/integrations/soar/incidents", payload).then((r) => r.data);

export const ingestUctcFinding = (payload) =>
  grcClient.post("/integrations/uctc/findings", payload).then((r) => r.data);

export const updateSoarTask = (id, payload) =>
  grcClient
    .patch(`/integrations/soar/tasks/${id}`, payload)
    .then((r) => r.data);

/* =========================================================
   EXPORT DEFAULT
========================================================= */

export default grcClient;