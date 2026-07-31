"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  appointmentSchema,
  STATUS_OPTIONS,
  type AppointmentFormValues,
} from "../schemas/appointment-schema";
import { addMinutesToTime, type CalendarClient, type CalendarService } from "../types";

interface AppointmentFormProps {
  defaultValues: AppointmentFormValues;
  services: CalendarService[];
  clients: CalendarClient[];
  onSubmit: (values: AppointmentFormValues) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function AppointmentForm({
  defaultValues,
  services,
  clients,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });

  const clientItems = useMemo(
    () =>
      clients.map((client) => ({
        value: client.id,
        label: `${client.first_name} ${client.last_name}`.trim(),
      })),
    [clients],
  );

  const serviceItems = useMemo(
    () => services.map((service) => ({ value: service.id, label: service.name })),
    [services],
  );

  const serviceId = form.watch("service_id");
  const startTime = form.watch("start_time");
  const selectedService = services.find((service) => service.id === serviceId);
  const endPreview =
    selectedService && startTime ? addMinutesToTime(startTime, selectedService.duration) : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select
                items={clientItems}
                value={field.value ? field.value : null}
                onValueChange={(value) => field.onChange(value ?? "")}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientItems.map((option) => (
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
          name="service_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service" />
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isSubmitting} {...field} />
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
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <Input type="time" step={300} disabled={isSubmitting} {...field} />
                </FormControl>
                <FormDescription>
                  {endPreview
                    ? `Ends at ${endPreview} (${selectedService?.duration} min)`
                    : "End time is calculated from the service duration."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  items={STATUS_OPTIONS}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
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
                <FormLabel>Price (KM)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
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
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Balayage + toner" disabled={isSubmitting} {...field} />
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
              <FormLabel>Products</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Olaplex No.3" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any notes for this appointment" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
