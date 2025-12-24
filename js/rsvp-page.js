// ============= RSVP FORM HANDLER =============
import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

let firebaseReady = false;

// Check if Firebase is initialized
if (db) {
  firebaseReady = true;
  console.log('Firebase Firestore is ready');
} else {
  console.warn('Firebase Firestore is not initialized, will use localStorage only');
}

document.addEventListener('DOMContentLoaded', function() {
  const rsvpForm = document.getElementById('rsvpForm');
  const successMessage = document.getElementById('successMessage');
  const formStatus = document.getElementById('formStatus');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const guests = document.getElementById('guests').value;
      const attendRadio = document.querySelector('input[name="attend"]:checked');
      const message = document.getElementById('message').value.trim();

      // Validate name
      if (!name) {
        showError('Please enter your name');
        return;
      }

      // Validate attendance selection
      if (!attendRadio) {
        showError('Please select whether you can attend');
        return;
      }

      const attend = attendRadio.value;

      // Prepare data (attach event info if present)
      const guestData = JSON.parse(sessionStorage.getItem('guestData') || '{}');
      const rsvpData = {
        name: name,
        guests: parseInt(guests) || 1,
        attend: attend === 'yes',
        message: message,
        eventName: guestData.eventName || 'Default Event',
        eventType: guestData.eventType || '',
        eventDate: guestData.eventDate || '',
        eventTime: guestData.eventTime || '',
        eventLocation: guestData.eventLocation || '',
        createdAt: new Date().toISOString()
      };

      try {
        let savedToFirestore = false;
        if (firebaseReady && db) {
          try {
            // Save to Firestore
            await addDoc(collection(db, 'rsvps'), rsvpData);
            console.log('✓ RSVP saved to Firestore successfully');
            savedToFirestore = true;
          } catch (firestoreError) {
            console.error('✗ Firestore save failed:', firestoreError);
            console.log('Falling back to localStorage only');
          }
        } else {
          console.warn('Firebase not ready, using localStorage only');
        }
        
        // Always save to localStorage as backup
        const local = JSON.parse(localStorage.getItem('rsvpsLocal') || '[]');
        local.push(rsvpData);
        localStorage.setItem('rsvpsLocal', JSON.stringify(local));
        console.log('✓ RSVP saved to localStorage');
        
        // Hide form, show success
        rsvpForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Log confirmation
        console.log('✓ RSVP submitted successfully!', rsvpData);
      } catch (error) {
        console.error('✗ Error in RSVP submission:', error);
        
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
