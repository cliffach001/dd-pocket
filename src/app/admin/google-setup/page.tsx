"use client";

import { CheckCircle, Database } from "lucide-react";

export default function StorageInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <Database className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Penyimpanan Gambar</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Semua gambar disimpan di <strong>Supabase Storage</strong>.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                ✅ Supabase Storage aktif
              </p>
              <p className="text-xs text-green-600 mt-1">
                Bucket <code className="bg-green-100 px-1 rounded">images</code> —
                akses publik. Upload via server dengan service_role key.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800 space-y-2">
            <p className="font-medium text-sm">📋 Setup sudah selesai</p>
            <p>Tidak perlu konfigurasi tambahan. File diupload langsung ke Supabase Storage dan bisa diakses publik via URL.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Informasi</h2>
          <table className="w-full text-xs text-gray-600">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700">Bucket</td>
                <td className="py-2">images</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700">Akses</td>
                <td className="py-2">Publik (read) / Server (write)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700">Max file</td>
                <td className="py-2">5 MB per gambar</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-700">Format</td>
                <td className="py-2">JPG, PNG, GIF, WebP</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-gray-400 pb-8">
          🗑️ Google Drive sudah tidak digunakan. File lama tetap bisa diakses via URL yang tersimpan.
        </p>
      </div>
    </div>
  );
}
