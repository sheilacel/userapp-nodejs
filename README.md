# 🚀 Studi Kasus: Koneksi Node.js dengan PostgreSQL di Railway

Panduan lengkap untuk membuat aplikasi **Node.js** yang terhubung ke **PostgreSQL** menggunakan layanan **Railway**.  
Dilengkapi dengan langkah setup, konfigurasi, dan deployment ke GitHub.

---

## 📌 1. Persiapan Database PostgreSQL di Railway

### 1.1 Buat Akun & Project
1. Buka [https://railway.app](https://railway.app)
2. Login menggunakan akun **GitHub**
3. Klik **New Project**
4. Pilih **Provision PostgreSQL**

> Railway akan otomatis membuat database PostgreSQL untuk Anda.

### 1.2 Ambil Database URL
1. Klik service **PostgreSQL** yang baru dibuat  
2. Buka tab **Variables**  
3. Salin nilai dari **DATABASE_URL**
```bash
contoh:
postgresql://user:password@host:port/database
```
4. Simpan URL ini untuk digunakan nanti di file `.env`

---

## 💻 2. Setup Project di VS Code

### 2.1 Buat Folder Project
```bash
mkdir userapp-nodejs
cd userapp-nodejs
code .
```
### 2.2 Inisialisasi Project
```bash
Salin kode
npm init -y
```
### 2.3 Install Dependencies
```bash
Salin kode
npm install express multer pg dotenv
```
## ⚙️ 3. Konfigurasi Database & Environment
### 3.1 Buat File .env
```bash
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
```
### 3.2 Buat File .gitignore
```bash
node_modules/
.env
uploads/
```
### 3.3 Buat File db.js
```bash
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
```
## 🧠 4. Buat Server Express
### 4.1 File server.js
```bash
const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Route Utama
app.get('/', (req, res) => {
  res.send('Server berjalan dan terhubung dengan PostgreSQL!');
});

// Route Cek Database
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Koneksi database berhasil!', waktu: result.rows[0] });
  } catch (err) {
    res.status(500).send('Koneksi database gagal: ' + err.message);
  }
});

// Route Upload File
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File berhasil diupload!', file: req.file });
});

// Jalankan Server
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
```
## 🧩 5. Struktur Folder Akhir
```bash
userapp-nodejs/
│
├── db.js
├── server.js
├── .env
├── .gitignore
├── package.json
├── uploads/
└── README.md
```
## 🧪 6. Jalankan Aplikasi Secara Lokal
### 6.1 Jalankan Server
```bash
node server.js
```
### 6.2 Akses di Browser
```bash
http://localhost:8000
```
### 6.3 Tes Endpoint
1. GET / → Cek server aktif
2. GET /test-db → Cek koneksi PostgreSQL
3. POST /upload → Upload file (gunakan Postman)

## 🌐 7. Upload Project ke GitHub
### 7.1 Inisialisasi Git
```bash
git init
git add .
git commit -m "Initial commit - koneksi PostgreSQL via Railway"
```
### 7.2 Tambahkan Remote dan Push
```bash
git branch -M main
git remote add origin https://github.com/username/namarepo.git
git push -u origin main
```
Jika muncul error “fetch first”, gunakan:

```bash
git pull origin main --rebase
git push -u origin main
```
---

### 🚀 8. Deploy ke Railway
1. Login ke https://railway.app
2. Klik New Project → Deploy from GitHub repo
3. Hubungkan repository yang sudah kamu buat
4. Tambahkan variable:
```bash
DATABASE_URL=(ambil dari PostgreSQL Railway)
PORT=8000 (yang belum digunakan)
```
5. Klik Deploy
> Railway akan otomatis build dan menjalankan aplikasimu.

## 🌍 9. Akses Hasil Deploy
1. Setelah build selesai, buka tab Settings → Generate Domain
2. Akses aplikasi di URL:
https://nama-projek-production.up.railway.app
3. Tes koneksi: / → Server aktif /test-db → Database terkoneksi /upload → Upload file

## 🧾 10. Update & Redeploy
Jika kamu melakukan perubahan:
```bash
git add .
git commit -m "Update fitur"
git push
```
> Railway akan otomatis melakukan redeploy setiap kali ada push ke main branch.
