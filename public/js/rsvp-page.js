// ============= RSVP FORM HANDLER =============
document.addEventListener('DOMContentLoaded', function() {
  const rsvpForm = document.getElementById('rsvpForm');
  const successMessage = document.getElementById('successMessage');
  const formStatus = document.getElementById('formStatus');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const guests = document.getElementById('guests').value;
      const attend = document.querySelector('input[name="attend"]:checked').value;
      const message = document.getElementById('message').value.trim();

      // Validate
      if (!name) {
        showError('Please enter your name');
        return;
      }

      // Prepare data (attach event info if present)
      const guestData = JSON.parse(sessionStorage.getItem('guestData') || '{}');
      const rsvpData = {
        name: name,
        guests: parseInt(guests),
        attend: attend === 'yes',
        message: message,
        eventName: guestData.eventName,
        eventType: guestData.eventType,
        eventDate: guestData.eventDate,
        eventTime: guestData.eventTime,
        eventLocation: guestData.eventLocation,
        createdAt: new Date().toISOString()
      };

      // Send to server
      fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rsvpData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Hide form, show success
          rsvpForm.style.display = 'none';
          successMessage.style.display = 'block';
        } else {
          // Fallback to local storage
          const local = JSON.parse(localStorage.getItem('rsvpsLocal') || '[]');
          local.push(rsvpData);
          localStorage.setItem('rsvpsLocal', JSON.stringify(local));
          rsvpForm.style.display = 'none';
          successMessage.style.display = 'block';
        }
      })
      .catch(error => {
        const local = JSON.parse(localStorage.getItem('rsvpsLocal') || '[]');
        local.push(rsvpData);
        localStorage.setItem('rsvpsLocal', JSON.stringify(local));
        rsvpForm.style.display = 'none';
        successMessage.style.display = 'block';
      });
    });
  }

  function showError(message) {
    if (formStatus) {
      formStatus.className = 'form-status error';
      formStatus.textContent = '✗ ' + message;
      formStatus.style.display = 'block';
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    }
  }
});
