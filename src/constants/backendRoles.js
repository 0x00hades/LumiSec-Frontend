/**
 * Backend role values from Markdown/backend-frontend-contract.md (Auth section).
 * Signup payloads must use these exact strings.
 */
export const BACKEND_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "soc_analyst", label: "SOC Analyst" },
  { value: "soc_manager", label: "SOC Manager" },
  { value: "red_team", label: "Red Team" },
  { value: "detection_engineer", label: "Detection Engineer" },
  { value: "auditor", label: "Auditor" },
  { value: "compliance_manager", label: "Compliance Manager" },
  { value: "it_manager", label: "IT Manager" },
  { value: "assignee", label: "Assignee" },
  { value: "grc_manager", label: "GRC Manager" },
  { value: "phishing_operator", label: "Phishing Operator" },
  { value: "phishing_manager", label: "Phishing Manager" },
  { value: "senior_analyst", label: "Senior Analyst" },
  { value: "integration_admin", label: "Integration Admin" },
  { value: "read_only", label: "Read Only" },
];

export const BACKEND_ROLE_VALUES = BACKEND_ROLES.map((role) => role.value);
