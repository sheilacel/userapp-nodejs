const { Pool } = require('pg');
require('dotenv').config();

// Konfigurasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Fungsi untuk membuat tabel users
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

// Jalankan pembuatan tabel saat aplikasi start
createTable();

module.exports = pool;