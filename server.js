const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');

// Konfigurasi Multer untuk upload file (DINONAKTIFKAN untuk Vercel)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'));
    }
  }
});

// Routes

// Halaman Home - Form Input
app.get('/', (req, res) => {
  res.render('index');
});

// Halaman Daftar Users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.render('users', { users: result.rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error mengambil data users');
  }
});

// API: Tambah User Baru (TANPA UPLOAD untuk Vercel)
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const profile_photo = null; // Tidak ada upload di Vercel
  
  try {
    const query = 'INSERT INTO users (name, email, profile_photo) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [name, email, profile_photo]);
    
    res.redirect('/users');
  } catch (error) {
    console.error('Error:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).send('Email sudah terdaftar!');
    } else {
      res.status(500).send('Error menyimpan data user');
    }
  }
});

// API: Get All Users (JSON)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil data users'
    });
  }
});

// API: Delete User
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error menghapus user'
    });
  }
});

// Test koneksi database
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Koneksi database berhasil!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Koneksi database gagal!',
      error: error.message
    });
  }
});

// Start server (HANYA untuk local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  });
}

// Export untuk Vercel (WAJIB!)
module.exports = app;