/**
 * Client-side image compression via Canvas.
 * Resizes long edge and re-encodes as JPEG to keep salon photos small in Storage.
 */

export type CompressImageOptions = {
  maxEdge?: number;
  quality?: number;
  /** Output MIME type. Defaults to image/jpeg. */
  mimeType?: "image/jpeg" | "image/webp";
};

const DEFAULT_MAX_EDGE = 1600;
const DEFAULT_QUALITY = 0.82;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file."));
    };
    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not compress image."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

/**
 * Compresses an image File for upload. Returns the original file when it is
 * already a small JPEG/WebP under the target long-edge size.
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const maxEdge = options.maxEdge ?? DEFAULT_MAX_EDGE;
  const quality = options.quality ?? DEFAULT_QUALITY;
  const mimeType = options.mimeType ?? "image/jpeg";

  const image = await loadImage(file);
  const longest = Math.max(image.width, image.height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  // Skip re-encode when already small enough and matching output type.
  if (
    scale === 1 &&
    file.size <= 350_000 &&
    (file.type === mimeType || (mimeType === "image/jpeg" && file.type === "image/jpg"))
  ) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not compress image.");
  }
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, mimeType, quality);
  const extension = mimeType === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";

  return new File([blob], `${baseName}.${extension}`, {
    type: mimeType,
    lastModified: Date.now(),
  });
}
