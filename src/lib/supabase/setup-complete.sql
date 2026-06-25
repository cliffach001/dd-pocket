-- ============================================================
-- DD-Pocket — FULL DATABASE SETUP
-- Migration + Seed Data dalam satu file
-- ============================================================
-- Cara pakai:
--   1. Buka https://supabase.com/dashboard/project/tposexwwvlsemiywagtp/sql/new
--   2. Paste semua SQL di bawah ini
--   3. Klik RUN (▸)
-- ============================================================

-- ===================== MIGRATION =====================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Manager', 'Operator')),
  status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SWITCH GEARS TABLE
CREATE TABLE IF NOT EXISTS switch_gears (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Maintenance', 'Selesai')),
  pic TEXT NOT NULL DEFAULT '',
  requester TEXT NOT NULL DEFAULT '',
  active_time TEXT NOT NULL DEFAULT '',
  notif_no TEXT NOT NULL DEFAULT '',
  lototo_no TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  "user" TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT '',
  timestamp TEXT NOT NULL DEFAULT '',
  details TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_switch_gears_status ON switch_gears(status);
CREATE INDEX IF NOT EXISTS idx_switch_gears_unit ON switch_gears(unit);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- 5. AUTO-UPDATE TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_switch_gears_updated_at ON switch_gears;
CREATE TRIGGER trigger_switch_gears_updated_at
  BEFORE UPDATE ON switch_gears
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE switch_gears ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- USERS policies
DROP POLICY IF EXISTS "Users can read all users" ON users;
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert users" ON users;
CREATE POLICY "Users can insert users" ON users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can update users" ON users;
CREATE POLICY "Users can update users" ON users FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Users can delete users" ON users;
CREATE POLICY "Users can delete users" ON users FOR DELETE USING (true);

-- SWITCH GEARS policies
DROP POLICY IF EXISTS "Users can read all switch_gears" ON switch_gears;
CREATE POLICY "Users can read all switch_gears" ON switch_gears FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert switch_gears" ON switch_gears;
CREATE POLICY "Users can insert switch_gears" ON switch_gears FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can update switch_gears" ON switch_gears;
CREATE POLICY "Users can update switch_gears" ON switch_gears FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Users can delete switch_gears" ON switch_gears;
CREATE POLICY "Users can delete switch_gears" ON switch_gears FOR DELETE USING (true);

-- ACTIVITY LOGS policies
DROP POLICY IF EXISTS "Users can read all activity_logs" ON activity_logs;
CREATE POLICY "Users can read all activity_logs" ON activity_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert activity_logs" ON activity_logs;
CREATE POLICY "Users can insert activity_logs" ON activity_logs FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can delete activity_logs" ON activity_logs;
CREATE POLICY "Users can delete activity_logs" ON activity_logs FOR DELETE USING (true);


-- ===================== SEED DATA =====================

-- USERS
INSERT INTO users (name, email, unit, department, username, password, role, status) VALUES
  ('Admin Utama', 'admin@ddpocket.com', 'IT', 'Teknologi Informasi', 'admin', 'admin123', 'Admin', 'Aktif'),
  ('Manajer Operasi', 'manager@ddpocket.com', 'Operasi', 'Produksi', 'manager', 'manager123', 'Manager', 'Aktif'),
  ('Operator Lapangan', 'operator@ddpocket.com', 'Produksi', 'Produksi', 'operator', 'operator123', 'Operator', 'Aktif'),
  ('Budi Santoso', 'budi@ddpocket.com', 'Tonasa 2/3', 'Teknik', 'budi', 'budi123', 'Operator', 'Aktif'),
  ('Citra Dewi', 'citra@ddpocket.com', 'Tonasa 4', 'Teknik', 'citra', 'citra123', 'Operator', 'Aktif'),
  ('Eko Prasetyo', 'eko@ddpocket.com', 'Tonasa 5', 'Produksi', 'eko', 'eko123', 'Operator', 'Nonaktif'),
  ('Fajar Nugroho', 'fajar@ddpocket.com', 'IT', 'Teknologi Informasi', 'fajar', 'fajar123', 'Manager', 'Aktif')
ON CONFLICT (username) DO NOTHING;

-- SWITCH GEARS
INSERT INTO switch_gears (name, location, unit, status, pic, requester, active_time, notif_no, lototo_no, image, description) VALUES
  ('SG-MV-01', 'Area Transformer T2/3', 'Tonasa 2/3', 'Aktif', 'Ahmad Fauzi', 'Budi Santoso', '2026-06-25 08:30', 'NOTIF-2026-001', 'LT-2026-001', '', 'Pengamanan switch gear untuk area transformator'),
  ('SG-MV-02', 'Area Kiln T4', 'Tonasa 4', 'Maintenance', 'Rudi Hermawan', 'Citra Dewi', '2026-06-24 14:00', 'NOTIF-2026-002', 'LT-2026-002', '', 'Perbaikan panel kontrol'),
  ('SG-LV-01', 'Area Packer T5', 'Tonasa 5', 'Selesai', 'Dian Permata', 'Eko Prasetyo', '2026-06-23 09:15', 'NOTIF-2026-003', 'LT-2026-003', '', 'Penggantian komponen rusak'),
  ('SG-MV-03', 'Area Crusher', 'Tonasa 2/3', 'Aktif', 'Fajar Nugroho', 'Gilang Ramadhan', '2026-06-25 10:00', 'NOTIF-2026-004', 'LT-2026-004', '', 'Lockout tagout untuk perawatan crusher'),
  ('SG-LV-02', 'Area Raw Mill', 'Tonasa 4', 'Maintenance', 'Hendra Gunawan', 'Indra Lesmana', '2026-06-24 16:30', 'NOTIF-2026-005', 'LT-2026-005', '', 'Perbaikan sistem kelistrikan'),
  ('SG-MV-04', 'Area Finish Mill', 'Tonasa 5', 'Aktif', 'Joko Susilo', 'Kurniawan', '2026-06-25 07:45', 'NOTIF-2026-006', 'LT-2026-006', '', 'Pengamanan area finish mill'),
  ('SG-LV-03', 'Area Loading', 'SG Lainnya', 'Selesai', 'Lestari', 'Mega Sari', '2026-06-22 11:00', 'NOTIF-2026-007', 'LT-2026-007', '', 'Perawatan rutin'),
  ('SG-MV-05', 'Area Coal Mill', 'Tonasa 2/3', 'Maintenance', 'Nurhayati', 'Omar Dani', '2026-06-24 08:00', 'NOTIF-2026-008', 'LT-2026-008', '', 'Overhaul panel utama');

-- ACTIVITY LOGS
INSERT INTO activity_logs (action, "user", page, timestamp, details) VALUES
  ('Login', 'Admin Utama', 'Dashboard', '2026-06-25 08:00', 'User login ke sistem'),
  ('Tambah SG', 'Admin Utama', 'Switch Gear', '2026-06-25 08:15', 'Menambahkan SG-MV-01'),
  ('Edit SG', 'Manajer Operasi', 'Switch Gear', '2026-06-25 09:00', 'Mengubah data SG-LV-01'),
  ('Hapus SG', 'Admin Utama', 'Switch Gear', '2026-06-25 09:30', 'Menghapus SG-Test'),
  ('Aktifkan LOTOTO', 'Operator Lapangan', 'Lototo', '2026-06-25 10:00', 'Mengaktifkan LOTOTO untuk SG-MV-03'),
  ('Update Status', 'Budi Santoso', 'SG Maintenance', '2026-06-25 10:30', 'Mengubah status SG-MV-02 ke Maintenance'),
  ('Tambah User', 'Admin Utama', 'Pengguna', '2026-06-25 11:00', 'Menambahkan user baru: Fajar Nugroho'),
  ('Edit User', 'Admin Utama', 'Pengguna', '2026-06-25 11:30', 'Mengubah data user: Citra Dewi'),
  ('Login', 'Fajar Nugroho', 'Dashboard', '2026-06-25 12:00', 'User login ke sistem'),
  ('Selesaikan LOTOTO', 'Operator Lapangan', 'Lototo', '2026-06-25 13:00', 'Menyelesaikan LOTOTO untuk SG-LV-01'),
  ('Export Laporan', 'Manajer Operasi', 'Laporan Harian', '2026-06-25 14:00', 'Export laporan harian periode 24-25 Juni 2026'),
  ('Login', 'Operator Lapangan', 'Dashboard', '2026-06-25 14:30', 'User login ke sistem');
