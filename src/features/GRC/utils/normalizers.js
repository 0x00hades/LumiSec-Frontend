const LIST_KEYS = [
  "data",
  "items",
  "results",
  "findings",
  "risks",
  "tasks",
  "reports",
  "controls",
  "notifications",
  "logs",
  "auditLogs",
  "history",
  "evidence",
  "frameworks",
];

const FRAMEWORK_COLORS = ["#7F56D9", "#539BFF", "#059669", "#F79009"];
const FRAMEWORK_TYPES = ["ISO", "PCI", "SOC 2", "NIST"];

export function unwrapList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  for (const key of LIST_KEYS) {
    if (Array.isArray(raw[key])) return raw[key];
  }
  return [];
}

export function unwrapEntity(raw) {
  if (!raw) return null;
  if (raw.data != null && typeof raw.data === "object" && !Array.isArray(raw.data)) {
    return raw.data;
  }
  return raw;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
}

export function formatPercent(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "0%";
  return `${Math.round(num)}%`;
}

export function riskStatusClass(value) {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("complete") || text.includes("verified") || text.includes("closed")) {
    return "green";
  }
  if (text.includes("progress")) return "meduim";
  if (text.includes("high") || text.includes("open")) return "high";
  if (text.includes("medium")) return "meduim";
  if (text.includes("low")) return "low";
  return "high";
}

export const CONTROL_STATUS_ORDER = [
  "non_compliant",
  "partial",
  "compliant",
  "not_assessed",
];

export function toApiControlStatus(status) {
  const text = String(status ?? "").toLowerCase();
  if (text === "nc" || text.includes("non_compliant") || text.includes("non-compliant")) {
    return "non_compliant";
  }
  if (text === "p" || text.includes("partial")) return "partial";
  if (text === "c" || text.includes("compliant") && !text.includes("non")) return "compliant";
  if (text.includes("not_assessed") || text.includes("not assessed")) return "not_assessed";
  if (CONTROL_STATUS_ORDER.includes(text)) return text;
  return "non_compliant";
}

export function cycleControlStatus(status) {
  const current = toApiControlStatus(status);
  const index = CONTROL_STATUS_ORDER.indexOf(current);
  const nextIndex = index === -1 ? 0 : (index + 1) % CONTROL_STATUS_ORDER.length;
  return CONTROL_STATUS_ORDER[nextIndex];
}

export function computeControlsProgress(controls = []) {
  if (!controls.length) return 0;
  const scored = controls.filter((control) => {
    const status = toApiControlStatus(control.status);
    return status === "compliant" || status === "partial";
  });
  return Math.round((scored.length / controls.length) * 100);
}

export function controlStatusClass(status) {
  const apiStatus = toApiControlStatus(status);
  if (apiStatus === "partial") return "p-btn";
  if (apiStatus === "compliant") return "bg-success";
  if (apiStatus === "not_assessed") return "bg-danger";
  return "bg-danger";
}

export function controlStatusLabel(status) {
  const apiStatus = toApiControlStatus(status);
  if (apiStatus === "partial") return "P";
  if (apiStatus === "compliant") return "C";
  if (apiStatus === "not_assessed") return "NA";
  return "NC";
}

export function normalizeFinding(raw = {}) {
  return {
    id: raw.id ?? raw._id,
    title: raw.title ?? raw.name ?? raw.finding ?? "",
    description: raw.description ?? raw.finding ?? raw.summary ?? "",
    status: raw.status ?? "Open",
    severity: raw.severity ?? raw.risk ?? raw.riskLevel ?? "Medium",
    controlId: raw.controlId ?? raw.control_id ?? raw.control?.code ?? "",
    assignedTo:
      raw.assignedTo?.name ??
      raw.assignedTo ??
      raw.assignee?.name ??
      raw.assignee ??
      null,
    dueDate: raw.dueDate ?? raw.due_date ?? null,
    sourceModule: raw.sourceModule ?? raw.source_module ?? null,
    sourceId: raw.sourceId ?? raw.source_id ?? null,
  };
}

