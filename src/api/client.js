const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const message = payload.detail || payload.error || res.statusText;
    throw new Error(Array.isArray(message) ? message[0].msg : message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const TaskAPI = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/tasks/${q ? `?${q}` : ""}`);
  },
  create: (data) => request("/tasks/", { method: "POST", body: JSON.stringify(data) }),
  toggle: (id, completed) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify({ completed }) }),
  patch: (id, data) =>request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
