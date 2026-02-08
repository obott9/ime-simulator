import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function getAuthHeaders() {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  getDefaultPresets: () => request('/presets/default'),
  getPopularPresets: () => request('/presets/popular'),
  getMyPresets: () => request('/presets/mine'),
  getMyLikes: () => request('/presets/likes'),
  getPresetByShareCode: (code) => request(`/presets/share/${code}`),
  getPreset: (id) => request(`/presets/${id}`),

  createPreset: (name, settings) =>
    request('/presets', {
      method: 'POST',
      body: JSON.stringify({ name, settings }),
    }),

  updatePreset: (id, name, settings) =>
    request(`/presets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, settings }),
    }),

  deletePreset: (id) =>
    request(`/presets/${id}`, { method: 'DELETE' }),

  sharePreset: (id) =>
    request(`/presets/${id}/share`, { method: 'POST' }),

  toggleLike: (id) =>
    request(`/presets/${id}/like`, { method: 'POST' }),
};
