import { registerUser } from "../js/auth.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const result = await registerUser(data);

  console.log(result);

  if (result.message === "Register berhasil") {
    alert("Berhasil daftar!");
  } else {
    alert(result.message);
  }
});