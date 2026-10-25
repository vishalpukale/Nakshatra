import { apiUrl } from "./apiBase";

const TOKEN_KEY = "nakshatra_admin_token";

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

export function setAdminToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

async function adminRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(apiUrl(path), { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || "Something went wrong.");
    error.status = response.status;
    throw error;
  }
  return body;
}

export function adminLogin(email, password) {
  return adminRequest("/api/registration/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchAdminRegistrations() {
  return adminRequest("/api/registration/admin/registrations");
}

export function fetchAdminInquiries() {
  return adminRequest("/api/registration/admin/inquiries");
}

export function fetchAdmins() {
  return adminRequest("/api/registration/admin/admins");
}

export function createAdminAccount(payload) {
  return adminRequest("/api/registration/admin/admins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminAccess(id, isActive) {
  return adminRequest(`/api/registration/admin/admins/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export function fetchManagedEvents() {
  return adminRequest("/api/registration/admin/events");
}

export function saveEvent(payload, id) {
  return adminRequest(id ? `/api/registration/admin/events/${id}` : "/api/registration/admin/events", {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(payload),
  });
}

export function removeEvent(id) {
  return adminRequest(`/api/registration/admin/events/${id}`, { method: "DELETE" });
}

export function fetchManagedGallery() {
  return adminRequest("/api/registration/admin/gallery");
}

export function saveGalleryImage(formData) {
  return adminRequest("/api/registration/admin/gallery", { method: "POST", body: formData });
}

export function updateGalleryImage(id, payload) {
  return adminRequest(`/api/registration/admin/gallery/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function removeGalleryImage(id) {
  return adminRequest(`/api/registration/admin/gallery/${id}`, { method: "DELETE" });
}

export function fetchManagedStates() {
  return adminRequest("/api/registration/admin/states");
}

export function updateParticipatingState(id, isParticipating) {
  return adminRequest(`/api/registration/admin/states/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isParticipating }),
  });
}

export function fetchManagedSite() {
  return adminRequest("/api/registration/admin/site");
}

export function saveSiteContent(payload) {
  return adminRequest("/api/registration/admin/site", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
