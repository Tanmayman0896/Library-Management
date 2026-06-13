const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('deskguard_token');
}

async function req(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────
export async function login(email, password) {
  const data = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('deskguard_token', data.token);
  localStorage.setItem('deskguard_user', JSON.stringify(data.user));
  sessionStorage.setItem('deskguard_session', '1');
  return data;
}

export async function register(email, password, name) {
  const data = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  localStorage.setItem('deskguard_token', data.token);
  localStorage.setItem('deskguard_user', JSON.stringify(data.user));
  sessionStorage.setItem('deskguard_session', '1');
  return data;
}

export function logout() {
  localStorage.removeItem('deskguard_token');
  localStorage.removeItem('deskguard_user');
  sessionStorage.removeItem('deskguard_session');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('deskguard_user')); } catch { return null; }
}

// ── Desks ─────────────────────────────────────────────────────────────
export const getDesks = () => req('/desks');
export const getDesk = (id) => req(`/desks/${id}`);
export const checkin = (deskLabel) => req('/desks/checkin', { method: 'POST', body: JSON.stringify({ deskLabel }) });

// ── Sessions ──────────────────────────────────────────────────────────
export const getActiveSession = () => req('/sessions/active');
export const getSessionHistory = () => req('/sessions/history');
export const markAway = () => req('/sessions/away', { method: 'POST' });
export const markBack = () => req('/sessions/back', { method: 'POST' });
export const confirmPresence = () => req('/sessions/confirm', { method: 'POST' });
export const endSession = () => req('/sessions/end', { method: 'POST' });

// ── Admin ─────────────────────────────────────────────────────────────
export const getAbandonedDesks = () => req('/admin/abandoned');
export const getAdminDesks = () => req('/admin/desks');
export const resetDesk = (deskId) => req(`/admin/reset/${deskId}`, { method: 'POST' });
export const getStats = () => req('/admin/stats');
