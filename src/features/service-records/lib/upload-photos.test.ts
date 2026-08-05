import { describe, expect, it } from "vitest";

import {
  SERVICE_RECORD_PHOTO_MAX_BYTES,
  serviceRecordPhotoPathFromUrl,
  validateServiceRecordPhoto,
} from "./upload-photos";

describe("serviceRecordPhotoPathFromUrl", () => {
  it("extracts the object path from a Supabase public URL", () => {
    expect(
      serviceRecordPhotoPathFromUrl(
        "https://abc.supabase.co/storage/v1/object/public/service-record-photos/appt-1/before-uuid.jpg",
      ),
    ).toBe("appt-1/before-uuid.jpg");
  });

  it("decodes URI-encoded path segments", () => {
    expect(
      serviceRecordPhotoPathFromUrl(
        "https://abc.supabase.co/storage/v1/object/public/service-record-photos/appt%201/before.jpg",
      ),
    ).toBe("appt 1/before.jpg");
  });

  it("returns null for external URLs", () => {
    expect(serviceRecordPhotoPathFromUrl("https://cdn.example.com/before.jpg")).toBeNull();
  });

  it("returns null for other buckets", () => {
    expect(
      serviceRecordPhotoPathFromUrl(
        "https://abc.supabase.co/storage/v1/object/public/client-avatars/x.jpg",
      ),
    ).toBeNull();
  });
});

describe("validateServiceRecordPhoto", () => {
  it("accepts jpeg/png/webp under the size limit", () => {
    expect(() =>
      validateServiceRecordPhoto(
        new File([new Uint8Array(100)], "shot.jpg", { type: "image/jpeg" }),
      ),
    ).not.toThrow();
  });

  it("rejects unsupported mime types", () => {
    expect(() =>
      validateServiceRecordPhoto(new File([new Uint8Array(100)], "shot.gif", { type: "image/gif" })),
    ).toThrow(/JPG, PNG or WEBP/i);
  });

  it("rejects files over 10 MB", () => {
    expect(() =>
      validateServiceRecordPhoto(
        new File([new Uint8Array(SERVICE_RECORD_PHOTO_MAX_BYTES + 1)], "big.jpg", {
          type: "image/jpeg",
        }),
      ),
    ).toThrow(/10 MB/i);
  });
});
