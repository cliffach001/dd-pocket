#!/bin/bash
# ============================================================
# DD-Pocket Supabase Setup Script
# ============================================================
# Script ini akan membantu Anda mengatur koneksi Supabase
#
# Prerequisites:
#   1. Buat akun di https://supabase.com (gratis)
#   2. Buat project baru di dashboard Supabase
#   3. Dapatkan Project URL dan Anon Key dari:
#      Settings > API > Project API keys
#
# Cara pakai:
#   chmod +x scripts/setup-supabase.sh
#   ./scripts/setup-supabase.sh
# ============================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║        DD-Pocket — Supabase Setup               ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# --- Cek .env.local ---
if [ ! -f .env.local ]; then
  echo "📝 Membuat file .env.local..."
  cp .env.example .env.local
  echo "✅ File .env.local dibuat"
else
  echo "✅ File .env.local sudah ada"
fi

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   LANGKAH 1: Setup Kredensial Supabase           ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Silakan buka https://supabase.com dan:"
echo "  1. Login / Buat akun"
echo "  2. Klik 'New project'"
echo "  3. Isi:"
echo "     - Name: dd-pocket"
echo "     - Database Password: (simpan password ini)"
echo "     - Region: Singapore (paling dekat)"
echo "     - Pricing: Free tier"
echo "  4. Tunggu sampai project selesai dibuat (~2 menit)"
echo "  5. Buka Project Settings > API"
echo ""

read -p "📥 Masukkan Supabase Project URL: " SUPABASE_URL
read -p "📥 Masukkan Supabase Anon Key: " SUPABASE_ANON_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "❌ URL dan Anon Key tidak boleh kosong!"
  exit 1
fi

# Update .env.local
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL|" .env.local
  sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env.local
else
  sed -i "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL|" .env.local
  sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env.local
fi

echo "✅ Kredensial disimpan ke .env.local"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   LANGKAH 2: Migrasi Database                    ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Sekarang buka Supabase Dashboard → SQL Editor:"
echo "  1. Klik 'SQL Editor' di sidebar kiri"
echo "  2. Klik 'New Query'"
echo "  3. Copy paste isi file: src/lib/supabase/migration.sql"
echo "  4. Klik RUN (▸)"
echo "  5. Tunggu sampai semua query berhasil (centang hijau)"
echo ""
read -p "✅ Sudah menjalankan migration.sql? (y/n): " MIGRATION_DONE

if [ "$MIGRATION_DONE" != "y" ]; then
  echo "⚠️  Jalankan migration.sql di Supabase SQL Editor sebelum lanjut!"
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   LANGKAH 3: Seed Data                          ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Sekarang jalankan seed data:"
echo "  1. Di SQL Editor yang sama, buat New Query baru"
echo "  2. Copy paste isi file: src/lib/supabase/seed.sql"
echo "  3. Klik RUN (▸)"
echo ""
read -p "✅ Sudah menjalankan seed.sql? (y/n): " SEED_DONE

if [ "$SEED_DONE" != "y" ]; then
  echo "⚠️  Jalankan seed.sql di Supabase SQL Editor sebelum lanjut!"
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   ✅ SETUP SELESAI!                              ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Database Supabase sudah terhubung ke DD-Pocket!"
echo ""
echo "Akun Demo yang tersedia:"
echo "  Admin:   admin / admin123"
echo "  Manager: manager / manager123"
echo "  Operator: operator / operator123"
echo ""
echo "Jalankan aplikasi:"
echo "  npm run dev"
echo ""
echo "Atau build untuk production:"
echo "  npm run build && npm start"
echo ""
