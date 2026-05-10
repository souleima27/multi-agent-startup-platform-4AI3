export function getApiBase(envValue = "") {
  const value = String(envValue || "").trim().replace(/\/+$/, "");
  if (value.includes("127.0.0.1") || value.includes("localhost")) return "";
  if (value) return value;

  const host = window.location.hostname;
  if (host.includes("startup-platform-frontend") && host.endsWith(".onrender.com")) {
    return "https://startup-platform-api-26b4.onrender.com";
  }

  return value;
}
