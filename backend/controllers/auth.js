const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex =/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedDomains = [
  "greenmarket.com"
];


const register = async (req, res) => {
  try {
      const { username, email, password, confirmPassword } = req.body;
      const emailDomain = email.split("@")[1];
      if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Field tidak lengkap" });
      }

      if(username.length < 5 || username.length > 30){
        return res.status(400).json({ message: "Username harus antara 5-30 karakter" });
      }

      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Username hanya boleh mengandung huruf, angka, dan underscore" });
      }

      if(password.length < 8){
        return res.status(400).json({ message: "Password minimal 8 karakter" });
      }
      if(password !== confirmPassword){
        return res.status(400).json({ message: "Password dan konfirmasi password tidak cocok" });
      }

      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password harus mengandung setidaknya satu huruf besar, satu huruf kecil, dan satu angka" });
      }

      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Format email tidak valid" });
      }
      if (!allowedDomains.includes(emailDomain)) {
        return res.status(400).json({ message: "Email harus menggunakan domain yang valid" });
      }  
  
      const checkUser = await prisma.user.findUnique({ where: { email } });
      if (checkUser) return res.status(400).json({ message: "Email sudah terdaftar" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { username, email, password: hashedPassword, role: 'BUYER' }
      });
  
      res.json({ message: "Register berhasil", user: newUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", detail: err.message });
    }
  };

const loginGuest = async (req, res) => {
  try {
    let guest = await prisma.user.findUnique({
      where: {
        email: "guest@greenmarket.local",
      },
    });

    if (!guest) {
      guest = await prisma.user.create({
        data: {
          username: "Guest User",
          email: "guest@greenmarket.local",
          password: "guest-no-login",
          role: "GUEST",
        },
      });
    }

    res.json({
      message: "Masuk sebagai guest berhasil",
      user: {
        id: guest.id,
        username: guest.username,
        email: guest.email,
        role: guest.role,
      },
    });
  } catch (error) {
    console.error("Error login guest:", error);
    res.status(500).json({
      message: "Gagal masuk sebagai guest",
      detail: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) return res.status(400).json({ message: "Email tidak ditemukan" });
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Password salah" });
  
      res.json({
        message: "Login berhasil",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", detail: err.message });
    }
  };

module.exports = {register, login, loginGuest};