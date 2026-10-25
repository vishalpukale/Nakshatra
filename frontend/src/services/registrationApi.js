import { apiUrl } from "./apiBase";

async function readBody(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || "Something went wrong. Please try again.");
    error.fields = body.data && typeof body.data === "object" ? body.data : {};
    throw error;
  }
  return body;
}

export function fetchEvents() {
  return fetch(apiUrl("/api/registration/events")).then(readBody);
}

export function fetchGallery() {
  return fetch(apiUrl("/api/registration/gallery")).then(readBody);
}

export function fetchSiteContent() {
  return fetch(apiUrl("/api/registration/site")).then(readBody);
}

export function fetchStates() {
  return fetch(apiUrl("/api/registration/states")).then(readBody);
}

export function fetchCities(stateId) {
  return fetch(apiUrl(`/api/registration/cities?stateId=${stateId}`)).then(readBody);
}

export function fetchForm(slug) {
  return fetch(apiUrl(`/api/registration/events/${slug}/form`)).then(readBody);
}

export function submitRegistration(formData) {
  return fetch(apiUrl("/api/registration/registrations"), {
    method: "POST",
    body: formData,
  }).then(readBody);
}

export function submitInquiry(payload) {
  return fetch(apiUrl("/api/registration/inquiries"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(readBody);
}