export function normalizeRisk(raw = {}) {
  return {
    id: raw.id ?? raw._id,
    title: raw.title ?? raw.name ?? "",
    description: raw.description ?? raw.summary ?? "",
    status: raw.status ?? "Open",
    likelihood: raw.likelihood ?? raw.likelihoodScore ?? null,
    impact: raw.impact ?? raw.impactScore ?? null,
    score: raw.score ?? raw.riskScore ?? null,
    findingId: raw.findingId ?? raw.finding_id ?? null,
  };
}

export function normalizeTask(raw = {}) {
  return {
    id: raw.id ?? raw._id,
    controlId: raw.controlId ?? raw.control_id ?? raw.control?.code ?? "—",
    finding: raw.finding ?? raw.description ?? raw.title ?? "",
    risk: raw.risk ?? raw.riskLevel ?? raw.risk_level ?? raw.severity ?? "Medium",
    assignedTo:
      raw.assignedTo?.name ??
      raw.assignedTo ??
      raw.assignee?.name ??
      raw.assignee ??
      "—",
    dueDate: formatDate(raw.dueDate ?? raw.due_date),
    status: raw.status ?? "Open",
    remediationPlan: raw.remediationPlan ?? raw.remediation_plan ?? "",
  };
}

export function normalizeReport(raw = {}) {
  const progress = raw.progress ?? raw.progressPercent ?? raw.completion ?? 0;
  return {
    id: raw.id ?? raw._id,
    title: raw.title ?? raw.name ?? "Audit Report",
    desc: `Assigned to: ${
      raw.assignee?.name ?? raw.assignedTo ?? raw.assigned_to ?? "—"
    } | Due: ${formatDate(raw.dueDate ?? raw.due_date)}`,
    progrssText: `Progress: ${progress}%`,
    progressPercent: progress,
    status: raw.status ?? "Active",
  };
}

export function getControlKey(control) {
  if (!control) return null;
  const key = control.id ?? control._id ?? control.code;
  return key != null && String(key).trim() !== "" ? String(key) : null;
}

export function normalizeControl(raw = {}) {
  const id = raw.id ?? raw._id ?? null;
  return {
    id: id != null ? String(id) : null,
    code: raw.code ?? raw.controlId ?? raw.control_id ?? "",
    title: raw.title ?? raw.name ?? raw.description ?? "",
    status: raw.status ?? raw.assessmentStatus ?? raw.assessment_status ?? "non_compliant",
    section: raw.section ?? raw.domain ?? raw.category ?? raw.framework ?? "General",
  };
}

export function normalizeFrameworkCard(raw = {}, index = 0) {
  const percent = raw.compliancePercent ?? raw.percent ?? raw.compliance ?? 0;
  return {
    id: raw.id ?? raw._id ?? raw.framework ?? index,
    backgroundColor: raw.color ?? FRAMEWORK_COLORS[index % FRAMEWORK_COLORS.length],
    type: raw.type ?? raw.frameworkType ?? FRAMEWORK_TYPES[index % FRAMEWORK_TYPES.length],
    title: raw.title ?? raw.name ?? raw.frameworkName ?? raw.framework ?? "",
    desc: raw.description ?? raw.desc ?? "",
    progressTitle: `Overall Compliance: ${formatPercent(percent)}`,
    progressPercent: formatPercent(percent),
    Controls: `${raw.controlsCount ?? raw.controls ?? raw.controlCount ?? 0} Controls`,
  };
}

