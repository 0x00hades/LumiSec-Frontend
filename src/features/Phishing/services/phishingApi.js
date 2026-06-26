import phishingClient, { phishingTrackClient } from "./apiClient";
import {
  buildEventsFromRecipients,
  normalizeCampaign,
  normalizeCampaignReport,
  normalizeDepartment,
  normalizeLandingPage,
  normalizeList,
  normalizeOverview,
  normalizePhishingRisk,
  normalizeRecipient,
  normalizeReportStats,
  normalizeTemplate,
  normalizeTrends,
} from "../utils/normalizers";

function unwrapData(response) {
  const body = response?.data;
  if (body == null) return null;
  if (typeof body === "object" && Object.prototype.hasOwnProperty.call(body, "data")) {
    return body.data;
  }
  return body;
}

function unwrapEntity(response, normalizer) {
  const data = unwrapData(response);
  if (!data) return null;
  if (data.template) return normalizer(data.template);
  if (data.page) return normalizer(data.page);
  if (data.campaign) return normalizer(data.campaign);
  if (data.recipient) return normalizer(data.recipient);
  return normalizer(data);
}

export function toTemplatePayload(form = {}) {
  return {
    name: form.name,
    subject: form.subject,
    htmlBody: form.htmlBody ?? form.body ?? "",
    textBody: form.textBody ?? "",
    category: form.category ?? "general",
    language: form.language ?? "en",
  };
}

export function toLandingPagePayload(form = {}) {
  return {
    name: form.name,
    title: form.title ?? form.name,
    htmlContent: form.htmlContent ?? form.html ?? "",
    redirectUrl: form.redirectUrl ?? form.url ?? "",
  };
}

export function toCampaignPayload(form = {}) {
  const payload = {
    name: form.name,
    templateId: form.templateId,
  };
  if (form.description) payload.description = form.description;
  return payload;
}

export function toCampaignRecipientPayload(recipient = {}) {
  return {
    fullName: recipient.fullName ?? recipient.name ?? "",
    email: recipient.email,
    department: recipient.department ?? "",
    jobTitle: recipient.jobTitle ?? "",
    manager: recipient.manager ?? "",
  };
}

export function toCampaignRecipientsPayload(recipients = []) {
  return {
    recipients: recipients.map(toCampaignRecipientPayload),
  };
}

export function toRecipientPayload(form = {}) {
  return {
    fullName: form.fullName ?? form.name,
    email: form.email,
    department: form.department,
    jobTitle: form.jobTitle ?? "",
    manager: form.manager ?? "",
    status: form.status,
  };
}

// ─── DASHBOARD ───────────────────────────────────────────────────

export async function getDashboardOverview() {
  const res = await phishingClient.get("/dashboard/overview");
  return normalizeOverview(unwrapData(res) ?? {});
}

export async function getDashboardRisks() {
  const res = await phishingClient.get("/dashboard/risks");
  const data = unwrapData(res);
  return normalizeList(data).map(normalizePhishingRisk);
}

export async function getDashboardDepartments() {
  const res = await phishingClient.get("/dashboard/departments");
  const data = unwrapData(res);
  return normalizeList(data).map(normalizeDepartment);
}

export async function getDashboardTrends() {
  const res = await phishingClient.get("/dashboard/trends");
  return normalizeTrends(unwrapData(res) ?? {});
}

// ─── TEMPLATES ───────────────────────────────────────────────────

export async function listTemplates() {
  const res = await phishingClient.get("/templates");
  return normalizeList(unwrapData(res)).map(normalizeTemplate);
}

export async function getTemplate(id) {
  const res = await phishingClient.get(`/templates/${id}`);
  return unwrapEntity(res, normalizeTemplate);
}

export async function createTemplate(payload) {
  const res = await phishingClient.post("/templates", toTemplatePayload(payload));
  return unwrapEntity(res, normalizeTemplate);
}

export async function updateTemplate(id, payload) {
  const res = await phishingClient.patch(`/templates/${id}`, toTemplatePayload(payload));
  return unwrapEntity(res, normalizeTemplate);
}

