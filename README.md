# 🚀 Panduan Lengkap Deploy Aplikasi Node.js + PostgreSQL di Railway

Dokumentasi ini menjelaskan langkah demi langkah cara membuat, mengatur, dan mendeploy aplikasi Node.js dengan database PostgreSQL menggunakan platform **Railway**.

---

## 📍 1. Persiapan Database PostgreSQL di Railway

### 1.1 Buat Akun & Project
1. Buka [https://railway.app](https://railway.app)
2. Login menggunakan akun GitHub
3. Klik **New Project**
4. Pilih **Provision PostgreSQL**

Railway akan otomatis membuat database PostgreSQL untuk Anda.

### 1.2 Ambil Database URL
1. Klik service **PostgreSQL** yang baru dibuat  
2. Buka tab **Variables**  
3. Salin nilai `DATABASE_URL` (contoh:  
   `postgresql://user:password@host:port/database`)  
4. Simpan untuk digunakan nanti

---

## 💻 2. Setup Project di VS Code

### 2.1 Buat Folder Project
```bash
mkdir railway-app
cd railway-app
2.2 Buka di VS Code
bash
Salin kode
code .
2.3 Inisialisasi Project Node.js
bash
Salin kode
npm init -y
2.4 Install Dependencies
bash
Salin kode
npm install express pg multer dotenv ejs
Keterangan:

express → Web framework utama

pg → PostgreSQL client

multer → Upload file

dotenv → Environment variables

ejs → Template engine untuk views

🗂️ 3. Struktur Folder Project
bash
Salin kode
railway-app/
│
├── uploads/              # Folder untuk menyimpan foto
├── views/
│   └── index.ejs         # Halaman utama
├── .env                  # Variabel environment
├── .gitignore            # File yang diabaikan Git
├── server.js             # File utama aplikasi
├── package.json          # Konfigurasi & dependencies
└── README.md             # Dokumentasi
⚙️ 4. Konfigurasi File
4.1 .env
env
Salin kode
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
STORAGE_PATH=./uploads
Ganti DATABASE_URL dengan URL dari Railway Anda.

4.2 .gitignore
bash
Salin kode
node_modules/
.env
uploads/*
!uploads/.gitkeep
4.3 Tambahkan .gitkeep
bash
Salin kode
mkdir uploads
touch uploads/.gitkeep
🖥️ 5. Buat File server.js
js
Salin kode
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.STORAGE_PATH || './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Endpoint utama
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
  res.render('index', { users: result.rows });
});

// Form tambah user
app.post('/add', upload.single('photo'), async (req, res) => {
  const { name, email } = req.body;
  const photo = req.file ? req.file.filename : null;
  await pool.query('INSERT INTO users (name, email, photo) VALUES ($1, $2, $3)', [name, email, photo]);
  res.redirect('/');
});

// Test koneksi database
app.get('/test-db', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ success: true, message: '✅ Koneksi database berhasil!', timestamp: new Date() });
  } catch (err) {
    res.json({ success: false, message: '❌ Gagal koneksi database', error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
🧩 6. Update package.json
Tambahkan script berikut:

json
Salin kode
"scripts": {
  "start": "node server.js",
  "dev": "node server.js"
}
🧪 7. Test Lokal
bash
Salin kode
npm start
Buka browser:

arduino
Salin kode
http://localhost:3000
✅ Halaman terbuka
✅ Tambah user & upload foto
✅ Data tersimpan di database
✅ Foto tampil di halaman

☁️ 8. Upload ke GitHub
bash
Salin kode
git init
git add .
git commit -m "Initial commit: Railway app with PostgreSQL"
git remote add origin https://github.com/username/railway-app.git
git branch -M main
git push -u origin main
Ganti username dengan username GitHub Anda.

🚀 9. Deploy ke Railway
9.1 Deploy dari GitHub
Buka Railway

Klik New Project → Deploy from GitHub repo

Pilih repository railway-app

Railway akan otomatis build dan deploy

9.2 Hubungkan Database
Di dashboard, pilih service railway-app

Tab Variables → + New Variable → Add Reference

Pilih PostgreSQL → DATABASE_URL

9.3 Tambahkan Variable Tambahan
ini
Salin kode
STORAGE_PATH=./uploads
9.4 Generate Domain Publik
Tab Settings → Networking → Generate Domain

Dapatkan URL publik (contoh):

arduino
Salin kode
https://railway-app-production-xxxx.up.railway.app
🌐 10. Test Aplikasi Online
Buka URL Railway:

arduino
Salin kode
https://railway-app-production-xxxx.up.railway.app
Test koneksi database:

bash
Salin kode
/test-db
Response:

json
Salin kode
{
  "success": true,
  "message": "✅ Koneksi database berhasil!",
  "timestamp": "2025-10-07T12:00:00.000Z"
}
🔁 11. Update Aplikasi
Setiap kali ada perubahan:

bash
Salin kode
git add .
git commit -m "Update fitur baru"
git push
Railway akan otomatis redeploy.
