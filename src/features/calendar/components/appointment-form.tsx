"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, ClockIcon, Loader2Icon } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  appointmentSchema,
  NOTES_MAX_LENGTH,
  type AppointmentFormValues,
} from "../schemas/appointment-schema";
import { addMinutesToTime, type CalendarClient, type CalendarService } from "../types";
import { CustomerCombobox } from "./customer-combobox";

const fieldClassName =
  "h-11 rounded-xl border-border bg-background px-3 text-sm shadow-none md:text-sm";
const selectTriggerClassName = cn(fieldClassName, "w-full");

interface AppointmentFormProps {
  defaultValues: AppointmentFormValues;
  services: CalendarService[];
  clients: CalendarClient[];
  onSubmit: (values: AppointmentFormValues) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  showStatus?: boolean;
}

export function AppointmentForm({
  defaultValues,
  services,
  clients,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
  showStatus = false,
}: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });

  const serviceItems = useMemo(
    () => services.map((service) => ({ value: service.id, label: service.name })),
    [services],
  );

  const serviceId = form.watch("service_id");
  const startTime = form.watch("start_time");
  const notes = form.watch("notes") ?? "";
  const selectedService = services.find((service) => service.id === serviceId);
  const endPreview =
    selectedService && startTime
      ? addMinutesToTime(startTime, selectedService.duration)
      : "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs font-medium">Customer</FormLabel>
              <FormControl>
                <CustomerCombobox
                  clients={clients}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  accentColor={selectedService?.color ?? "#3b82f6"}
                  invalid={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium">Select Time</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1.2fr_1fr_auto_1fr] sm:items-center">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <CalendarIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        type="date"
                        disabled={isSubmitting}
                        className={cn(fieldClassName, "pl-9")}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <ClockIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        type="time"
                        step={300}
                        disabled={isSubmitting}
                        className={cn(fieldClassName, "pl-9")}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <span className="text-muted-foreground hidden text-center text-sm sm:block">to</span>

            <FormItem>
              <FormControl>
                <div className="relative">
                  <ClockIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    type="time"
                    value={endPreview}
                    readOnly
                    tabIndex={-1}
                    placeholder="End"
                    aria-label="End time"
                    className={cn(fieldClassName, "text-muted-foreground pl-9")}
                  />
                </div>
              </FormControl>
              <p className="text-muted-foreground text-xs sm:hidden">
                End time is calculated from the service duration
                {endPreview ? ` (${endPreview})` : ""}.
              </p>
            </FormItem>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
          <FormField
            control={form.control}
            name="service_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">Service</FormLabel>
                <Select
                  items={serviceItems}
                  value={field.value ? field.value : null}
                  onValueChange={(value) => {
                    field.onChange(value ?? "");
                    const service = services.find((item) => item.id === value);
                    if (service && !form.getValues("price")) {
                      form.setValue("price", String(service.default_price));
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className={selectTriggerClassName}>
                      <SelectValue placeholder="Enter service here" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceItems.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder="Enter price"
                    disabled={isSubmitting}
                    className={fieldClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="treatment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">Treatment</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter treatment here"
                    disabled={isSubmitting}
                    className={fieldClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="products"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">Products</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product here"
                    disabled={isSubmitting}
                    className={fieldClassName}
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
              <FormLabel className="text-muted-foreground text-xs font-medium">Notes</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Enter your note here"
                    disabled={isSubmitting}
                    maxLength={NOTES_MAX_LENGTH}
                    className="min-h-28 resize-none rounded-xl border-border bg-background px-3 py-3 pb-8 text-sm shadow-none md:text-sm"
                    {...field}
                  />
                  <span className="text-muted-foreground pointer-events-none absolute right-3 bottom-2.5 text-xs tabular-nums">
                    {notes.length}/{NOTES_MAX_LENGTH}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showStatus ? (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">Status</FormLabel>
                <Select
                  items={[
                    { value: "scheduled", label: "Scheduled" },
                    { value: "confirmed", label: "Confirmed" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "no_show", label: "No Show" },
                  ]}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className={selectTriggerClassName}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <input type="hidden" {...form.register("status")} />
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <DialogClose
            render={
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-muted text-foreground hover:bg-muted/80"
              >
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            {isSubmitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
