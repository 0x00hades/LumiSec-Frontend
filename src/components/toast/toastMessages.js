const DEFAULT_SUCCESS = "Operation completed successfully.";
const DEFAULT_ERROR = "Something went wrong.";

function formatErrors(errors) {
  if (Array.isArray(errors)) {
    return errors.filter(Boolean).join(", ");
  }
  if (errors && typeof errors === "object") {
    return Object.values(errors)
      .flat()
      .filter(Boolean)
      .join(", ");
  }
  return null;
}

export function extractApiMessage(data, fallback = DEFAULT_ERROR) {
  if (!data) return fallback;
  if (typeof data === "string") return data.trim() || fallback;

  if (data.message) {
    const message = data.message;
    return typeof message === "string" ? message.trim() || fallback : String(message);
  }

  if (data.error) {
    if (typeof data.error === "string") return data.error.trim() || fallback;
    if (typeof data.error === "object" && data.error.message) {
      return String(data.error.message).trim() || fallback;
    }
  }

  const formattedErrors = formatErrors(data.errors);
  if (formattedErrors) return formattedErrors;

  return fallback;
}

export function resolveResponseToastType(data) {
  const level = String(
    data?.type ?? data?.level ?? data?.status ?? data?.severity ?? ""
  ).toLowerCase();

  if (["success", "ok", "completed", "done"].includes(level)) return "success";
  if (["error", "danger", "failed", "fail", "failure"].includes(level)) return "error";
  if (["warning", "warn"].includes(level)) return "warning";
  if (["info", "information"].includes(level)) return "info";

  return "success";
}

export { DEFAULT_SUCCESS, DEFAULT_ERROR };
