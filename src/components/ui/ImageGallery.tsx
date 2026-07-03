"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
}

/**
 * Konversi URL Google Drive ke format yang bisa ditampilkan di <img>
 */
function toImageUrl(url: string): string {
  // Extract file ID dari berbagai format Google Drive URL
  const patterns = [
    /\/d\/([^/?#&]+)/,           // https://drive.google.com/file/d/{fileId}/view
    /[?&]id=([^&]+)/,             // https://drive.google.com/...?id={fileId}
    /\/file\/d\/([^/?#&]+)/,      // https://drive.google.com/file/d/{fileId}/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      // Pakai thumbnail API Google Drive (cepat, tanpa render HTML)
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }
  }

  // Bukan Google Drive URL, kembalikan apa adanya
  return url;
}

export default function ImageGallery({ images }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const validImages = images.filter(Boolean);

  if (validImages.length === 0) return null;

  const first = toImageUrl(validImages[0]);
  const remaining = validImages.length - 1;

  return (
    <>
      <div className="flex items-start gap-1.5">
        <div className="relative group">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(0); }}
            className="block"
          >
            <img
              src={first}
              alt="Gambar"
              className="w-14 h-14 rounded-lg object-cover border border-gray-200 hover:opacity-80 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </button>
          {remaining > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(0); }}
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md hover:bg-blue-600 transition-colors"
            >
              +{remaining}
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="absolute top-4 left-4 text-white/70 text-sm font-medium">
            {lightboxIdx + 1} / {validImages.length}
          </div>

          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) =>
                  prev === 0 ? validImages.length - 1 : prev! - 1,
                );
              }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <img
            src={toImageUrl(validImages[lightboxIdx])}
            alt={`Gambar ${lightboxIdx + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://drive.google.com/uc?export=view&id=${
                validImages[lightboxIdx]?.match(/\/d\/([^/?#&]+)/)?.[1] || ""
              }`;
            }}
          />

          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) =>
                  prev === validImages.length - 1 ? 0 : prev! + 1,
                );
              }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
