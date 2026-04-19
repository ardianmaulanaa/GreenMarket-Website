import express, { Request, Response } from "express"; //
import { prisma } from "../lib/prisma";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validasi input
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Semua field wajib diisi"
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah terdaftar"
      });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password
      }
    });

    return res.status(201).json({
      message: "Register berhasil",
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error
    });
  }
});

export default router;