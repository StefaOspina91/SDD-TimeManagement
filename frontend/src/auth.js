const API_BASE = 'http://127.0.0.1:3001/api/v1';

async function apiFetch(path, opts = {}) {
  return fetch(`${API_BASE}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts });
}

// Login form handler — on success redirect to time management (index.html)
async function bindLogin(formId) {
  const form = document.getElementById(formId);
  const status = document.getElementById('status');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email: data.email, password: data.password, remember: !!data.remember }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        status && (status.textContent = body.error || 'Login failed');
        return;
      }
      // success — go to time management
      window.location.href = 'index.html';
    } catch (err) {
      status && (status.textContent = err.message || 'Network error');
    }
  });
}

// Register form handler — on success redirect to login page
async function bindRegister(formId) {
  const form = document.getElementById(formId);
  const status = document.getElementById('status');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        status && (status.textContent = body.error || 'Registration failed');
        return;
      }
      // per spec: after create return to login page
      window.location.href = 'login.html';
    } catch (err) {
      status && (status.textContent = err.message || 'Network error');
    }
  });
}

// Populate allowed domains element if present
async function loadAllowedDomains() {
  const el = document.getElementById('allowed-domains');
  if (!el) return;
  try {
    const res = await apiFetch('/auth/allowed-domains');
    if (!res.ok) return;
    const body = await res.json();
    el.textContent = (body.allowedDomains || []).join(', ');
  } catch (e) {
    // ignore
  }
}

// Auto-bind when this script is loaded on login/register pages
document.addEventListener('DOMContentLoaded', () => {
  loadAllowedDomains();
  bindLogin('login-form-el');
  bindRegister('register-form-el');
});
