
-- Migration 001: Membuat tabel prodi dan dosen

-- migrate:up

CREATE TABLE prodi (
    kode_prodi VARCHAR(10) PRIMARY KEY,
    nama_prodi VARCHAR(100) NOT NULL,
    jenjang VARCHAR(3) NOT NULL,

    CONSTRAINT uq_prodi_nama_jenjang
        UNIQUE (nama_prodi, jenjang),

    CONSTRAINT ck_prodi_jenjang
        CHECK (jenjang IN ('D3', 'D4', 'S1', 'S2', 'S3'))
);

CREATE TABLE dosen (
    id_dosen INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nidn VARCHAR(10) UNIQUE,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100),

    kode_prodi VARCHAR(10) NOT NULL,

    CONSTRAINT uq_dosen_email UNIQUE (email),

    CONSTRAINT fk_dosen_prodi
        FOREIGN KEY (kode_prodi)
        REFERENCES prodi (kode_prodi)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- migrate:down

DROP TABLE IF EXISTS dosen;
DROP TABLE IF EXISTS prodi;