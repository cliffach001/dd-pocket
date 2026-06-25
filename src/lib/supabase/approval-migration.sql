-- ============================================================
-- Approval System Migration
-- Table: change_approvals
-- Untuk menyimpan permintaan edit/delete dari role Operator
-- yang perlu disetujui oleh Admin/Manager
-- ============================================================

-- 1. CHANGE APPROVALS TABLE
CREATE TABLE IF NOT EXISTS change_approvals (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id BIGINT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('edit', 'delete', 'create')),
  old_data JSONB,
  new_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by BIGINT REFERENCES users(id),
  requested_by_name TEXT NOT NULL DEFAULT '',
  reviewed_by BIGINT REFERENCES users(id),
  review_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_change_approvals_status ON change_approvals(status);
CREATE INDEX IF NOT EXISTS idx_change_approvals_created_at ON change_approvals(created_at DESC);

-- 3. AUTO-UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_change_approvals_updated_at ON change_approvals;
CREATE TRIGGER trigger_change_approvals_updated_at
  BEFORE UPDATE ON change_approvals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. ROW LEVEL SECURITY
ALTER TABLE change_approvals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can read change_approvals" ON change_approvals;
DROP POLICY IF EXISTS "Users can insert change_approvals" ON change_approvals;
DROP POLICY IF EXISTS "Users can update change_approvals" ON change_approvals;
DROP POLICY IF EXISTS "Users can delete change_approvals" ON change_approvals;

-- CHANGE APPROVALS policies
CREATE POLICY "Users can read change_approvals"
  ON change_approvals FOR SELECT
  USING (true);

CREATE POLICY "Users can insert change_approvals"
  ON change_approvals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update change_approvals"
  ON change_approvals FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete change_approvals"
  ON change_approvals FOR DELETE
  USING (true);
