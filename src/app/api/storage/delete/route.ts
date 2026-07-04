import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "images";

/**
 * Ekstrak path file dari URL Supabase Storage.
 * Contoh: https://xxx.supabase.co/storage/v1/object/public/images/123-foto.jpg
 *         → "123-foto.jpg"
 */
function extractFilePath(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Format: /storage/v1/object/public/{bucket}/{path}
    const match = parsed.pathname.match(/\/public\/images\/(.+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

/**
 * POST /api/storage/delete
 * Hapus file dari Supabase Storage bucket "images".
 *
 * Input: { urls: string[] }
 * Output: { deleted: number }
 */
export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ deleted: 0 });
    }

    // Filter hanya URL Supabase Storage (bukan Google Drive lama)
    const filePaths = urls
      .map(extractFilePath)
      .filter((p): p is string => p !== null);

    if (filePaths.length === 0) {
      return NextResponse.json({ deleted: 0 });
    }

    // Pakai service_role key untuk bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (error) {
      console.error("[StorageDelete] Error:", error);
      return NextResponse.json(
        { error: "Gagal menghapus file: " + error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ deleted: filePaths.length });
  } catch (error: any) {
    console.error("[StorageDelete] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menghapus file" },
      { status: 500 },
    );
  }
}
