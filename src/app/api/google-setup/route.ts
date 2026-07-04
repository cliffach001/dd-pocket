import { NextResponse } from "next/server";

/**
 * GET /api/google-setup
 * Status penyimpanan — sudah di-migrasi ke Supabase Storage.
 * Endpoint ini dipertahankan untuk backward compatibility.
 */
export async function GET() {
  return NextResponse.json({
    storage: "supabase",
    bucket: "images",
    note: "Google Drive sudah tidak digunakan. Semua gambar disimpan di Supabase Storage.",
  });
}
