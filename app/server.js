require('dotenv').config();

const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Aplikasi KRS berhasil berjalan!');
});

app.get('/api/mahasiswa', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.nim, m.nama, m.email, m.tahun_masuk,
             m.status, p.nama_prodi
      FROM mahasiswa m
      JOIN prodi p ON p.kode_prodi = m.kode_prodi
      ORDER BY m.nim
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Gagal mengambil data mahasiswa'
    });
  }
});

app.post('/api/mahasiswa', async (req, res) => {
  const {
    nim,
    nama,
    email,
    tahun_masuk,
    status,
    kode_prodi
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO mahasiswa
        (nim, nama, email, tahun_masuk, status, kode_prodi)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        nim,
        nama,
        email || null,
        tahun_masuk,
        status || 'aktif',
        kode_prodi
      ]
    );

    res.status(201).json({
      message: 'Mahasiswa berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: 'Gagal menambahkan mahasiswa. Periksa data dan constraint.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});