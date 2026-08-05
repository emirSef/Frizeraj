"use client";

import * as React from "react";
import { ImageIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n";
import { getErrorMessage } from "@/lib/errors";
import {
  SERVICE_RECORD_PHOTO_ACCEPT,
  validateServiceRecordPhoto,
} from "../lib/upload-photos";

interface ServiceRecordPhotoFieldProps {
  label: string;
  /** Existing saved URL or local blob preview. */
  previewUrl: string | null;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export function ServiceRecordPhotoField({
  label,
  previewUrl,
  disabled = false,
  onFileSelect,
  onClear,
}: ServiceRecordPhotoFieldProps) {
  const t = useTranslations();
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      validateServiceRecordPhoto(file);
      onFileSelect(file);
    } catch (error) {
      toast.error(t("serviceRecords.couldNotUpload"), {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm leading-none font-medium">{label}</p>
      <div className="flex items-start gap-3">
        <div className="bg-muted flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-sm border">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={label} className="size-full object-cover" />
          ) : (
            <ImageIcon className="text-muted-foreground size-8" />
          )}
        </div>

        <div className="flex min-w-0 flex-col items-start gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept={SERVICE_RECORD_PHOTO_ACCEPT}
            className="sr-only"
            disabled={disabled}
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="rounded-sm"
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon className="size-4" />
            {previewUrl ? t("serviceRecords.replacePhoto") : t("serviceRecords.uploadPhoto")}
          </Button>
          {previewUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="text-muted-foreground h-8 rounded-sm px-2"
              onClick={onClear}
            >
              <Trash2Icon className="size-4" />
              {t("serviceRecords.removePhoto")}
            </Button>
          ) : null}
          <p className="text-muted-foreground text-xs">{t("serviceRecords.uploadHint")}</p>
        </div>
      </div>
    </div>
  );
}
