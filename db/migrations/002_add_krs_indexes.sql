-- migrate:up

CREATE INDEX IF NOT EXISTS idx_mahasiswa_kode_prodi
ON mahasiswa(kode_prodi);

CREATE INDEX IF NOT EXISTS idx_krs_periode
ON krs(id_periode);

CREATE INDEX IF NOT EXISTS idx_krs_detail_id_kelas
ON krs_detail(id_kelas);


-- migrate:down

DROP INDEX IF EXISTS idx_krs_detail_id_kelas;
DROP INDEX IF EXISTS idx_krs_periode;
DROP INDEX IF EXISTS idx_mahasiswa_kode_prodi;