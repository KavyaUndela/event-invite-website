// ============= SIDEBAR NAVIGATION =============
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const navItems = document.querySelectorAll('.nav-item');

  // Toggle sidebar open/close
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.add('open');
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', function() {
      sidebar.classList.remove('open');
    });
  }

  // Close sidebar when a nav item is clicked
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      sidebar.classList.remove('open');
    });
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', function(event) {
    if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
      sidebar.classList.remove('open');
    }
  });

  // Close sidebar on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      sidebar.classList.remove('open');
    }
  });

  // Mark current page as active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });

  // ============= COUNTDOWN TIMER =============
  function updateCountdown() {
    const countdownElement = document.getElementById('countdownTimer');
    if (!countdownElement) return;

    // Try to get guest event data first
    const guestData = JSON.parse(sessionStorage.getItem('guestData') || '{}');
    const eventInfo = JSON.parse(sessionStorage.getItem('eventInfo') || '{}');
    
    let eventDateTime;
    if (guestData.eventDate && guestData.eventTime) {
      eventDateTime = new Date(`${guestData.eventDate}T${guestData.eventTime}`).getTime();
    } else if (eventInfo.date && eventInfo.time) {
      eventDateTime = new Date(`${eventInfo.date}T${eventInfo.time}`).getTime();
    } else {
      // Default fallback date
      eventDateTime = new Date('2026-02-14T18:00:00').getTime();
    }

    const now = new Date().getTime();
    const distance = eventDateTime - now;

    if (distance <= 0) {
      countdownElement.innerHTML = '<div class="countdown-text">Event is here!</div>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
      <div class="countdown-box">
        <div class="countdown-value">${days}</div>
        <div class="countdown-label">Days</div>
      </div>
      <div class="countdown-box">
        <div class="countdown-value">${hours}</div>
        <div class="countdown-label">Hours</div>
      </div>
      <div class="countdown-box">
        <div class="countdown-value">${minutes}</div>
        <div class="countdown-label">Mins</div>
      </div>
      <div class="countdown-box">
        <div class="countdown-value">${seconds}</div>
        <div class="countdown-label">Secs</div>
      </div>
    `;
  }

  // Update countdown immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ============= GUEST LOGOUT BUTTON =============
  try {
    const guestData = JSON.parse(sessionStorage.getItem('guestData') || '{}');
    const navbar = document.querySelector('.site-header .navbar');

    if (navbar && guestData && guestData.guestName) {
      // Remove placeholder spacer if present
      const children = Array.from(navbar.children);
      const spacer = children.find(el => el.tagName === 'DIV' && el.getAttribute('style') && el.getAttribute('style').includes('width: 40px'));
      if (spacer) spacer.remove();

      // Inject logout button on the right
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'guestLogoutBtn';
      logoutBtn.className = 'btn dark';
      logoutBtn.textContent = 'Logout';
      navbar.appendChild(logoutBtn);

      logoutBtn.addEventListener('click', () => {
        // Clear guest session data
        sessionStorage.removeItem('guestData');
        sessionStorage.removeItem('eventInfo');
        localStorage.removeItem('activeEventId');
        // Redirect to landing
        window.location.href = 'index.html';
      });
    }
  } catch (e) {
    console.warn('Guest logout setup failed:', e);
  }
});
