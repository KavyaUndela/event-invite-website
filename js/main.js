/* =================== COUNTDOWN TIMER =================== */

const eventDate = new Date(2026, 1, 14, 18, 0, 0);

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate.getTime() - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =================== RSVP FORM HANDLING =================== */

const rsvpForm = document.getElementById("rsvpForm");
const statusEl = document.getElementById("rsvpStatus");

rsvpForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const guests = document.getElementById("guests").value;
  const attendRadio = document.querySelector('input[name="attend"]:checked');
  const attend = attendRadio ? attendRadio.value : "";
  const message = document.getElementById("message").value.trim();

  if (!name || !guests || !attend) {
    statusEl.textContent = "Please fill all required fields marked with *.";
    statusEl.style.color = "red";
    return;
  }

  statusEl.textContent = `Thank you, ${name}! Your RSVP has been recorded.`;
  statusEl.style.color = "green";

  console.log("RSVP Data:", {
    name,
    guests,
    attend,
    message,
  });

  rsvpForm.reset();
});
