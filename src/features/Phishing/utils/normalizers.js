export function extractId(raw) {
  if (!raw) return null;
  return raw._id ?? raw.id ?? null;
}

export function normalizeList(payload, key = "data") {
  if (Array.isArray(payload)) return payload;
  if (payload?.[key]) return payload[key];
  if (payload?.items) return payload.items;
  if (payload?.results) return payload.results;
  return [];
}

export const CAMPAIGN_STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "RUNNING",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
];

export const EVENT_TYPE_LABELS = {
  EMAIL_SENT: "Email Sent",
  EMAIL_OPENED: "Email Opened",
  LINK_CLICKED: "Link Clicked",
  FORM_VISITED: "Landing Page Visit",
  CREDENTIAL_SUBMITTED: "Credential Submission",
  ATTACHMENT_DOWNLOADED: "Attachment Download",
  QR_SCANNED: "QR Scanned",
};

const EVENT_SEVERITY = {
  EMAIL_SENT: "info",
  EMAIL_OPENED: "info",
  LINK_CLICKED: "warning",
  FORM_VISITED: "warning",
  CREDENTIAL_SUBMITTED: "critical",
  ATTACHMENT_DOWNLOADED: "high",
  QR_SCANNED: "warning",
};

const EVENT_UI_TYPE = {
  EMAIL_SENT: "email_sent",
  EMAIL_OPENED: "open",
  LINK_CLICKED: "click",
  FORM_VISITED: "visit",
  CREDENTIAL_SUBMITTED: "submit",
  ATTACHMENT_DOWNLOADED: "download",
  QR_SCANNED: "qr_scanned",
};

export function normalizeCampaign(raw = {}) {
  const status = String(raw.status ?? "DRAFT").toUpperCase();
  const sent = Number(raw.sentCount ?? raw.sent ?? 0);
  const opened = Number(raw.openedCount ?? raw.opened ?? 0);
  const clicked = Number(raw.clickedCount ?? raw.clicked ?? 0);
  const submitted = Number(raw.submittedCount ?? raw.submitted ?? 0);

  return {
    id: extractId(raw),
    name: raw.name ?? "Untitled Campaign",
    description: raw.description ?? "",
    templateId: raw.templateId ?? raw.template_id,
    status,
    launchDate: raw.launchDate ?? raw.launch_date,
    completedAt: raw.completedAt ?? raw.completed_at,
    recipientsCount: Number(raw.recipientsCount ?? raw.recipients_count ?? 0),
    sentCount: sent,
    openedCount: opened,
    clickedCount: clicked,
    submittedCount: submitted,
    sent,
    opened,
    clicked,
    submitted,
    createdBy: raw.createdBy ?? raw.created_by,
    createdAt: raw.createdAt ?? raw.created_at,
    attachments: normalizeList(raw.attachments ?? []).map(normalizeAttachment),
    raw,
  };
}

export function normalizeTemplate(raw = {}) {
  const htmlBody = raw.htmlBody ?? raw.html_body ?? raw.body ?? raw.html ?? "";
  return {
    id: extractId(raw),
    name: raw.name ?? "Template",
    subject: raw.subject ?? "",
    htmlBody,
    textBody: raw.textBody ?? raw.text_body ?? "",
    category: raw.category ?? "general",
    language: raw.language ?? "en",
    createdBy: raw.createdBy ?? raw.created_by,
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
    body: htmlBody,
    raw,
  };
}

export function normalizeLandingPage(raw = {}) {
  const htmlContent = raw.htmlContent ?? raw.html_content ?? raw.html ?? "";
  return {
    id: extractId(raw),
    name: raw.name ?? "Landing Page",
    title: raw.title ?? raw.name ?? "",
    htmlContent,
    redirectUrl: raw.redirectUrl ?? raw.redirect_url ?? "",
    createdBy: raw.createdBy ?? raw.created_by,
    html: htmlContent,
    raw,
  };
}

export function normalizeRecipient(raw = {}) {
  const fullName = raw.fullName ?? raw.full_name ?? raw.name ?? "";
  return {
    id: extractId(raw),
    campaignId: raw.campaignId ?? raw.campaign_id,
    fullName,
    name: fullName,
    email: raw.email ?? "",
    department: raw.department ?? "",
    jobTitle: raw.jobTitle ?? raw.job_title ?? "",
    manager: raw.manager ?? "",
    riskScore: Number(raw.riskScore ?? raw.risk_score ?? 0),
    status: raw.status ?? "pending",
    trackingId: raw.trackingId ?? raw.tracking_id,
    emailSent: Boolean(raw.emailSent ?? raw.email_sent),
    opened: Boolean(raw.opened),
    clicked: Boolean(raw.clicked),
    submitted: Boolean(raw.submitted),
    createdAt: raw.createdAt ?? raw.created_at,
    valid: raw.valid !== false && raw.isValid !== false,
    credentialCaptures: normalizeList(raw.credentialCaptures ?? []).map(normalizeCredentialCapture),
    raw,
  };
}

