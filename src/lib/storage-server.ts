import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "images";

/**
 * Dapatkan Supabase client dengan service_role key untuk upload server-side
 * (bypass RLS, tapi hanya dipakai server)
 */
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diatur",
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Upload file ke Supabase Storage bucket "images".
 * File bisa diakses publik via URL yang dikembalikan.
 *
 * @param buffer - File buffer
 * @param fileName - Nama file (disarankan pakai timestamp prefix agar unik)
 * @param mimeType - MIME type file (contoh: image/jpeg)
 * @returns Public URL file
 */
export async function uploadToStorage(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const supabase = getSupabaseAdmin();

  // Upload ke bucket images
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    // Jika file sudah ada (konflik nama), tambahkan random string
    if (uploadError.message?.includes("already exists") || uploadError.message?.includes("duplicate")) {
      const dotIndex = fileName.lastIndexOf(".");
      const baseName = dotIndex > 0 ? fileName.substring(0, dotIndex) : fileName;
      const ext = dotIndex > 0 ? fileName.substring(dotIndex) : "";
      const uniqueName = `${baseName}-${Math.random().toString(36).substring(2, 8)}${ext}`;

      const { error: retryError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(uniqueName, buffer, {
          contentType: mimeType,
          upsert: false,
          cacheControl: "3600",
        });

      if (retryError) {
        throw new Error(`Gagal upload ke Supabase Storage: ${retryError.message}`);
      }

      // Dapatkan public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uniqueName);

      return publicUrlData.publicUrl;
    }

    throw new Error(`Gagal upload ke Supabase Storage: ${uploadError.message}`);
  }

  // Dapatkan public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
