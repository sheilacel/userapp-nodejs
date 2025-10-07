# 📱 User Management Application

Aplikasi manajemen pengguna sederhana berbasis web yang dibangun dengan Node.js, Express, dan PostgreSQL. Aplikasi ini memungkinkan pengguna untuk menambah, melihat, dan menghapus data pengguna beserta foto profil mereka.

## 🛠️ Teknologi Yang Digunakan

- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Railway)
- **Template Engine**: EJS
- **File Upload**: Multer
- **Environment**: dotenv
- **Deploy**: Railway

## 📦 Langkah Setup

### 1. Install Dependencies
```bash
npm install
```
### 2. Setup Database PostgreSQL di Railway

Buka https://railway.app dan login dengan GitHub
Klik "New Project"
Pilih "Provision PostgreSQL"
Tunggu hingga database selesai dibuat
Klik database → Tab "Variables" → Copy DATABASE_URL

Setelah database dibuat, table users akan otomatis dibuat saat aplikasi pertama kali dijalankan dengan struktur:
sqlCREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  profile_photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
### 3. Setup Environment Variables
Buat file .env di root project:
envDATABASE_URL=postgresql://postgres:password@host:5432/railway
PORT=3000
NODE_ENV=development
Ganti DATABASE_URL dengan URL yang Anda copy dari Railway.
### 4. Struktur Project
user-management-app/
├── uploads/              # Folder untuk foto profil
├── views/                # Template EJS
│   ├── index.ejs        # Halaman form input
│   └── users.ejs        # Halaman daftar user
├── server.js            # Main application
├── db.js                # Database configuration
├── .env                 # Environment variables
└── package.json         # Dependencies
### 5. File Konfigurasi
db.js - Untuk koneksi ke database PostgreSQL Railway
javascriptconst { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      profile_photo VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await pool.query(query);
    console.log('✅ Tabel users berhasil dibuat atau sudah ada');
  } catch (error) {
    console.error('❌ Error membuat tabel:', error);
  }
};

createTable();

module.exports = pool;
server.js - Main application dengan routes untuk CRUD operations
### 6. Jalankan Aplikasi
Development Mode:
bashnpm run dev
Production Mode:
bashnpm start
Manual:
bashnode server.js
Buka http://localhost:3000
### 7. Test Koneksi Database
Akses http://localhost:3000/test-db untuk memastikan koneksi database berhasil.
Response jika berhasil:
```bash
json{
  "success": true,
  "message": "Koneksi database berhasil!",
  "timestamp": "2025-01-15T10:30:45.123Z"
}
```