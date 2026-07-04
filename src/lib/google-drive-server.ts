import { google } from "googleapis";
import { Readable } from "stream";
import { createClient } from "@supabase/supabase-js";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

/**
 * Dapatkan auth JWT untuk Service Account (milik Google Cloud, bukan akun pribadi).
 * Service Account tidak bisa kena blokir seperti akun Gmail biasa.
 */
function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error(
      "Service Account belum dikonfigurasi. Admin harus setup GOOGLE_SERVICE_ACCOUNT_EMAIL dan GOOGLE_PRIVATE_KEY di .env.local",
    );
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: SCOPES,
  });
}

/**
 * Cek apakah Service Account sudah dikonfigurasi di environment variable
 */
export function isServiceAccountConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
}

/**
 * Ambil service account email (untuk ditampilkan di halaman setup)
 */
export function getServiceAccountEmail(): string {
  return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
}

/**
 * Ambil shared folder ID dari database (app_config)
 */
export async function getSharedFolderId(): Promise<string | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", "google_drive_shared_folder_id")
    .single();

  return data?.value || null;
}

/**
 * Simpan shared folder ID ke database
 */
export async function saveSharedFolderId(folderId: string): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  await supabase.from("app_config").upsert(
    { key: "google_drive_shared_folder_id", value: folderId },
    { onConflict: "key" },
  );
}

/**
 * Hapus shared folder ID dari database (reset)
 */
export async function clearSharedFolderId(): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  await supabase
    .from("app_config")
    .delete()
    .eq("key", "google_drive_shared_folder_id");
}

/**
 * Verifikasi bahwa Service Account bisa mengakses folder tertentu.
 * Coba list isi folder — kalau sukses, berarti SA punya akses.
 *
 * @param folderId - ID folder Google Drive
 * @returns true jika akses valid
 */
export async function verifyFolderAccess(folderId: string): Promise<boolean> {
  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: "v3", auth });

    // Coba cek folder exist dan SA punya akses baca
    const result = await drive.files.get({
      fileId: folderId,
      fields: "id,name,owners",
      supportsAllDrives: true,
    });

    return !!result.data.id;
  } catch {
    return false;
  }
}

/**
 * Upload file ke Google Drive via Service Account.
 * WAJIB sudah ada shared folder yang dishare ke Service Account oleh akun asli.
 * File masuk ke folder itu dan menggunakan quota pemilik folder.
 *
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
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  // Wajib ada shared folder — Service Account tidak punya storage sendiri
  const folderId = await getSharedFolderId();
  if (!folderId) {
    throw new Error(
      "Folder Google Drive belum dikonfigurasi. Admin harus setup folder bersama di /admin/google-setup",
    );
  }

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id,webViewLink",
    supportsAllDrives: true,
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
}
