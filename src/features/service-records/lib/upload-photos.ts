import { createClient } from "@/lib/supabase/client";
import { compressImageFile } from "@/lib/image-compress";

export const SERVICE_RECORD_PHOTOS_BUCKET = "service-record-photos";

/** Max size of the original file picked by the user (before compression). */
export const SERVICE_RECORD_PHOTO_MAX_BYTES = 10 * 1024 * 1024;

/** Max size of the file we upload after compression. */
export const SERVICE_RECORD_PHOTO_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

export const SERVICE_RECORD_PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type ServiceRecordPhotoKind = "before" | "after";

export function validateServiceRecordPhoto(file: File): void {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG or WEBP image.");
  }
  if (file.size > SERVICE_RECORD_PHOTO_MAX_BYTES) {
    throw new Error("Image must be 10 MB or smaller.");
  }
}

/**
 * Extracts the object path from a public Storage URL for this bucket.
 * Returns null for external / unrecognized URLs (those are left alone).
 */
export function serviceRecordPhotoPathFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${SERVICE_RECORD_PHOTOS_BUCKET}/`;
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    const path = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    return path.length > 0 ? path : null;
  } catch {
    return null;
  }
}

/**
 * Compresses and uploads a before/after photo. Returns the public URL.
 */
export async function uploadServiceRecordPhoto(
  file: File,
  appointmentId: string,
  kind: ServiceRecordPhotoKind,
): Promise<string> {
  validateServiceRecordPhoto(file);

  const compressed = await compressImageFile(file, {
    maxEdge: 1600,
    quality: 0.82,
    mimeType: "image/jpeg",
  });

  if (compressed.size > SERVICE_RECORD_PHOTO_UPLOAD_MAX_BYTES) {
    throw new Error("Compressed image is still larger than 5 MB. Try a smaller photo.");
  }

  const supabase = createClient();
  const path = `${appointmentId}/${kind}-${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage.from(SERVICE_RECORD_PHOTOS_BUCKET).upload(path, compressed, {
    cacheControl: "3600",
    upsert: false,
    contentType: compressed.type || "image/jpeg",
  });

  if (error) {
    if (/bucket not found/i.test(error.message)) {
      throw new Error(
        'Storage bucket "service-record-photos" is missing. Run supabase/setup_service_record_photos.sql in the Supabase SQL Editor.',
      );
    }
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SERVICE_RECORD_PHOTOS_BUCKET).getPublicUrl(path);

  return publicUrl;
}

/**
 * Deletes a previously uploaded service-record photo from Storage.
 * No-ops for empty values or URLs that are not in this bucket.
 */
export async function deleteServiceRecordPhoto(publicUrl: string | null | undefined): Promise<void> {
  if (!publicUrl) return;
  const path = serviceRecordPhotoPathFromUrl(publicUrl);
  if (!path) return;

  const supabase = createClient();
  const { error } = await supabase.storage.from(SERVICE_RECORD_PHOTOS_BUCKET).remove([path]);
  if (error) {
    throw new Error(error.message);
  }
}
