// ============= MODAL CONTROLS =============
import { auth, db } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
  const loginModal = document.getElementById('loginModal');
  const showLoginBtn = document.getElementById('showLoginModal');
  const getStartedBtn = document.getElementById('getStartedBtn');
  const closeModalBtn = document.getElementById('closeModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const adminEventsList = document.getElementById('adminEventsList');

  // Load events created by admin (stored in localStorage)
  function getEvents() {
    const saved = localStorage.getItem('events');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    // Fallback default
    return [{
      id: 'default',
      name: 'Wedding Celebration',
      type: 'Wedding',
      date: '2026-02-14',
      time: '18:00',
      location: 'Grand Ballroom, Celebration Street'
    }];
  }

  function getActiveEventId() {
    return localStorage.getItem('activeEventId') || '';
  }

  // Update admin events preview
  function updateAdminEventsPreview() {
    if (!adminEventsList) {
      console.log('adminEventsList element not found');
      return;
    }
    
    const events = getEvents();
    const activeId = getActiveEventId();
    
    console.log('Updating admin events preview:', events);
    
    if (events.length === 0 || (events.length === 1 && events[0].id === 'default')) {
      adminEventsList.innerHTML = `
        <div style="text-align: center; color: #9ca3af;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.6;">📝</div>
          <p style="margin: 0; font-size: 0.95rem; font-weight: 500; color: #6b7280;">No custom events yet</p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #9ca3af;">Create your first event in the dashboard!</p>
        </div>
      `;
      return;
    }
    
    const eventsHtml = events.map((evt, index) => {
      const isActive = evt.id === activeId;
      return `
        <div style="padding: 1rem; margin-bottom: 0.75rem; background: ${isActive ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'}; border-radius: 8px; border: 2px solid ${isActive ? '#28a745' : '#e9ecef'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.3s;">
          <div style="display: flex; align-items: start; gap: 0.75rem;">
            <div style="font-size: 1.8rem; flex-shrink: 0;">${isActive ? '⭐' : '🎊'}</div>
            <div style="flex: 1;">
              <div style="font-weight: 700; color: ${isActive ? '#155724' : '#1f2937'}; font-size: 1.05rem; margin-bottom: 0.4rem;">
                ${evt.name}
                ${isActive ? '<span style="background: #28a745; color: white; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; margin-left: 0.5rem; font-weight: 600;">ACTIVE</span>' : ''}
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.85rem; color: #6b7280;">
                <span style="display: flex; align-items: center; gap: 0.25rem;">
                  <span style="font-size: 1rem;">📌</span> ${evt.type}
                </span>
                <span style="display: flex; align-items: center; gap: 0.25rem;">
                  <span style="font-size: 1rem;">📅</span> ${evt.date}
                </span>
                <span style="display: flex; align-items: center; gap: 0.25rem;">
                  <span style="font-size: 1rem;">🕐</span> ${evt.time}
                </span>
              </div>
              <div style="margin-top: 0.4rem; font-size: 0.85rem; color: #6b7280; display: flex; align-items: center; gap: 0.25rem;">
                <span style="font-size: 1rem;">📍</span>
                <span style="font-weight: 500;">${evt.location}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    adminEventsList.innerHTML = eventsHtml || `
      <div style="text-align: center; color: #9ca3af; padding: 1rem;">
        <p style="margin: 0;">No events available</p>
      </div>
    `;
  }

  // Update preview on modal open and periodically
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
      loginModal.classList.add('active');
      setTimeout(updateAdminEventsPreview, 100);
    });
  }
  
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      loginModal.classList.add('active');
      setTimeout(updateAdminEventsPreview, 100);
    });
  }

  // Initial preview update
  setTimeout(updateAdminEventsPreview, 200);
  
  // Refresh every 2 seconds when modal is open
  setInterval(() => {
    if (loginModal && loginModal.classList.contains('active')) {
      updateAdminEventsPreview();
    }
  }, 2000);

  // Close modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
      loginModal.classList.remove('active');
    }
  });

  // ============= TAB SWITCHING =============
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const tabName = this.getAttribute('data-tab');
      
      // Remove active class from all tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      const targetTab = document.getElementById(tabName + 'Tab');
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });

  // ============= GUEST LOGIN FORM =============
  const guestLoginForm = document.getElementById('guestLoginForm');
  const guestStatus = document.getElementById('guestStatus');
  const eventSelection = document.getElementById('eventSelection');
  const eventTypeInput = document.getElementById('eventType');
  const eventNameInput = document.getElementById('eventName');
  const eventDateInput = document.getElementById('eventDate');
  const eventTimeInput = document.getElementById('eventTime');
  const eventLocationInput = document.getElementById('eventLocation');

  function populateEventSelect() {
    if (!eventSelection) return;
    const events = getEvents();
    const activeId = localStorage.getItem('activeEventId');
    eventSelection.innerHTML = '';
    events.forEach(evt => {
      const opt = document.createElement('option');
      opt.value = evt.id;
      opt.textContent = `${evt.name} — ${evt.date} ${evt.time}`;
      if (evt.id === activeId) opt.selected = true;
      eventSelection.appendChild(opt);
    });
    if (!eventSelection.value && events[0]) {
      eventSelection.value = events[0].id;
    }
    syncEventFields();
  }

  function syncEventFields() {
    const events = getEvents();
    const selected = events.find(e => e.id === eventSelection.value) || events[0];
    if (!selected) return;
    if (eventTypeInput) { eventTypeInput.value = selected.type; eventTypeInput.disabled = true; }
    if (eventNameInput) { eventNameInput.value = selected.name; eventNameInput.readOnly = true; }
    if (eventDateInput) { eventDateInput.value = selected.date; eventDateInput.readOnly = true; }
    if (eventTimeInput) { eventTimeInput.value = selected.time; eventTimeInput.readOnly = true; }
    if (eventLocationInput) { eventLocationInput.value = selected.location; eventLocationInput.readOnly = true; }
  }

  if (eventSelection) {
    populateEventSelect();
    eventSelection.addEventListener('change', syncEventFields);
  }

  if (guestLoginForm) {
    guestLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const guestName = document.getElementById('guestName').value.trim();
      const eventType = eventTypeInput ? eventTypeInput.value : '';
      const eventName = eventNameInput ? eventNameInput.value.trim() : '';
      const eventDate = eventDateInput ? eventDateInput.value : '';
      const eventTime = eventTimeInput ? eventTimeInput.value : '';
      const eventLocation = eventLocationInput ? eventLocationInput.value.trim() : '';
      const eventId = eventSelection ? eventSelection.value : '';

      if (!guestName || !eventType || !eventName || !eventDate || !eventTime || !eventLocation) {
        showStatus(guestStatus, 'Please fill in all fields', 'error');
        return;
      }

      // Store guest data
      const guestData = {
        guestName,
        eventType,
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        eventId,
        createdAt: new Date().toISOString(),
        role: 'guest'
      };
      
      // Store in sessionStorage for immediate use
      sessionStorage.setItem('guestData', JSON.stringify(guestData));
      sessionStorage.setItem('guestLoggedIn', 'true');

      // Save to Firebase if available
      if (db) {
        // Note: Firestore modular SDK would use different syntax, keeping this as placeholder
        showStatus(guestStatus, 'Access granted! Redirecting to event...', 'success');
        setTimeout(() => {
          loginModal.classList.remove('active');
          window.location.href = 'details.html';
        }, 1000);
      } else {
        showStatus(guestStatus, 'Access granted! Redirecting to event...', 'success');
        setTimeout(() => {
          loginModal.classList.remove('active');
          window.location.href = 'details.html';
        }, 1000);
      }
    });
  }

  // ============= ADMIN LOGIN / SIGNUP =============
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminStatus = document.getElementById('adminStatus');
  const adminConfirmGroup = document.getElementById('adminConfirmGroup');
  const adminSubmit = document.getElementById('adminSubmit');
  const adminModeButtons = document.querySelectorAll('.auth-mode-btn');
  const adminGoogleBtn = document.getElementById('adminGoogleBtn');
  let adminMode = 'signin';

  // Toggle between Sign In and Sign Up
  adminModeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      adminModeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adminMode = btn.getAttribute('data-mode');

      if (adminMode === 'signup') {
        adminConfirmGroup.style.display = 'block';
        adminSubmit.textContent = 'Create Admin Account';
        adminLoginForm.setAttribute('data-mode', 'signup');
      } else {
        adminConfirmGroup.style.display = 'none';
        adminSubmit.textContent = 'Access Dashboard';
        adminLoginForm.setAttribute('data-mode', 'signin');
      }
      updateAdminEventsPreview();
    });
  });

  // Handle admin form submit
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('adminEmail') ? document.getElementById('adminEmail').value.trim().toLowerCase() : '';
      const password = document.getElementById('adminPassword') ? document.getElementById('adminPassword').value.trim() : '';
      const confirmPassword = document.getElementById('adminConfirmPassword') ? document.getElementById('adminConfirmPassword').value.trim() : '';

      if (!email || !password) {
        showStatus(adminStatus, 'Please fill in email and password', 'error');
        return;
      }

      if (adminMode === 'signup') {
        if (!confirmPassword) {
          showStatus(adminStatus, 'Please confirm your password', 'error');
          return;
        }
        if (password !== confirmPassword) {
          showStatus(adminStatus, 'Passwords do not match', 'error');
          return;
        }
      }

      // Use Firebase Auth if available
      if (auth && createUserWithEmailAndPassword && signInWithEmailAndPassword) {
        if (adminMode === 'signup') {
          createUserWithEmailAndPassword(auth, email, password)
            .then((cred) => {
              sessionStorage.setItem('adminLoggedIn', 'true');
              sessionStorage.setItem('adminEmail', email);
              showStatus(adminStatus, 'Admin account created! Redirecting...', 'success');
              setTimeout(() => {
                if (loginModal) loginModal.classList.remove('active');
                window.location.href = 'dashboard.html';
              }, 800);
            })
            .catch((error) => {
              console.error('Firebase signup error:', error);
              if (error.code === 'auth/email-already-in-use') {
                showStatus(adminStatus, '✓ You already have an account! Please sign in instead.', 'success');
                // Switch to sign in mode
                adminModeButtons.forEach(b => b.classList.remove('active'));
                document.querySelector('[data-mode="signin"]').classList.add('active');
                adminMode = 'signin';
                adminConfirmGroup.style.display = 'none';
                adminSubmit.textContent = 'Access Dashboard';
                adminLoginForm.setAttribute('data-mode', 'signin');
              } else {
                showStatus(adminStatus, error.message || 'Signup failed', 'error');
              }
            });
        } else {
          signInWithEmailAndPassword(auth, email, password)
            .then(() => {
              sessionStorage.setItem('adminLoggedIn', 'true');
              sessionStorage.setItem('adminEmail', email);
              showStatus(adminStatus, 'Admin login successful! Redirecting...', 'success');
              setTimeout(() => {
                if (loginModal) loginModal.classList.remove('active');
                window.location.href = 'dashboard.html';
              }, 800);
            })
            .catch((error) => {
              console.error('Firebase signin error:', error);
              showStatus(adminStatus, error.message || 'Invalid credentials', 'error');
            });
        }
      } else {
        // Fallback to static credentials
        if (adminMode === 'signin' && (email === 'admin' || email === 'admin@local') && password === '1234') {
          sessionStorage.setItem('adminLoggedIn', 'true');
          sessionStorage.setItem('adminEmail', email);
          showStatus(adminStatus, 'Admin login successful! Redirecting...', 'success');
          setTimeout(() => {
            if (loginModal) loginModal.classList.remove('active');
            window.location.href = 'dashboard.html';
          }, 800);
        } else {
          showStatus(adminStatus, 'Invalid credentials. Use admin/1234', 'error');
        }
      }
    });
  }

  // Google Sign-In
  if (adminGoogleBtn) {
    let googleSignInInProgress = false;
    adminGoogleBtn.addEventListener('click', async () => {
      if (googleSignInInProgress) return; // debounce repeated clicks
      googleSignInInProgress = true;
      adminGoogleBtn.disabled = true;
      const originalText = adminGoogleBtn.textContent;
      adminGoogleBtn.textContent = 'Signing in…';

      if (!auth || !signInWithPopup || !GoogleAuthProvider) {
        showStatus(adminStatus, 'Firebase Authentication not enabled. Please enable it in Firebase Console or use fallback credentials (admin/1234)', 'error');
        adminGoogleBtn.disabled = false;
        adminGoogleBtn.textContent = originalText;
        googleSignInInProgress = false;
        return;
      }

      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const email = result.user && result.user.email ? result.user.email : 'google-user';
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', email);
        showStatus(adminStatus, 'Google sign-in successful! Redirecting...', 'success');
        setTimeout(() => {
          if (loginModal) loginModal.classList.remove('active');
          window.location.href = 'dashboard.html';
        }, 800);
      } catch (error) {
        console.error('Google sign-in error:', error);
        const code = error && error.code ? String(error.code) : '';
        if (code === 'auth/too-many-requests') {
          // Friendly guidance + fallback using redirect (reduces popup issues)
          showStatus(
            adminStatus,
            'Too many attempts detected. Please wait a few minutes or try the alternate sign-in. Switching to redirect…',
            'error'
          );
          try {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
          } catch (redirectErr) {
            console.error('Google redirect sign-in error:', redirectErr);
          }
        } else if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user') {
          showStatus(adminStatus, 'Popup was blocked/closed. Trying redirect sign-in…', 'error');
          try {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
          } catch (redirectErr) {
            console.error('Google redirect sign-in error:', redirectErr);
          }
        } else {
          showStatus(adminStatus, error.message || 'Google sign-in failed', 'error');
        }
      } finally {
        adminGoogleBtn.disabled = false;
        adminGoogleBtn.textContent = originalText;
        googleSignInInProgress = false;
      }
    });
  }

  // ============= STATUS MESSAGE HELPER =============
  function showStatus(element, message, type) {
    if (element) {
      element.className = `form-status ${type}`;
      element.textContent = type === 'error' ? '✗ ' + message : '✓ ' + message;
      element.style.display = 'block';
      setTimeout(() => {
        if (type === 'error') {
          element.style.display = 'none';
        }
      }, 5000);
    }
  }
});
