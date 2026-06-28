export function isMockApiEnabled() {
  return String(process.env.REACT_APP_USE_MOCK_API || "").toLowerCase() === "true";
}

export const MOCK_STORAGE_KEY = "lumisec_mock_database_v1";
