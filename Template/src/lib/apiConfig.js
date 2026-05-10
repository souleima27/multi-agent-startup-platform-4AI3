const configuredApiBaseUrl = import.meta.env.VITE_TRACK1_API_URL;

export const track1ApiBaseUrl = (configuredApiBaseUrl || "http://127.0.0.1:5055").replace(/\/$/, "");
