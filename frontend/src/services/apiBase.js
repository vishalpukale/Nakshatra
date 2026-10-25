export function apiUrl(path) {
  if (path == null || path === "") return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const base = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  if (path.startsWith("/api/") || path.startsWith("/uploads/")) {
    return `${base}${path}`;
  }
  return path;
}
