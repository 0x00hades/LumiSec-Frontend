import { BACKEND_ROLE_VALUES } from "../../../constants/backendRoles";
import {
  hideBootstrapModal as hideModal,
  showBootstrapModal as showModal,
} from "../../../utils/bootstrapModal";

const ROLE_LABELS = {
  admin: "Admin",
  soc_analyst: "SOC Analyst",
  soc_manager: "SOC Manager",
  red_team: "Red Team",
  detection_engineer: "Detection Engineer",
  auditor: "Auditor",
  compliance_manager: "Compliance Manager",
  it_manager: "IT Manager",
  assignee: "Assignee",
  grc_manager: "GRC Manager",
  phishing_operator: "Phishing Operator",
  phishing_manager: "Phishing Manager",
  senior_analyst: "Senior Analyst",
  integration_admin: "Integration Admin",
  read_only: "Read Only",
};

export const USER_STATUS_VALUES = ["active", "inactive"];

export function normalizeUser(raw) {
  if (!raw || typeof raw !== "object") return null;

  const status = raw.status ?? "active";

  return {
    id: raw._id ?? raw.id ?? null,
    name: raw.name ?? "",
    email: raw.email ?? "",
    role: raw.role ?? "",
    roleLabel: ROLE_LABELS[raw.role] ?? raw.role ?? "",
    department: raw.department ?? "",
    status,
    statusLabel: status === "inactive" ? "Inactive" : "Active",
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
    lastLoginAt: raw.lastLoginAt ?? null,
  };
}

export function normalizeUserList(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeUser).filter(Boolean);
}

export function formatUserDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toSignupPayload(values) {
  const payload = {
    name: String(values.name ?? "").trim(),
    email: String(values.email ?? "").trim(),
    password: values.password,
    role: values.role,
  };

  const department = String(values.department ?? "").trim();
  if (department) {
    payload.department = department;
  }

  return payload;
}

export function toUpdatePayload(values) {
  const payload = {
    name: String(values.name ?? "").trim(),
    email: String(values.email ?? "").trim(),
    role: values.role,
  };

  const department = String(values.department ?? "").trim();
  if (department) {
    payload.department = department;
  }

  return payload;
}

export function validateSignupForm(values) {
  const errors = {};

  if (!String(values.name ?? "").trim()) {
    errors.name = "Full name is required";
  }

  const email = String(values.email ?? "").trim();
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!values.role) {
    errors.role = "Role is required";
  } else if (!BACKEND_ROLE_VALUES.includes(values.role)) {
    errors.role = "Select a valid role";
  }

  return errors;
}

export function validateUpdateForm(values) {
  const errors = {};

  if (!String(values.name ?? "").trim()) {
    errors.name = "Full name is required";
  }

  const email = String(values.email ?? "").trim();
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.role) {
    errors.role = "Role is required";
  } else if (!BACKEND_ROLE_VALUES.includes(values.role)) {
    errors.role = "Select a valid role";
  }

  return errors;
}

export function validateResetPasswordForm(values) {
  const errors = {};

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function getUserDetailFields(user) {
  if (!user) return [];
  return [
    { label: "Full Name", value: user.name || "—" },
    { label: "Email", value: user.email || "—" },
    { label: "Role", value: user.roleLabel || user.role || "—" },
    { label: "Department", value: user.department || "—" },
    { label: "Status", value: user.statusLabel || user.status || "—" },
    { label: "Created", value: formatUserDate(user.createdAt) },
    { label: "Last Updated", value: formatUserDate(user.updatedAt) },
    { label: "Last Login", value: formatUserDate(user.lastLoginAt) },
    { label: "User ID", value: user.id || "—" },
  ];
}

export function hideBootstrapModal(modalId) {
  hideModal(modalId);
}

export function showBootstrapModal(modalId) {
  showModal(modalId);
}

export function userToEditValues(user) {
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
    department: user?.department ?? "",
  };
}
