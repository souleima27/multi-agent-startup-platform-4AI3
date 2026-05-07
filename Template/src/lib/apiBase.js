export function getApiBase(envValue = "") {
  const value = String(envValue || "").trim().replace(/\/+$/, "");
  if (!value) return "";
  if (value.includes("127.0.0.1") || value.includes("localhost")) return "";
  return value;
}
