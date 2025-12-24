import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginStatus.textContent = "Login successful";
    loginStatus.style.color = "green";

    window.location.href = "dashboard.html";
  } catch (error) {
    loginStatus.textContent = error.message;
    loginStatus.style.color = "red";
  }
});
