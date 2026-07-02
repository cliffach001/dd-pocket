-- Tambah kolom target_supervisor_id di change_approvals
-- Menentukan supervisor spesifik yang dituju untuk approval (ketika supervisor asli cuti)
ALTER TABLE change_approvals
ADD COLUMN IF NOT EXISTS target_supervisor_id BIGINT REFERENCES users(id);
