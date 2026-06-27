import axios from "axios";
import { getToken, clearAuth } from "../features/auth/utils/authStorage";

/* =========================================================
   BASE CONFIG
========================================================= */

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://lumisec.tech";

const PHISHING_BASE = "/api/phishing";

/* =========================================================
   ERROR CLASS
========================================================= */

export class PhishingApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "PhishingApiError";
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
    window.location.href = "/login?session=expired";
    return Promise.reject(
      new PhishingApiError("Session expired", { status })
    );
  }

  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Phishing API error";

  return Promise.reject(new PhishingApiError(message, { status }));
}

const phishingClient = axios.create({
  baseURL: `${API_BASE_URL}${PHISHING_BASE}`,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

const phishingPublicClient = axios.create({
  baseURL: `${API_BASE_URL}${PHISHING_BASE}`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

phishingClient.interceptors.request.use(attachAuth);
phishingClient.interceptors.response.use((r) => r, handleError);
phishingPublicClient.interceptors.response.use((r) => r, handleError);

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
        `[Phishing] ${label || "request"} failed (attempt ${i + 1})`
      );

      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }

  throw lastError;
}

/* =========================================================
   TEMPLATES
========================================================= */

export const getTemplates = () =>
  phishingClient.get("/templates").then((r) => r.data);

export const getTemplate = (id) =>
  phishingClient.get(`/templates/${id}`).then((r) => r.data);

export const createTemplate = (payload) =>
  phishingClient.post("/templates", payload).then((r) => r.data);

export const updateTemplate = (id, payload) =>
  phishingClient.patch(`/templates/${id}`, payload).then((r) => r.data);

export const deleteTemplate = (id) =>
  phishingClient.delete(`/templates/${id}`).then((r) => r.data);

/* =========================================================
   LANDING PAGES
========================================================= */

export const getLandingPages = () =>
  phishingClient.get("/landing-pages").then((r) => r.data);

export const createLandingPage = (payload) =>
  phishingClient.post("/landing-pages", payload).then((r) => r.data);

export const updateLandingPage = (id, payload) =>
  phishingClient.patch(`/landing-pages/${id}`, payload).then((r) => r.data);

/* =========================================================
   RECIPIENTS
========================================================= */

export const importRecipients = (payload) =>
  phishingClient.post("/recipients/import", payload).then((r) => r.data);

export const getRecipients = (params) =>
  phishingClient.get("/recipients", { params }).then((r) => r.data);

/* =========================================================
   CAMPAIGNS
========================================================= */

export const createCampaign = (payload) =>
  phishingClient.post("/campaigns", payload).then((r) => r.data);

export const getCampaigns = (params) =>
  phishingClient.get("/campaigns", { params }).then((r) => r.data);

export const getCampaign = (id) =>
  phishingClient.get(`/campaigns/${id}`).then((r) => r.data);

export const launchCampaign = (id) =>
  phishingClient.post(`/campaigns/${id}/launch`).then((r) => r.data);

export const pauseCampaign = (id) =>
  phishingClient.post(`/campaigns/${id}/pause`).then((r) => r.data);

export const resumeCampaign = (id) =>
  phishingClient.post(`/campaigns/${id}/resume`).then((r) => r.data);

export const stopCampaign = (id) =>
  phishingClient.post(`/campaigns/${id}/stop`).then((r) => r.data);

export const attachRecipients = (id, payload) =>
  phishingClient
    .post(`/campaigns/${id}/recipients`, payload)
    .then((r) => r.data);

/* =========================================================
   TRACKING (PUBLIC - NO JWT)
========================================================= */

export const trackOpen = (trackingId) =>
  phishingPublicClient.get(`/track/open/${trackingId}`);

export const trackClick = (trackingId) =>
  phishingPublicClient.get(`/track/click/${trackingId}`);

export const trackVisit = (trackingId, payload) =>
  phishingPublicClient.post(`/track/visit/${trackingId}`, payload);

export const trackSubmit = (trackingId, payload) =>
  phishingPublicClient.post(`/track/submit/${trackingId}`, payload);

export const trackDownload = (trackingId) =>
  phishingPublicClient.post(`/track/download/${trackingId}`);

/* =========================================================
   DASHBOARD
========================================================= */

export const getDashboardOverview = () =>
  phishingClient.get("/dashboard/overview").then((r) => r.data);

export const getDashboardRisks = () =>
  phishingClient.get("/dashboard/risks").then((r) => r.data);

export const getDashboardDepartments = () =>
  phishingClient.get("/dashboard/departments").then((r) => r.data);

export const getDashboardTrends = () =>
  phishingClient.get("/dashboard/trends").then((r) => r.data);

/* =========================================================
   REPORTS
========================================================= */

export const generateReport = (campaignId) =>
  phishingClient
    .post(`/reports/${campaignId}/generate`)
    .then((r) => r.data);

export const downloadReport = (campaignId) =>
  phishingClient
    .get(`/reports/${campaignId}/download`)
    .then((r) => r.data);

export const getReportStats = (campaignId) =>
  phishingClient
    .get(`/reports/${campaignId}/stats`)
    .then((r) => r.data);

/* =========================================================
   INTEGRATIONS
========================================================= */

export const sendToGrc = (payload) =>
  phishingClient.post("/integrations/grc/risk", payload);

export const sendToSoar = (payload) =>
  phishingClient.post("/integrations/soar/incident", payload);

export const sendToSiem = (payload) =>
  phishingClient.post("/integrations/siem/event", payload);

export const sendToOpenCti = (payload) =>
  phishingClient.post("/integrations/opencti/indicator", payload);

/* =========================================================
   EXPORT DEFAULT
========================================================= */

export default phishingClient;