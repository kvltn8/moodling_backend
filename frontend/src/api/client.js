// Points at wherever you deploy https://github.com/kvltn8/moodling_backend.
// Set EXPO_PUBLIC_API_URL in a .env file at the project root - Expo inlines
// any EXPO_PUBLIC_* variable at build time, no extra config needed.
// If you're testing on a physical device via Expo Go, "localhost" or
// "127.0.0.1" means the PHONE itself, not your computer - use your
// computer's LAN IP instead (e.g. http://192.168.1.23:8000).
// Django needs django-cors-headers configured to allow this app's origin.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-moodling-backend.example.com";

async function request(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      detail = data.detail || Object.values(data).flat().join(" ") || detail;
    } catch {
      // non-JSON error body, keep the default message
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  register: (username, email, password) =>
    request("/auth/users/", { method: "POST", body: { username, email, password } }),
  login: (username, password) =>
    request("/auth/jwt/create/", { method: "POST", body: { username, password } }),

  listMoods: (token) => request("/moods/", { token }),
  createMood: (token, payload) => request("/moods/", { method: "POST", token, body: payload }),

  listTasks: (token) => request("/tasklists/", { token }),
  createTask: (token, payload) => request("/tasklists/", { method: "POST", token, body: payload }),
  updateTask: (token, id, payload) =>
    request(`/tasklists/${id}/`, { method: "PATCH", token, body: payload }),
  deleteTask: (token, id) => request(`/tasklists/${id}/`, { method: "DELETE", token }),
};