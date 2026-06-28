const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_REGEX.test(String(value || "").trim());
}

export function isValidUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateRequired(value, message = "This field is required") {
  if (!String(value ?? "").trim()) return message;
  return undefined;
}

export function validateEmailField(value, { required = false } = {}) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return required ? "Email is required" : undefined;
  }
  if (!isValidEmail(trimmed)) return "Enter a valid email address";
  return undefined;
}

export function validatePasswordField(value, { required = false, minLength = 6 } = {}) {
  if (!value) {
    return required ? "Password is required" : undefined;
  }
  if (value.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return undefined;
}
