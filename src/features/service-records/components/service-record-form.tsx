"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { useTranslations } from "@/i18n";
import { ServiceRecordPhotoField } from "./service-record-photo-field";
import {
  serviceRecordSchema,
  type ServiceRecordFormValues,
} from "../schemas/service-record-schema";

export type ServiceRecordPhotoChanges = {
  beforeFile: File | null;
  afterFile: File | null;
  clearBefore: boolean;
  clearAfter: boolean;
};

interface ServiceRecordFormProps {
  defaultValues: ServiceRecordFormValues;
  onSubmit: (values: ServiceRecordFormValues, photos: ServiceRecordPhotoChanges) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function ServiceRecordForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ServiceRecordFormProps) {
  const t = useTranslations();
  const form = useForm<ServiceRecordFormValues>({
    resolver: zodResolver(serviceRecordSchema),
    defaultValues,
  });

  const [beforeFile, setBeforeFile] = React.useState<File | null>(null);
  const [afterFile, setAfterFile] = React.useState<File | null>(null);
  const [clearBefore, setClearBefore] = React.useState(false);
  const [clearAfter, setClearAfter] = React.useState(false);
  const [beforePreview, setBeforePreview] = React.useState<string | null>(
    defaultValues.before_image_url || null,
  );
  const [afterPreview, setAfterPreview] = React.useState<string | null>(
    defaultValues.after_image_url || null,
  );

  React.useEffect(() => {
    return () => {
      if (beforePreview?.startsWith("blob:")) URL.revokeObjectURL(beforePreview);
      if (afterPreview?.startsWith("blob:")) URL.revokeObjectURL(afterPreview);
    };
  }, [beforePreview, afterPreview]);

  function setPreview(
    kind: "before" | "after",
    next: string | null,
    current: string | null,
  ) {
    if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
    if (kind === "before") setBeforePreview(next);
    else setAfterPreview(next);
  }

  function handleBeforeSelect(file: File) {
    setBeforeFile(file);
    setClearBefore(false);
    setPreview("before", URL.createObjectURL(file), beforePreview);
  }

  function handleAfterSelect(file: File) {
    setAfterFile(file);
    setClearAfter(false);
    setPreview("after", URL.createObjectURL(file), afterPreview);
  }

  function handleBeforeClear() {
    setBeforeFile(null);
    setClearBefore(true);
    setPreview("before", null, beforePreview);
    form.setValue("before_image_url", "");
  }

  function handleAfterClear() {
    setAfterFile(null);
    setClearAfter(true);
    setPreview("after", null, afterPreview);
    form.setValue("after_image_url", "");
  }

  function handleFormSubmit(values: ServiceRecordFormValues) {
    onSubmit(values, {
      beforeFile,
      afterFile,
      clearBefore,
      clearAfter,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="hair_condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("serviceRecords.hairCondition")}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder={t("serviceRecords.hairConditionPlaceholder")}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="treatment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("serviceRecords.treatment")}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder={t("serviceRecords.treatmentPlaceholder")}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="products_used"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("serviceRecords.productsUsed")}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder={t("serviceRecords.productsUsedPlaceholder")}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color_formula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("serviceRecords.colorFormula")}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder={t("serviceRecords.colorFormulaPlaceholder")}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("serviceRecords.notes")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("serviceRecords.notesPlaceholder")}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("serviceRecords.recommendations")}</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder={t("serviceRecords.recommendationsPlaceholder")}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ServiceRecordPhotoField
            label={t("serviceRecords.beforePhoto")}
            previewUrl={beforePreview}
            disabled={isSubmitting}
            onFileSelect={handleBeforeSelect}
            onClear={handleBeforeClear}
          />
          <ServiceRecordPhotoField
            label={t("serviceRecords.afterPhoto")}
            previewUrl={afterPreview}
            disabled={isSubmitting}
            onFileSelect={handleAfterSelect}
            onClear={handleAfterClear}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isSubmitting}>
                {t("common.cancel")}
              </Button>
            }
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {submitLabel ?? t("calendar.completeAppointment")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
