import { createClient } from "@/lib/supabase/client";

const BUCKET = "client-avatars";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(file: File): string {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "jpg";
}

/**
 * Uploads a customer avatar to Supabase Storage and returns its public URL.
 */
export async function uploadCustomerAvatar(file: File, customerId?: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, WEBP or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const supabase = createClient();
  const folder = customerId ?? "drafts";
  const path = `${folder}/${crypto.randomUUID()}.${extensionFor(file)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    if (/bucket not found/i.test(error.message)) {
      throw new Error(
        'Storage bucket "client-avatars" is missing. Run supabase/setup_client_avatars.sql in the Supabase SQL Editor.',
      );
    }
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}
