const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Field tidak lengkap" });
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

module.exports = {register, login};