/** Compress image file to base64 data URL */
export function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;

        // Resize if wider than maxWidth
        if (w > maxWidth) {
          h = (maxWidth / w) * h;
          w = maxWidth;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);

        // Pertahankan format asli: PNG tetap PNG, JPEG tetap JPEG
        const isPng = file.type === "image/png";
        const mimeType = isPng ? "image/png" : "image/jpeg";
        // PNG: tanpa quality (lossless), JPEG: quality 0.85
        resolve(canvas.toDataURL(mimeType, isPng ? undefined : quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
