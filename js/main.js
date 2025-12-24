/* ===== Mobile Nav Toggle ===== */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar")) {
      navLinks.classList.remove("open");
    }
  });
}

/* ===== Countdown Timer ===== */
const eventDate = new Date(2026, 1, 14, 18, 0, 0); // 14 Feb 2026, 6:00 PM

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate.getTime() - now;

  const daysEl = document.querySelector("[data-countdown='days']");
  const hoursEl = document.querySelector("[data-countdown='hours']");
  const minutesEl = document.querySelector("[data-countdown='minutes']");
  const secondsEl = document.querySelector("[data-countdown='seconds']");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

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

/* ===== RSVP Form Handler ===== */
const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const guests = document.getElementById("guests")?.value || "";
    const attendRadio = document.querySelector('input[name="attend"]:checked');
    const attend = attendRadio ? attendRadio.value : "";
    const message = document.getElementById("message")?.value.trim() || "";

    const statusEl = document.getElementById("rsvpStatus");

    if (!name || !guests || !attend) {
      if (statusEl) {
        statusEl.textContent = "Please fill all required fields marked with *";
        statusEl.classList.remove("success");
        statusEl.classList.add("error");
      }
      return;
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, guests, attend, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit RSVP");
      }

      if (statusEl) {
        statusEl.textContent = `✓ Thank you, ${name}! Your RSVP has been received.`;
        statusEl.classList.remove("error");
        statusEl.classList.add("success");
      }

      rsvpForm.reset();
    } catch (err) {
      console.error("RSVP error:", err);
      if (statusEl) {
        statusEl.textContent = "Unable to submit RSVP. Please try again.";
        statusEl.classList.remove("success");
        statusEl.classList.add("error");
      }
    }
  });
}

/* ===== Login Form Handler ===== */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username")?.value.trim() || "";
    const password = document.getElementById("password")?.value || "";
    const statusEl = document.getElementById("loginStatus");

    if (!username || !password) {
      if (statusEl) {
        statusEl.textContent = "Please enter both username and password";
        statusEl.classList.remove("success");
        statusEl.classList.add("error");
      }
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      if (statusEl) {
        statusEl.textContent = "✓ Login successful! Redirecting...";
        statusEl.classList.remove("error");
        statusEl.classList.add("success");
      }

      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      if (statusEl) {
        statusEl.textContent = err.message || "Invalid username or password";
        statusEl.classList.remove("success");
        statusEl.classList.add("error");
      }
    }
  });
}
