import { loginUser } from "../js/auth.js"; // path diperbaiki

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const result = await loginUser(data);

  if (result.message === "Login berhasil") {
    localStorage.setItem("user", JSON.stringify(result.user));
    alert("Login sukses!");
    window.location.href = "berandaDashboard.html";
  } else {
    alert(result.message || "Terjadi kesalahan saat login.");
  }
});

const result = await loginUser(data);

if (result.message === "Login berhasil") {
  // simpan user
  localStorage.setItem("user", JSON.stringify(result.user));

  // pindah ke dashboard
  window.location.href = "/dashboard.html";
} else {
  alert(result.message);
}
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  alert("Harus login dulu!");
  window.location.href = "/login.html";
}