export function normalizeTrackingEvent(raw = {}, index = 0) {
  const eventType = String(raw.eventType ?? raw.event_type ?? raw.type ?? "EMAIL_OPENED").toUpperCase();
  const uiType = EVENT_UI_TYPE[eventType] ?? eventType.toLowerCase();

  return {
    id: extractId(raw) ?? `ev-${index}`,
    campaignId: raw.campaignId ?? raw.campaign_id,
    recipientId: raw.recipientId ?? raw.recipient_id,
    eventType,
    type: uiType,
    email: raw.email ?? raw.recipientEmail ?? "—",
    timestamp: raw.timestamp ?? raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    severity: raw.severity ?? EVENT_SEVERITY[eventType] ?? "info",
    ip: raw.ipAddress ?? raw.ip_address ?? raw.ip,
    userAgent: raw.userAgent ?? raw.user_agent,
    raw,
  };
}

export function normalizeAttachment(raw = {}) {
  return {
    id: extractId(raw),
    campaignId: raw.campaignId ?? raw.campaign_id,
    filename: raw.filename ?? "",
    storagePath: raw.storagePath ?? raw.storage_path ?? "",
    type: raw.type ?? "",
    raw,
  };
}

export function normalizeCredentialCapture(raw = {}) {
  return {
    id: extractId(raw),
    campaignId: raw.campaignId ?? raw.campaign_id,
    recipientId: raw.recipientId ?? raw.recipient_id,
    username: raw.username ?? "",
    timestamp: raw.timestamp ?? raw.createdAt ?? raw.created_at,
    raw,
  };
}

export function normalizeCampaignReport(raw = {}) {
  return {
    id: extractId(raw),
    campaignId: raw.campaignId ?? raw.campaign_id,
    generatedBy: raw.generatedBy ?? raw.generated_by,
    pdfPath: raw.pdfPath ?? raw.pdf_path,
    generatedAt: raw.generatedAt ?? raw.generated_at,
    raw,
  };
}

export function normalizePhishingRisk(raw = {}) {
  const level = String(raw.riskLevel ?? raw.risk_level ?? raw.level ?? "low").toLowerCase();
  return {
    id: extractId(raw),
    recipientId: raw.recipientId ?? raw.recipient_id,
    campaignId: raw.campaignId ?? raw.campaign_id,
    riskLevel: level,
    reason: raw.reason ?? "",
    grcRiskId: raw.grcRiskId ?? raw.grc_risk_id,
    createdAt: raw.createdAt ?? raw.created_at,
    name: raw.fullName ?? raw.name ?? raw.recipientName ?? "—",
    email: raw.email ?? raw.recipientEmail ?? "—",
    department: raw.department ?? "—",
    score: Number(raw.riskScore ?? raw.score ?? 0),
    level,
    raw,
  };
}

export function normalizeReportStats(raw = {}) {
  return {
    emailsSent: Number(raw.emailsSent ?? raw.sent ?? 0),
    opened: Number(raw.opened ?? 0),
    clicked: Number(raw.clicked ?? 0),
    submitted: Number(raw.submitted ?? 0),
    campaigns: Number(raw.campaigns ?? 0),
    totalRecipients: Number(raw.totalRecipients ?? raw.recipients ?? 0),
    avgClickRate: Number(raw.avgClickRate ?? raw.clickRate ?? 0),
    avgSubmitRate: Number(raw.avgSubmitRate ?? raw.submitRate ?? 0),
    highRiskUsers: Number(raw.highRiskUsers ?? raw.highRisk ?? 0),
    raw,
  };
}

export function normalizeDepartment(raw = {}) {
  const vulnerability = Number(
    raw.vulnerability ?? raw.vulnerabilityPercent ?? raw.submitRate ?? raw.riskScore ?? 0
  );
  return {
    department: raw.department ?? raw.name ?? "Unknown",
    employees: Number(raw.employees ?? raw.count ?? raw.total ?? 0),
    clicked: Number(raw.clicked ?? raw.clickedCount ?? 0),
    submitted: Number(raw.submitted ?? raw.submittedCount ?? 0),
    vulnerability,
    raw,
  };
}

