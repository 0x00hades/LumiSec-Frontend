import { ROLES } from '../tools/tools.config';

/**
 * Maps backend / JWT role strings to internal RBAC role constants.
 * Backend example: { role: "admin" } → GLOBAL_ADMIN
 */
const BACKEND_ROLE_ALIASES = {
  admin: ROLES.GLOBAL_ADMIN,
  administrator: ROLES.GLOBAL_ADMIN,
  global_admin: ROLES.GLOBAL_ADMIN,
  superadmin: ROLES.GLOBAL_ADMIN,
  grc: ROLES.GRC,
  blue_team: ROLES.BLUE_TEAM,
  blueteam: ROLES.BLUE_TEAM,
  red_team: ROLES.RED_TEAM,
  redteam: ROLES.RED_TEAM,
  soc_analyst: ROLES.SOC_ANALYST,
  soc: ROLES.SOC_ANALYST,
  analyst: ROLES.SOC_ANALYST,
  soc_manager: ROLES.SOC_MANAGER,
  phishing_manager: ROLES.PHISHING_MANAGER,
  phishing_operator: ROLES.PHISHING_OPERATOR,
  auditor: ROLES.AUDITOR,
};

export function normalizeBackendRole(role) {
  if (!role) return null;

  const raw = String(role).trim();
  if (Object.values(ROLES).includes(raw)) {
    return raw;
  }

  const alias = BACKEND_ROLE_ALIASES[raw.toLowerCase()];
  return alias ?? null;
}
