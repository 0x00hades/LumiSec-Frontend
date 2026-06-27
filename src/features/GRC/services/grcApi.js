import {
  assignFinding,
  attachFindingsToReport,
  closeFinding,
  createControl,
  createFinding,
  createReport,
  createRisk,
  createTask,
  deleteEvidence,
  deleteFinding,
  deleteReport,
  downloadReport,
  generateReport,
  getAuditLogs,
  getComplianceStatus,
  getControl,
  getControls,
  getDashboardCompliance,
  getDashboardOverview,
  getDashboardRisks,
  getDashboardTasks,
  getEntityAuditLogs,
  getEvidence,
  getFinding,
  getFindingHistory,
  getFindings,
  getNotifications,
  getReport,
  getReports,
  getRisk,
  getRiskHeatmap,
  getRisks,
  getTask,
  getTasks,
  linkFindingToControl,
  markNotificationRead,
  reopenFinding,
  retestFinding,
  updateControl,
  updateFinding,
  updateReport,
  updateRisk,
  updateTask,
  uploadEvidence,
} from "../../../services/grc.api";
import {
  buildBarChartData,
  buildPieChartData,
  normalizeAuditLog,
  normalizeControl,
  normalizeDashboardOverview,
  normalizeFinding,
  normalizeFrameworkCard,
  normalizeNotification,
  normalizeReport,
  normalizeRisk,
  normalizeTask,
  triggerBlobDownload,
  unwrapEntity,
  unwrapList,
} from "../utils/normalizers";

export {
  acceptRisk,
  assignFinding,
  closeFinding,
  closeRisk,
  completeTask,
  createFinding,
  createRisk,
  deleteFinding,
  deleteReport,
  generateReport,
  ingestNetworkFinding,
  ingestOpenCtiIoc,
  ingestPhishingRisk,
  ingestSiemAlert,
  ingestSoarIncident,
  ingestUctcFinding,
  linkFindingToControl,
  mitigateRisk,
  reopenFinding,
  retestFinding,
  updateFinding,
  updateRisk,
  updateSoarTask,
  updateTask,
  verifyTask,
} from "../../../services/grc.api";

export { grcClient, grcStreamClient, GrcApiError } from "../../../services/grc.api";

export async function listFindings(params) {
  const data = await getFindings(params);
  return unwrapList(data).map(normalizeFinding);
}

export async function fetchFinding(id) {
  const data = await getFinding(id);
  return normalizeFinding(unwrapEntity(data));
}

export async function createFindingRecord(payload) {
  const data = await createFinding(payload);
  return normalizeFinding(unwrapEntity(data));
}

export async function updateFindingRecord(id, payload) {
  const data = await updateFinding(id, payload);
  return normalizeFinding(unwrapEntity(data));
}

export async function fetchFindingHistory(id) {
  const data = await getFindingHistory(id);
  return unwrapList(data).map(normalizeAuditLog);
}

export async function listRisks(params) {
  const data = await getRisks(params);
  return unwrapList(data).map(normalizeRisk);
}

export async function fetchRisk(id) {
  const data = await getRisk(id);
  return normalizeRisk(unwrapEntity(data));
}

export async function createRiskRecord(payload) {
  const data = await createRisk(payload);
  return normalizeRisk(unwrapEntity(data));
}

export async function updateRiskRecord(id, payload) {
  const data = await updateRisk(id, payload);
  return normalizeRisk(unwrapEntity(data));
}

export async function listTasks(params) {
  const data = await getTasks(params);
  return unwrapList(data).map(normalizeTask);
}

export async function fetchTask(id) {
  const data = await getTask(id);
  return normalizeTask(unwrapEntity(data));
}

export async function createTaskRecord(payload) {
  const data = await createTask(payload);
  return normalizeTask(unwrapEntity(data));
}

export async function updateTaskRecord(id, payload) {
  const data = await updateTask(id, payload);
  return normalizeTask(unwrapEntity(data));
}

export async function uploadEvidenceFile(formData) {
  const data = await uploadEvidence(formData);
  return unwrapEntity(data);
}

export async function fetchEvidence(id) {
  const data = await getEvidence(id);
  return unwrapEntity(data);
}

export async function removeEvidence(id) {
  return deleteEvidence(id);
}

export async function listReports(params) {
  const data = await getReports(params);
  return unwrapList(data).map(normalizeReport);
}

export async function fetchReport(id) {
  const data = await getReport(id);
  return normalizeReport(unwrapEntity(data));
}

export async function createReportRecord(payload) {
  const data = await createReport(payload);
  return normalizeReport(unwrapEntity(data));
}

export async function updateReportRecord(id, payload) {
  const data = await updateReport(id, payload);
  return normalizeReport(unwrapEntity(data));
}

export async function attachReportFindings(id, payload) {
  const data = await attachFindingsToReport(id, payload);
  return unwrapEntity(data);
}

export async function generateReportPdf(id) {
  return generateReport(id);
}

export async function downloadReportFile(id, filename) {
  const blob = await downloadReport(id);
  triggerBlobDownload(blob, filename);
  return blob;
}

export async function listControls(params) {
  const data = await getControls(params);
  return unwrapList(data).map(normalizeControl);
}

export async function fetchControl(id) {
  const data = await getControl(id);
  return normalizeControl(unwrapEntity(data));
}

export async function createControlRecord(payload) {
  const data = await createControl(payload);
  return normalizeControl(unwrapEntity(data));
}

export async function updateControlRecord(id, payload) {
  const data = await updateControl(id, payload);
  return normalizeControl(unwrapEntity(data));
}

export async function fetchComplianceStatus() {
  const data = await getComplianceStatus();
  const raw = unwrapEntity(data) ?? data;
  const frameworks = unwrapList(raw?.frameworks ?? raw);
  if (frameworks.length) {
    return frameworks.map(normalizeFrameworkCard);
  }
  if (Array.isArray(raw)) {
    return raw.map(normalizeFrameworkCard);
  }
  return [];
}

export async function fetchDashboardOverview() {
  const data = await getDashboardOverview();
  return normalizeDashboardOverview(unwrapEntity(data) ?? data ?? {});
}

export async function fetchDashboardRisks() {
  const data = await getDashboardRisks();
  return unwrapEntity(data) ?? data ?? {};
}

export async function fetchDashboardCompliance() {
  const data = await getDashboardCompliance();
  return buildPieChartData(unwrapEntity(data) ?? data ?? {});
}

export async function fetchDashboardTasks() {
  const data = await getDashboardTasks();
  return buildBarChartData(unwrapEntity(data) ?? data ?? {});
}

export async function fetchRiskHeatmap() {
  const data = await getRiskHeatmap();
  return unwrapEntity(data) ?? data ?? {};
}

export async function listNotifications() {
  const data = await getNotifications();
  return unwrapList(data).map(normalizeNotification);
}

export async function markNotificationAsRead(id) {
  const data = await markNotificationRead(id);
  return normalizeNotification(unwrapEntity(data) ?? data ?? {});
}

export async function listAuditLogs(params) {
  const data = await getAuditLogs(params);
  return unwrapList(data).map(normalizeAuditLog);
}

export async function listEntityAuditLogs(entityType, entityId) {
  const data = await getEntityAuditLogs(entityType, entityId);
  return unwrapList(data).map(normalizeAuditLog);
}