export async function deleteTemplate(id) {
  await phishingClient.delete(`/templates/${id}`);
}

// ─── LANDING PAGES ───────────────────────────────────────────────

export async function listLandingPages() {
  const res = await phishingClient.get("/landing-pages");
  return normalizeList(unwrapData(res)).map(normalizeLandingPage);
}

export async function getLandingPage(id) {
  const res = await phishingClient.get(`/landing-pages/${id}`);
  return unwrapEntity(res, normalizeLandingPage);
}

export async function createLandingPage(payload) {
  const res = await phishingClient.post("/landing-pages", toLandingPagePayload(payload));
  return unwrapEntity(res, normalizeLandingPage);
}

export async function updateLandingPage(id, payload) {
  const res = await phishingClient.patch(`/landing-pages/${id}`, toLandingPagePayload(payload));
  return unwrapEntity(res, normalizeLandingPage);
}

export async function deleteLandingPage(id) {
  await phishingClient.delete(`/landing-pages/${id}`);
}

// ─── RECIPIENTS ──────────────────────────────────────────────────

export async function listRecipients(params = {}) {
  const res = await phishingClient.get("/recipients", { params });
  return normalizeList(unwrapData(res)).map(normalizeRecipient);
}

export async function getRecipient(id) {
  const res = await phishingClient.get(`/recipients/${id}`);
  return unwrapEntity(res, normalizeRecipient);
}

export async function updateRecipient(id, payload) {
  const res = await phishingClient.patch(`/recipients/${id}`, toRecipientPayload(payload));
  return unwrapEntity(res, normalizeRecipient);
}

export async function deleteRecipient(id) {
  await phishingClient.delete(`/recipients/${id}`);
}

export async function importRecipientsCsv(file, campaignId) {
  const csv = await file.text();
  const payload = { csv };
  if (campaignId) payload.campaignId = campaignId;
  const res = await phishingClient.post("/recipients/import", payload);
  return unwrapData(res);
}

// ─── CAMPAIGNS ───────────────────────────────────────────────────

export async function listCampaigns() {
  const res = await phishingClient.get("/campaigns");
  return normalizeList(unwrapData(res)).map(normalizeCampaign);
}

export async function getCampaign(id) {
  const res = await phishingClient.get(`/campaigns/${id}`);
  return unwrapEntity(res, normalizeCampaign);
}

export async function createCampaign(payload) {
  const res = await phishingClient.post("/campaigns", toCampaignPayload(payload));
  return unwrapEntity(res, normalizeCampaign);
}

export async function updateCampaign(id, payload) {
  const res = await phishingClient.patch(`/campaigns/${id}`, toCampaignPayload(payload));
  return unwrapEntity(res, normalizeCampaign);
}

export async function deleteCampaign(id) {
  await phishingClient.delete(`/campaigns/${id}`);
}

export async function attachCampaignRecipients(campaignId, recipients) {
  const payload = Array.isArray(recipients)
    ? toCampaignRecipientsPayload(recipients)
    : { recipients: [] };
  const res = await phishingClient.post(`/campaigns/${campaignId}/recipients`, payload);
  const data = unwrapData(res);
  const list = normalizeList(data?.recipients ?? data).map(normalizeRecipient);
  return { ...data, recipients: list };
}

export async function launchCampaign(id) {
  const res = await phishingClient.post(`/campaigns/${id}/launch`);
  return unwrapEntity(res, normalizeCampaign);
}

export async function pauseCampaign(id) {
  const res = await phishingClient.post(`/campaigns/${id}/pause`);
  return unwrapEntity(res, normalizeCampaign);
}

export async function resumeCampaign(id) {
  const res = await phishingClient.post(`/campaigns/${id}/resume`);
  return unwrapEntity(res, normalizeCampaign);
}

export async function stopCampaign(id) {
  const res = await phishingClient.post(`/campaigns/${id}/stop`);
  return unwrapEntity(res, normalizeCampaign);
}

