// ============= RSVP FORM HANDLER =============
import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
  const rsvpForm = document.getElementById('rsvpForm');
  const successMessage = document.getElementById('successMessage');
  const formStatus = document.getElementById('formStatus');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(e) {
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
        eventName: guestData.eventName || '',
        eventType: guestData.eventType || '',
        eventDate: guestData.eventDate || '',
        eventTime: guestData.eventTime || '',
        eventLocation: guestData.eventLocation || '',
        createdAt: new Date().toISOString()
      };

      try {
        // Save to Firestore
        await addDoc(collection(db, 'rsvps'), rsvpData);
        console.log('RSVP saved to Firestore successfully');
        
        // Also save to localStorage as backup
        const local = JSON.parse(localStorage.getItem('rsvpsLocal') || '[]');
        local.push(rsvpData);
        localStorage.setItem('rsvpsLocal', JSON.stringify(local));
        
        // Hide form, show success
        rsvpForm.style.display = 'none';
        successMessage.style.display = 'block';
      } catch (error) {
        console.error('Error saving RSVP:', error);
        
        // Fallback to local storage only
        const local = JSON.parse(localStorage.getItem('rsvpsLocal') || '[]');
        local.push(rsvpData);
        localStorage.setItem('rsvpsLocal', JSON.stringify(local));
        
        // Still show success to user
        rsvpForm.style.display = 'none';
        successMessage.style.display = 'block';
      }
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
