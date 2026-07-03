import { google } from "googleapis";
import { Readable } from "stream";
import { createClient } from "@supabase/supabase-js";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

/**
 * Ambil refresh token dari database Supabase
 */
async function getRefreshToken(): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", "google_drive_refresh_token")
    .single();

  if (error || !data) {
    throw new Error(
      "Refresh token tidak ditemukan. Admin harus setup Google Drive dulu di /admin/google-setup",
    );
  }

  return data.value;
}

/**
 * Dapatkan OAuth2 client menggunakan refresh token dari database
 */
async function getAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum diatur di .env.local",
    );
  }

  const refreshToken = await getRefreshToken();

  const auth = new google.auth.OAuth2({
    clientId,
    clientSecret,
  });

  auth.setCredentials({
    refresh_token: refreshToken,
  });

  return auth;
}

/**
 * Tandai refresh token sebagai expired di database Supabase
 */
async function setTokenExpired() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.from("app_config").upsert(
      { key: "google_drive_token_expired", value: "true" },
      { onConflict: "key" },
    );
  } catch {
    // silent — tidak kritikal
  }
}

/**
 * Cek apakah error dari Google berarti token expired/invalid
 */
function isTokenError(error: any): boolean {
  const msg = String(error?.message || error || "").toLowerCase();
  return (
    msg.includes("invalid_grant") ||
    msg.includes("token expired") ||
    msg.includes("refresh_token") ||
    msg.includes("unauthorized") ||
    msg.includes("auth error") ||
    msg.includes("401")
  );
}

/**
 * Upload file ke Google Drive menggunakan OAuth refresh token
 * (menggunakan akun Google yang sudah disetup di /admin/google-setup)
 * @param buffer - File buffer
 * @param fileName - Nama file (disarankan pakai timestamp prefix agar unik)
 * @param mimeType - MIME type file (contoh: image/jpeg)
 * @returns URL view file
 */
export async function uploadToDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const auth = await getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  try {
    // Upload file
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        // Upload ke root My Drive (tidak pakai Shared Drive)
      },
      media: {
        mimeType,
        body: Readable.from(buffer),
      },
      fields: "id,webViewLink",
    });

    const fileId = response.data.id;
    if (!fileId) {
      throw new Error("Gagal upload ke Google Drive — tidak mendapat file ID");
    }

    // Set permission: anyone with link can view
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return (
      response.data.webViewLink ||
      `https://drive.google.com/file/d/${fileId}/view`
    );
  } catch (error: any) {
    // Jika error karena token expired, catat di database
    if (isTokenError(error)) {
      await setTokenExpired();
    }
    throw error;
  }
}
