"use client";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import {
  serviceRecordSchema,
  type ServiceRecordFormValues,
} from "../schemas/service-record-schema";

interface ServiceRecordFormProps {
  defaultValues: ServiceRecordFormValues;
  onSubmit: (values: ServiceRecordFormValues) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function ServiceRecordForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Complete appointment",
}: ServiceRecordFormProps) {
  const form = useForm<ServiceRecordFormValues>({
    resolver: zodResolver(serviceRecordSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="hair_condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hair Condition</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="e.g. Dry ends, healthy roots"
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
                <FormLabel>Treatment</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="What was performed"
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
                <FormLabel>Products Used</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="e.g. Olaplex No.3, Wella Color Touch"
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
                <FormLabel>Color Formula</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="e.g. 6/0 + 7/43, 20 vol"
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any notes about the visit" disabled={isSubmitting} {...field} />
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
              <FormLabel>Recommendations</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Home care, next visit suggestions"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="before_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Before Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://…"
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
            name="after_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>After Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://…"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            }
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
