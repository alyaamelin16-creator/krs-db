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

app.put('/api/mahasiswa/:nim', async (req, res) => {
  const { nim } = req.params;
  const {
    nama,
    email,
    tahun_masuk,
    status,
    kode_prodi
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE mahasiswa
       SET nama = $1,
           email = $2,
           tahun_masuk = $3,
           status = $4,
           kode_prodi = $5
       WHERE nim = $6
       RETURNING *`,
      [
        nama,
        email || null,
        tahun_masuk,
        status,
        kode_prodi,
        nim
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Mahasiswa tidak ditemukan'
      });
    }

    res.json({
      message: 'Mahasiswa berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: 'Gagal memperbarui mahasiswa. Periksa data dan constraint.'
    });
  }
});

app.delete('/api/mahasiswa/:nim', async (req, res) => {
  const { nim } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM mahasiswa
       WHERE nim = $1
       RETURNING nim, nama`,
      [nim]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Mahasiswa tidak ditemukan'
      });
    }

    res.json({
      message: 'Mahasiswa berhasil dihapus',
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: 'Gagal menghapus mahasiswa. Periksa relasi data.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});