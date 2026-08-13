const API_BASE = 'http://127.0.0.1:3001/api/v1';
const API_URL = `${API_BASE}/absences`;

// Elements
const form = document.getElementById('absence-form');
const list = document.getElementById('absence-list');
const status = document.getElementById('status');
const summary = document.getElementById('summary');
const resetButton = document.getElementById('reset-form');
const profileCard = document.getElementById('profile-card');
const profileName = document.getElementById('profile-name');
const logoutBtn = document.getElementById('logout-button');

const defaultValues = {
  title: 'Vacation',
  date: new Date().toISOString().slice(0, 10),
  startTime: '09:00',
  endTime: '17:00',
  reason: 'Personal time'
};

let currentUser = null;

function setStatus(message, isError = false) {
  if (!status) return;
  status.textContent = message;
  status.style.color = isError ? '#b91c1c' : '#166534';
}

function renderList(items) {
  if (!list) return;
  list.innerHTML = '';

  if (!items || !items.length) {
    list.innerHTML = '<li class="empty">No absence entries yet.</li>';
    if (summary) summary.textContent = '0 absences';
    return;
  }

  if (summary) summary.textContent = `${items.length} absence${items.length === 1 ? '' : 's'}`;

  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
        <strong>${item.title || 'Absence'}</strong>
        <span class="badge">${item.recurrence || 'none'}</span>
      </div>
      <div>${item.start || item.date} ${item.end && item.end !== item.start ? `to ${item.end}` : ''}</div>
      <div>${item.startTime || ''}${item.startTime && item.endTime ? ' - ' : ''}${item.endTime || ''}</div>
      <div>${item.reason || 'No reason provided.'}</div>
      <div class="meta">
        <span>Owner: ${item.collaboratorId || 'unknown'}</span>
        <button class="secondary" data-id="${item.id}" data-action="delete">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts });
  return res;
}

async function fetchAbsences() {
  try {
    const response = await fetch(API_URL, { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Unable to load absences');
    }
    const data = await response.json();
    renderList(data);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function refreshAuth() {
  try {
    const res = await apiFetch('/auth/me');
    if (res.ok) {
      currentUser = await res.json();
      showProfile();
      return true;
    } else {
      // not authenticated -> redirect to login page
      window.location.href = 'login.html';
      return false;
    }
  } catch (err) {
    window.location.href = 'login.html';
    return false;
  }
}

function showProfile() {
  if (!profileCard) return;
  profileCard.style.display = 'block';
  profileName.textContent = currentUser.fullName || currentUser.email;
  if (form) form.querySelectorAll('input,textarea,button').forEach((el) => (el.disabled = false));
}

async function createAbsence(event) {
  event.preventDefault();
  if (!currentUser) return setStatus('Please login to create an absence', true);

  const formData = new FormData(form);
  const payload = {
    title: formData.get('title') || defaultValues.title,
    date: formData.get('date') || defaultValues.date,
    start: formData.get('date') || defaultValues.date,
    end: formData.get('date') || defaultValues.date,
    startTime: formData.get('startTime') || defaultValues.startTime,
    endTime: formData.get('endTime') || defaultValues.endTime,
    reason: formData.get('reason') || defaultValues.reason,
    recurrence: formData.get('recurrence') || 'none'
  };

  try {
    const response = await apiFetch('/absences', { method: 'POST', body: JSON.stringify(payload) });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Unable to create absence');
    }

    form.reset();
    Object.entries(defaultValues).forEach(([key, value]) => {
      const element = form.elements.namedItem(key);
      if (element) element.value = value;
    });
    setStatus('Absence created successfully.');
    await fetchAbsences();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function deleteAbsence(id) {
  try {
    const response = await apiFetch(`/absences/${id}`, { method: 'DELETE' });
    if (!response.ok && response.status !== 204) {
      throw new Error('Unable to delete absence');
    }
    setStatus('Absence deleted.');
    await fetchAbsences();
  } catch (error) {
    setStatus(error.message, true);
  }
}

logoutBtn && logoutBtn.addEventListener('click', async () => {
  await apiFetch('/auth/logout', { method: 'POST' });
  window.location.href = 'login.html';
});

if (form) {
  form.addEventListener('submit', createAbsence);
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      form.reset();
      Object.entries(defaultValues).forEach(([key, value]) => {
        const element = form.elements.namedItem(key);
        if (element) element.value = value;
      });
    });
  }

  list.addEventListener('click', async (event) => {
    const deleteButton = event.target.closest('[data-action="delete"]');
    if (!deleteButton) return;
    await deleteAbsence(deleteButton.dataset.id);
  });

  Object.entries(defaultValues).forEach(([key, value]) => {
    const element = form.elements.namedItem(key);
    if (element) element.value = value;
  });
} else {
  // if no absence form in DOM, ensure list still handles delete via event delegation on document
  document.addEventListener('click', async (event) => {
    const deleteButton = event.target.closest && event.target.closest('[data-action="delete"]');
    if (!deleteButton) return;
    await deleteAbsence(deleteButton.dataset.id);
  });
}

(async () => {
  // on index (time management) ensure authenticated otherwise redirected
  await refreshAuth();
  await fetchAbsences();
})();