// ─── TRACKING (derived from recipients — no admin list endpoint in spec) ──

export async function getTrackingEvents(params = {}) {
  const recipients = await listRecipients(params.campaignId ? { campaignId: params.campaignId } : {});
  return buildEventsFromRecipients(recipients, params.campaignId);
}

export async function getTrackingLogs(params = {}) {
  return getTrackingEvents(params);
}

export async function getTrackingTimeline(params = {}) {
  return getTrackingEvents(params);
}

// ─── TRACKING (public — no JWT) ──────────────────────────────────

export const trackOpen = (trackingId) => phishingTrackClient.get(`/track/open/${trackingId}`);
export const trackClick = (trackingId) => phishingTrackClient.get(`/track/click/${trackingId}`);
export const trackVisit = (trackingId) => phishingTrackClient.post(`/track/visit/${trackingId}`);
export const trackSubmit = (trackingId, payload) =>
  phishingTrackClient.post(`/track/submit/${trackingId}`, payload);
export const trackDownload = (trackingId) =>
  phishingTrackClient.post(`/track/download/${trackingId}`);

// ─── REPORTS ─────────────────────────────────────────────────────

export async function getReportStats(campaignId) {
  const res = await phishingClient.get(`/reports/${campaignId}/stats`);
  return normalizeReportStats(unwrapData(res) ?? {});
}

export async function generateReport(campaignId) {
  const res = await phishingClient.post(`/reports/${campaignId}/generate`);
  const data = unwrapData(res);
  if (data?.report) return normalizeCampaignReport(data.report);
  return normalizeCampaignReport(data ?? { campaignId });
}

export async function downloadReport(campaignId) {
  return phishingClient.get(`/reports/${campaignId}/download`, { responseType: "blob" });
}

export function saveReportBlob(campaignId, blobData) {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `phishing-report-${campaignId}.pdf`;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

// ─── INTEGRATIONS ────────────────────────────────────────────────

export async function pushToGrc(payload) {
  const res = await phishingClient.post("/integrations/grc/risk", payload);
  return unwrapData(res);
}

export async function pushToSoar(payload) {
  const res = await phishingClient.post("/integrations/soar/incident", payload);
  return unwrapData(res);
}

export async function pushToSiem(payload) {
  const res = await phishingClient.post("/integrations/siem/event", payload);
  return unwrapData(res);
}

export async function pushToOpenCti(payload) {
  const res = await phishingClient.post("/integrations/opencti/indicator", payload);
  return unwrapData(res);
}

export function buildIntegrationPayload(campaign, type = "campaign") {
  const campaignId = campaign?.id ?? campaign?.campaignId;
  const base = {
    source: "phishing",
    type,
    campaignId,
    campaignName: campaign?.name,
    timestamp: new Date().toISOString(),
    metrics: {
      sent: campaign?.sentCount ?? campaign?.sent ?? 0,
      opened: campaign?.openedCount ?? campaign?.opened ?? 0,
      clicked: campaign?.clickedCount ?? campaign?.clicked ?? 0,
      submitted: campaign?.submittedCount ?? campaign?.submitted ?? 0,
    },
  };

  return {
    grc: {
      ...base,
      recipientId: campaign?.recipientId,
      riskLevel: campaign?.riskLevel ?? "medium",
      reason: campaign?.reason ?? `Phishing simulation event for campaign: ${campaign?.name}`,
    },
    soar: {
      ...base,
      title: `[Phishing] ${campaign?.name ?? "Simulation"}`,
      severity: (campaign?.submittedCount ?? campaign?.submitted ?? 0) > 10 ? "high" : "medium",
    },
    siem: {
      ...base,
      eventType: "phishing_simulation",
      message: `Campaign ${campaign?.name ?? campaignId} activity`,
    },
    opencti: {
      ...base,
      iocType: "campaign",
      value: campaignId,
      labels: ["phishing", "simulation"],
    },
  };
}
