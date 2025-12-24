// ============= DISPLAY EVENT DETAILS FROM SESSION =============
document.addEventListener('DOMContentLoaded', function() {
  // Get guest data from sessionStorage
  const guestDataStr = sessionStorage.getItem('guestData');
  
  if (!guestDataStr) {
    // If no guest data, redirect to home
    window.location.href = 'home.html';
    return;
  }

  const guestData = JSON.parse(guestDataStr);

  // Update page title and welcome message
  const eventNameDisplay = document.getElementById('eventNameDisplay');
  const guestWelcome = document.getElementById('guestWelcome');
  
  if (eventNameDisplay) {
    // Special styling for wedding events in hero
    if (guestData.eventType && guestData.eventType.toLowerCase() === 'wedding') {
      eventNameDisplay.innerHTML = `
        <span style="font-size: 1.2rem; color: rgba(255, 255, 255, 0.9); display: block; margin-bottom: 0.5rem; letter-spacing: 3px; text-transform: uppercase; font-weight: 400;">✨ Wedding Celebration ✨</span>
        <span style="display: block; font-size: 2.5rem; font-weight: 700; letter-spacing: 1px;">${guestData.eventName}</span>
        <span style="font-size: 2rem; display: block; margin-top: 1rem; animation: float 3s ease-in-out infinite;">💍 💐 🕊️</span>
        <style>
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        </style>
      `;
    } else {
      eventNameDisplay.textContent = guestData.eventName;
    }
  }
  
  if (guestWelcome) {
    guestWelcome.textContent = `Welcome, ${guestData.guestName}! Here are your event details`;
  }

  // Display event details
  const displayEventName = document.getElementById('displayEventName');
  const displayEventType = document.getElementById('displayEventType');
  const displayEventDate = document.getElementById('displayEventDate');
  const displayEventTime = document.getElementById('displayEventTime');
  const displayEventLocation = document.getElementById('displayEventLocation');

  if (displayEventName) {
    // Special styling for Wedding events
    if (guestData.eventType && guestData.eventType.toLowerCase() === 'wedding') {
      displayEventName.innerHTML = `
        <div style="text-align: center; padding: 1rem 0;">
          <div style="font-size: 1.2rem; color: #c06c84; margin-bottom: 0.5rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 500;">✨ Celebrating ✨</div>
          <strong style="font-size: 1.8rem; background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 50%, #ee4c7c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700; letter-spacing: 1px; display: block; margin: 0.5rem 0;">${guestData.eventName}</strong>
          <div style="font-size: 1.5rem; margin-top: 0.75rem;">💐 🕊️ 💐</div>
        </div>
      `;
    } else {
      displayEventName.innerHTML = `<strong>${guestData.eventName}</strong>`;
    }
  }

  if (displayEventType) {
    const typeFormatted = guestData.eventType.charAt(0).toUpperCase() + guestData.eventType.slice(1);
    
    // Special styling for Wedding events
    if (guestData.eventType.toLowerCase() === 'wedding') {
      displayEventType.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <span style="font-size: 2rem; animation: heartbeat 1.5s ease-in-out infinite;">💍</span>
          <strong style="font-size: 1.4rem; background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700; letter-spacing: 1px;">Wedding Celebration</strong>
          <span style="font-size: 2rem; animation: heartbeat 1.5s ease-in-out infinite 0.3s;">💕</span>
        </div>
        <style>
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.2); }
            50% { transform: scale(1); }
          }
        </style>
      `;
    } else {
      displayEventType.innerHTML = `<strong>${typeFormatted}</strong>`;
    }
  }

  if (displayEventDate) {
    const dateObj = new Date(guestData.eventDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    displayEventDate.innerHTML = `<strong>${formattedDate}</strong>`;
  }

  if (displayEventTime) {
    // Format time to 12-hour format
    const [hours, minutes] = guestData.eventTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    displayEventTime.textContent = `${displayHour}:${minutes} ${ampm}`;
  }

  if (displayEventLocation) {
    const defaultLocation = 'Andhra Pradesh, India';
    const locText = guestData.eventLocation && guestData.eventLocation.trim() ? guestData.eventLocation : defaultLocation;
    displayEventLocation.innerHTML = `<strong>${locText}</strong>`;
  }

  // Set details page map iframe if present (no API key required)
  const detailsMapFrame = document.getElementById('detailsMapFrame');
  if (detailsMapFrame) {
    detailsMapFrame.src = `https://maps.google.com/maps?q=Andhra%20Pradesh%2C%20India&z=7&output=embed`;
  }

  // Apply wedding theme styling to detail cards if it's a wedding
  if (guestData.eventType && guestData.eventType.toLowerCase() === 'wedding') {
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach((card, index) => {
      card.style.background = 'linear-gradient(135deg, #fff 0%, #fff5f8 100%)';
      card.style.borderImage = 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%) 1';
      card.style.boxShadow = '0 8px 20px rgba(255, 107, 157, 0.15)';
    });

    // Add decorative elements to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.style.background = 'linear-gradient(135deg, rgba(255, 107, 157, 0.08), rgba(192, 108, 132, 0.12), rgba(238, 76, 124, 0.08))';
    }
  }

  // ============= COUNTDOWN TIMER =============
  function updateMainCountdown() {
    const countdownElement = document.getElementById('mainCountdown');
    if (!countdownElement) return;

    // Combine date and time
    const eventDateTime = new Date(`${guestData.eventDate}T${guestData.eventTime}`).getTime();
    const now = new Date().getTime();
    const distance = eventDateTime - now;

    if (distance <= 0) {
      countdownElement.innerHTML = '<div class="countdown-text">Event is happening now!</div>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const boxes = countdownElement.querySelectorAll('.countdown-box-large');
    if (boxes.length === 4) {
      boxes[0].querySelector('.countdown-value-large').textContent = days;
      boxes[1].querySelector('.countdown-value-large').textContent = hours;
      boxes[2].querySelector('.countdown-value-large').textContent = minutes;
      boxes[3].querySelector('.countdown-value-large').textContent = seconds;
    }
  }

  // Update countdown immediately and then every second
  updateMainCountdown();
  setInterval(updateMainCountdown, 1000);

  // ============= VENUE MAP DISPLAY =============
  // Update venue information in sidebar if exists
  const venueNameEl = document.querySelector('.venue-name');
  const venueAddressEl = document.querySelector('.venue-address');
  
  if (venueNameEl && guestData.eventLocation) {
    venueNameEl.textContent = guestData.eventLocation;
  }
  
  if (venueAddressEl && guestData.eventLocation) {
    venueAddressEl.textContent = guestData.eventLocation;
  }

  // Update venue page link to include location data
  const venueLinks = document.querySelectorAll('a[href="venue.html"]');
  venueLinks.forEach(link => {
    link.href = `venue.html?location=${encodeURIComponent(guestData.eventLocation)}`;
  });

  // ============= ENABLE GUEST FEATURES =============
  // Make sure guest can access: RSVP, Gallery, Venue
  // Store event info for these pages
  sessionStorage.setItem('eventInfo', JSON.stringify({
    name: guestData.eventName,
    type: guestData.eventType,
    date: guestData.eventDate,
    time: guestData.eventTime,
    location: guestData.eventLocation
  }));
});
