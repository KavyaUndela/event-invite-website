const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    loginStatus.textContent = "Please enter both username and password.";
    loginStatus.className = "error";
    return;
  }

  loginStatus.textContent = "Logging in...";
  loginStatus.className = "";
  loginStatus.style.color = "#666";

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      loginStatus.textContent = data.message || "Login failed.";
      loginStatus.className = "error";
      return;
    }

    loginStatus.textContent = "Login successful! Redirecting...";
    loginStatus.className = "success";

    // Redirect to dashboard (or index for now)
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  } catch (err) {
    console.error("Login error:", err);
    loginStatus.textContent = "Server error. Please try again.";
    loginStatus.className = "error";
  }
});


