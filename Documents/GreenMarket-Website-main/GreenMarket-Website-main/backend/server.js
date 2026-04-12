    const express = require('express');
    const cors = require('cors');
    const mysql = require('mysql2');

    const app = express();
    app.use(cors());
    app.use(express.json());

    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',      
        password: '',      
        database: 'greenmarket_users' 
    });


    db.connect((err) => {
        if (err) {
            console.error('Gagal koneksi ke database:', err.message);
            return;
        }
        console.log('Berhasil terhubung ke database MySQL');
    });

    app.post('/api/register', (req, res) => {
        const { nama_lengkap, email, password } = req.body;

        const role = 'buyer';

        const checkUser = "SELECT * FROM users WHERE email = ?";
        db.query(checkUser, [email], (err, results) => {
            if (err) {
                return res.status(500).json({message : 'Error checking user'});
            }
            if (results.length > 0) {
                return res.status(400).json({message : 'Email Sudah Terdaftar'});
            }

            const sql = "INSERT INTO users (nama_lengkap, email, password, role) VALUES (?, ?, ?, ?)";
            db.query(sql, [nama_lengkap, email, password, role], (err, result) => {
                if (err) {
                    return res.status(500).json({message : 'Gagal menyimpan data ke MySQL'});
                }
                res.status(201).json({message : 'Registrasi berhasil Daftar sebagai Buyer'});
            });
        });
    });

    app.post('/api/login', (req, res) => {
        const { email, password } = req.body;

        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        db.query(sql, [email, password], (err, results) => {
            if (err) {
            return res.status(500).json({ message: 'Error pada server saat login' });
        }

        if (results.length > 0) {
            // Jika data ditemukan
            const user = results[0];
            res.json({
                message: 'Login Berhasil!',
                user: user 
            });
        } else {
            // Jika data tidak ditemukan
            res.status(401).json({ message: 'Email atau Kata Sandi salah!' });
        }
    });
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
