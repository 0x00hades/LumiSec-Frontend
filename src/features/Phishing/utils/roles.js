/**
 * Phishing module RBAC — backend roles are the source of truth.
 * Roles: admin, soc_manager, soc_analyst, phishing_operator, phishing_manager, auditor
 */

export const BACKEND_ROLES = {
  ADMIN: "admin",
  SOC_MANAGER: "soc_manager",
  SOC_ANALYST: "soc_analyst",
  PHISHING_OPERATOR: "phishing_operator",
  PHISHING_MANAGER: "phishing_manager",
  AUDITOR: "auditor",
};

const READ_ROLES = new Set(Object.values(BACKEND_ROLES));

const WRITE_ROLES = new Set([
  BACKEND_ROLES.ADMIN,
  BACKEND_ROLES.PHISHING_MANAGER,
]);

const LAUNCH_ROLES = new Set([
  BACKEND_ROLES.ADMIN,
  BACKEND_ROLES.PHISHING_MANAGER,
  BACKEND_ROLES.PHISHING_OPERATOR,
]);

const DELETE_ROLES = new Set([
  BACKEND_ROLES.ADMIN,
  BACKEND_ROLES.PHISHING_MANAGER,
]);

const INTEGRATION_ROLES = new Set([
  BACKEND_ROLES.ADMIN,
  BACKEND_ROLES.SOC_MANAGER,
  BACKEND_ROLES.PHISHING_MANAGER,
]);

function normalizeRole(role) {
  return String(role ?? "").trim().toLowerCase();
}

export function resolvePhishingRole(user) {
  return normalizeRole(user?.role);
}

export function canAccessPhishing(role) {
  return READ_ROLES.has(normalizeRole(role));
}

export function canManageCampaigns(role) {
  return WRITE_ROLES.has(normalizeRole(role));
}

export function canLaunchCampaigns(role) {
  return LAUNCH_ROLES.has(normalizeRole(role));
}

export function canEditTemplates(role) {
  return WRITE_ROLES.has(normalizeRole(role));
}

export function canManageRecipients(role) {
  return WRITE_ROLES.has(normalizeRole(role));
}

export function canDeleteResources(role) {
  return DELETE_ROLES.has(normalizeRole(role));
}

export function canViewReports(role) {
  return READ_ROLES.has(normalizeRole(role));
}

export function canUseIntegrations(role) {
  return INTEGRATION_ROLES.has(normalizeRole(role));
}

export function canViewTracking(role) {
  const r = normalizeRole(role);
  return (
    r === BACKEND_ROLES.ADMIN ||
    r === BACKEND_ROLES.SOC_MANAGER ||
    r === BACKEND_ROLES.SOC_ANALYST ||
    r === BACKEND_ROLES.PHISHING_MANAGER ||
    r === BACKEND_ROLES.PHISHING_OPERATOR ||
    r === BACKEND_ROLES.AUDITOR
  );
}

export function isReadOnly(role) {
  return normalizeRole(role) === BACKEND_ROLES.AUDITOR;
}