export function normalizeOverview(raw = {}) {
  return {
    activeCampaigns: Number(raw.activeCampaigns ?? raw.runningCampaigns ?? 0),
    emailsSent: Number(raw.emailsSent ?? raw.sent ?? 0),
    openRate: Number(raw.openRate ?? 0),
    clickRate: Number(raw.clickRate ?? 0),
    submitRate: Number(raw.submitRate ?? 0),
    risksCreated: Number(raw.risksCreated ?? raw.risks ?? 0),
    successRate: Number(raw.successRate ?? 0),
    industryOpenAvg: Number(raw.industryOpenAvg ?? 0),
    industryClickAvg: Number(raw.industryClickAvg ?? 0),
    criticalThreshold: Number(raw.criticalThreshold ?? 15),
    recentCampaigns: normalizeList(raw.recentCampaigns ?? []).map(normalizeCampaign),
    funnel: raw.funnel ?? null,
    trends: raw.trends ?? null,
    raw,
  };
}

export function normalizeTrends(raw = {}) {
  if (Array.isArray(raw)) {
    return {
      labels: raw.map((_, i) => `Period ${i + 1}`),
      openRate: raw.map((d) => Number(d.openRate ?? d.opened ?? 0)),
      clickRate: raw.map((d) => Number(d.clickRate ?? d.clicked ?? 0)),
      submitRate: raw.map((d) => Number(d.submitRate ?? d.submitted ?? 0)),
      sent: raw.map((d) => Number(d.sent ?? d.emailsSent ?? 0)),
      clicked: raw.map((d) => Number(d.clicked ?? 0)),
      submitted: raw.map((d) => Number(d.submitted ?? 0)),
    };
  }

  return {
    labels: raw.labels ?? raw.periods ?? [],
    openRate: raw.openRate ?? raw.openRates ?? [],
    clickRate: raw.clickRate ?? raw.clickRates ?? [],
    submitRate: raw.submitRate ?? raw.submitRates ?? [],
    sent: raw.sent ?? raw.emailsSent ?? [],
    clicked: raw.clicked ?? [],
    submitted: raw.submitted ?? [],
  };
}

export function buildEventsFromRecipients(recipients = [], campaignId = null) {
  const events = [];

  recipients.forEach((recipient, index) => {
    const base = {
      email: recipient.email,
      campaignId: campaignId ?? recipient.campaignId,
      recipientId: recipient.id,
      timestamp: recipient.createdAt ?? new Date().toISOString(),
    };

    if (recipient.emailSent) {
      events.push(normalizeTrackingEvent({ ...base, eventType: "EMAIL_SENT", id: `${recipient.id}-sent` }, index));
    }
    if (recipient.opened) {
      events.push(normalizeTrackingEvent({ ...base, eventType: "EMAIL_OPENED", id: `${recipient.id}-open` }, index));
    }
    if (recipient.clicked) {
      events.push(normalizeTrackingEvent({ ...base, eventType: "LINK_CLICKED", id: `${recipient.id}-click` }, index));
    }
    if (recipient.submitted) {
      events.push(normalizeTrackingEvent({ ...base, eventType: "CREDENTIAL_SUBMITTED", id: `${recipient.id}-submit` }, index));
    }
  });

  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function campaignProgressFromCampaign(campaign) {
  const total = campaign?.recipientsCount ?? 0;
  const sent = campaign?.sentCount ?? campaign?.sent ?? 0;
  return {
    total,
    sent,
    pending: Math.max(0, total - sent),
    failed: 0,
    status: campaign?.status,
    progress: total ? Math.round((sent / total) * 100) : 0,
    logs: [],
  };
}

export function isCampaignRunning(campaign) {
  return String(campaign?.status ?? "").toUpperCase() === "RUNNING";
}

export function isCampaignPausable(campaign) {
  const status = String(campaign?.status ?? "").toUpperCase();
  return status === "RUNNING" || status === "SCHEDULED";
}

export function isCampaignResumable(campaign) {
  return String(campaign?.status ?? "").toUpperCase() === "PAUSED";
}

export function formatPercent(n) {
  const v = Number(n);
  if (Number.isNaN(v)) return "—";
  return `${v}%`;
}

export function formatNumber(n) {
  const v = Number(n);
  if (Number.isNaN(v)) return n ?? "—";
  return v.toLocaleString();
}

export function riskLevelClass(level) {
  const l = String(level ?? "").toLowerCase();
  if (l === "high" || l === "critical") return "phishing-risk-high";
  if (l === "medium") return "phishing-risk-medium";
  return "phishing-risk-low";
}

export function calcRate(numerator, denominator) {
  const num = Number(numerator);
  const den = Number(denominator);
  if (!den || Number.isNaN(num) || Number.isNaN(den)) return 0;
  return Math.round((num / den) * 100);
}
