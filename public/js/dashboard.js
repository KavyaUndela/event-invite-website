import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Utility helpers
const byId = (id) => document.getElementById(id);
const loadEvents = () => JSON.parse(localStorage.getItem('events') || '[]');
const saveEvents = (events) => localStorage.setItem('events', JSON.stringify(events));
const setActiveEventId = (id) => localStorage.setItem('activeEventId', id || '');
const getActiveEventId = () => localStorage.getItem('activeEventId') || '';

// Check authentication status
onAuthStateChanged(auth, (user) => {
  const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');
  if (!user && !isAdminLoggedIn) {
    console.log('No user authenticated, redirecting to home');
    window.location.href = "index.html";
  } else {
    console.log('User authenticated or admin session exists');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = byId('logoutBtn');
  const refreshBtn = byId('refreshBtn');
  const eventForm = byId('eventForm');
  const resetEventForm = byId('resetEventForm');
  const eventList = byId('eventList');
  const eventFormStatus = byId('eventFormStatus');

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      console.log('Logout button clicked');
      try {
        // Clear session first to prevent auth check redirect
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        sessionStorage.removeItem('guestData');
        sessionStorage.removeItem('eventInfo');
        localStorage.removeItem('activeEventId');
        
        // Then sign out from Firebase
        if (auth && auth.currentUser) {
          await signOut(auth);
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        window.location.href = 'index.html';
      }
    });
  }

  // Fetch RSVPs
  async function loadRsvps() {
    const loading = byId('loadingState');
    const empty = byId('emptyState');
    const tableWrapper = byId('tableWrapper');
    const tbody = byId('rsvpTableBody');
    const errorMessage = byId('errorMessage');
    const totalCount = byId('totalCount');
    const attendingCount = byId('attendingCount');
    const notAttendingCount = byId('notAttendingCount');
    const totalGuests = byId('totalGuests');

    if (loading) loading.textContent = 'Loading RSVPs...';
    if (errorMessage) errorMessage.style.display = 'none';

    let list = [];
    try {
      // Fetch from Firestore
      const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Loaded ${list.length} RSVPs from Firestore`);

      // If Firestore is empty, try localStorage as fallback
      if (list.length === 0) {
        list = JSON.parse(localStorage.getItem('rsvpsLocal') || '[]');
        console.log(`Loaded ${list.length} RSVPs from localStorage`);
      }

      if (empty) empty.style.display = 'none';
      if (tableWrapper) tableWrapper.style.display = 'block';
      tbody.innerHTML = '';

      let attending = 0;
      let guestsTotal = 0;

      list.forEach(item => {
        const row = document.createElement('tr');
        const attendingYes = item.attend === true || item.attend === 'yes';
        if (attendingYes) attending += 1;
        guestsTotal += Number(item.guests || 0);

        row.innerHTML = `
          <td><strong>${item.name || ''}</strong>${item.eventName ? `<br><small style="color:#6b7280;">Event: ${item.eventName}</small>` : ''}</td>
          <td>${item.guests || 0}</td>
          <td><span class="badge ${attendingYes ? 'badge-yes' : 'badge-no'}">${attendingYes ? '✓ Yes' : '✗ No'}</span></td>
          <td>${item.message || '-'}</td>
          <td>${item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
        `;
        tbody.appendChild(row);
      });

      totalCount.textContent = list.length;
      attendingCount.textContent = attending;
      notAttendingCount.textContent = list.length - attending;
      totalGuests.textContent = guestsTotal;
    } catch (err) {
      console.error('RSVP load error', err);
      
      // Fallback to localStorage on error
      list = JSON.parse(localStorage.getItem('rsvpsLocal') || '[]');
      console.log(`Error loading from Firestore, using ${list.length} local RSVPs`);
      
      if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Using cached RSVPs. Check Firebase connection.';
      }
      
      // Still render the local data
      if (list.length > 0 && tbody) {
        if (empty) empty.style.display = 'none';
        if (tableWrapper) tableWrapper.style.display = 'block';
        tbody.innerHTML = '';

        let attending = 0;
        let guestsTotal = 0;

        list.forEach(item => {
          const row = document.createElement('tr');
          const attendingYes = item.attend === true || item.attend === 'yes';
          if (attendingYes) attending += 1;
          guestsTotal += Number(item.guests || 0);

          row.innerHTML = `
            <td><strong>${item.name || ''}</strong>${item.eventName ? `<br><small style="color:#6b7280;">Event: ${item.eventName}</small>` : ''}</td>
            <td>${item.guests || 0}</td>
            <td><span class="badge ${attendingYes ? 'badge-yes' : 'badge-no'}">${attendingYes ? '✓ Yes' : '✗ No'}</span></td>
            <td>${item.message || '-'}</td>
            <td>${item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
          `;
          tbody.appendChild(row);
        });

        totalCount.textContent = list.length;
        attendingCount.textContent = attending;
        notAttendingCount.textContent = list.length - attending;
        totalGuests.textContent = guestsTotal;
      }
    } finally {
      if (loading) loading.textContent = '';
    }
  }

  if (refreshBtn) refreshBtn.addEventListener('click', loadRsvps);

  // Event form
  function renderEvents() {
    if (!eventList) return;
    const events = loadEvents();
    const activeId = getActiveEventId();

    if (events.length === 0) {
      eventList.innerHTML = '<p class="empty-state" style="padding:1rem; margin:0;">No events yet. Create one above.</p>';
      return;
    }

    const rows = events.map(evt => {
      const isActive = evt.id === activeId;
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:1rem; border-bottom:1px solid #e5e7eb; gap:0.75rem; background: ${isActive ? 'linear-gradient(to right, #e8f5e9, #f1f8e9)' : 'transparent'}; border-radius: 8px; margin-bottom: 0.5rem;">
          <div style="flex: 1;">
            <div style="font-weight:700; color:#111827; font-size: 1.1rem; margin-bottom: 0.25rem;">🎊 ${evt.name}</div>
            <div style="color:#6b7280; font-size:0.9rem; display: flex; flex-wrap: wrap; gap: 0.75rem;">
              <span>📌 ${evt.type}</span>
              <span>📅 ${evt.date}</span>
              <span>🕐 ${evt.time}</span>
              <span>📍 ${evt.location}</span>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-shrink: 0;">
            ${isActive ? '<span class="badge badge-yes" style="font-size: 0.85rem; padding: 0.5rem 0.9rem;">⭐ Active</span>' : ''}
            <button data-id="${evt.id}" class="btn subtle set-active-btn" style="padding:0.6rem 1.2rem; white-space: nowrap; ${isActive ? 'opacity: 0.5; cursor: not-allowed;' : ''}">Set Active</button>
          </div>
        </div>
      `;
    }).join('');

    eventList.innerHTML = rows;

    // Wire buttons
    eventList.querySelectorAll('.set-active-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        setActiveEventId(id);
        sessionStorage.setItem('eventInfo', JSON.stringify(events.find(e => e.id === id) || {}));
        renderEvents();
      });
    });
  }

  function showEventStatus(msg, type='success') {
    if (!eventFormStatus) return;
    eventFormStatus.className = `form-status ${type}`;
    eventFormStatus.textContent = (type === 'error' ? '✗ ' : '✓ ') + msg;
    eventFormStatus.style.display = 'block';
    setTimeout(() => eventFormStatus.style.display = 'none', 4000);
  }

  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = byId('eventNameAdmin').value.trim();
      const type = byId('eventTypeAdmin').value;
      const date = byId('eventDateAdmin').value;
      const time = byId('eventTimeAdmin').value;
      const location = byId('eventLocationAdmin').value.trim();

      if (!name || !type || !date || !time || !location) {
        showEventStatus('Please fill all event fields', 'error');
        return;
      }

      const events = loadEvents();
      const id = Date.now().toString();
      const newEvent = { id, name, type, date, time, location };
      events.push(newEvent);
      saveEvents(events);
      setActiveEventId(id);
      sessionStorage.setItem('eventInfo', JSON.stringify(newEvent));
      showEventStatus('Event saved and set active');
      renderEvents();
    });
  }

  if (resetEventForm) {
    resetEventForm.addEventListener('click', () => {
      eventForm.reset();
      showEventStatus('Form cleared', 'success');
    });
  }

  // Initial load
  renderEvents();
  loadRsvps();
});