export function normalizeDashboardOverview(raw = {}) {
  return {
    overallCompliance: formatPercent(
      raw.overallCompliance ??
        raw.compliancePercent ??
        raw.compliance_percentage ??
        raw.compliance ??
        0
    ),
    nonCompliantControls:
      raw.nonCompliantControls ??
      raw.non_compliant_controls ??
      raw.nonCompliant ??
      0,
    remediationTasks:
      raw.remediationTasks ?? raw.openTasks ?? raw.tasksCount ?? raw.tasks ?? 0,
    activeAudits:
      raw.activeAudits ?? raw.active_audits ?? raw.auditsCount ?? raw.audits ?? 0,
  };
}

export function buildBarChartData(raw = {}) {
  if (raw.labels && raw.datasets) return raw;
  if (raw.chart?.labels) return raw.chart;

  const series =
    raw.byMonth ??
    raw.monthly ??
    raw.tasksByMonth ??
    raw.risksByMonth ??
    raw.series ??
    [];

  if (Array.isArray(series) && series.length) {
    return {
      labels: series.map((item) => item.label ?? item.month ?? item.name ?? ""),
      datasets: [
        {
          label: raw.label ?? "Tasks",
          data: series.map((item) => item.count ?? item.value ?? item.total ?? 0),
          backgroundColor: "#4F46E5",
        },
      ],
    };
  }

  return {
    labels: [],
    datasets: [{ label: "Tasks", data: [], backgroundColor: "#4F46E5" }],
  };
}

export function buildPieChartData(raw = {}) {
  if (raw.labels && raw.datasets) return raw;
  if (raw.chart?.labels) return raw.chart;

  const breakdown =
    raw.breakdown ?? raw.byStatus ?? raw.byFramework ?? raw.distribution ?? raw.series ?? [];

  if (Array.isArray(breakdown) && breakdown.length) {
    const colors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];
    return {
      labels: breakdown.map((item) => item.label ?? item.name ?? item.status ?? ""),
      datasets: [
        {
          label: raw.label ?? "Compliance",
          data: breakdown.map((item) => item.count ?? item.value ?? item.total ?? 0),
          backgroundColor: breakdown.map((_, i) => colors[i % colors.length]),
          borderWidth: 1,
        },
      ],
    };
  }

  return {
    labels: [],
    datasets: [{ label: "Compliance", data: [], backgroundColor: [], borderWidth: 1 }],
  };
}

export function groupControlsBySection(controls = []) {
  return controls.reduce((acc, control) => {
    const section = control.section || "General";
    if (!acc[section]) acc[section] = [];
    acc[section].push(control);
    return acc;
  }, {});
}

export function normalizeNotification(raw = {}) {
  return {
    id: raw.id ?? raw._id,
    title: raw.title ?? raw.message ?? "",
    body: raw.body ?? raw.description ?? "",
    read: Boolean(raw.read ?? raw.isRead ?? raw.is_read),
    createdAt: raw.createdAt ?? raw.created_at ?? null,
  };
}

export function normalizeAuditLog(raw = {}) {
  return {
    id: raw.id ?? raw._id,
    action: raw.action ?? raw.event ?? "",
    entityType: raw.entityType ?? raw.entity_type ?? "",
    entityId: raw.entityId ?? raw.entity_id ?? "",
    user: raw.user?.name ?? raw.user ?? raw.actor ?? "System",
    timestamp: raw.timestamp ?? raw.createdAt ?? raw.created_at ?? null,
    details: raw.details ?? raw.changes ?? raw.metadata ?? null,
  };
}

export function toTaskPayload(form = {}) {
  return {
    controlId: form.controlId,
    description: form.description ?? form.finding,
    finding: form.finding ?? form.description,
    riskLevel: form.riskLevel ?? form.risk,
    assignedTo: form.assignedTo,
    dueDate: form.dueDate,
    status: form.status ?? "Open",
    remediationPlan: form.remediationPlan,
  };
}

export function toControlPayload(form = {}) {
  return {
    framework: form.framework,
    code: form.code ?? form.controlId,
    title: form.title ?? form.name,
    description: form.description,
    status: form.status,
  };
}

export function triggerBlobDownload(blob, filename = "report.pdf") {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
