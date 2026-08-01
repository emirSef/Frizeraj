"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CalendarIcon,
  Loader2Icon,
  MapPinIcon,
  UploadIcon,
  UserRoundIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getInitials } from "@/utils/format";
import {
  COUNTRY_OPTIONS,
  findCountryByName,
  joinPhone,
  splitPhone,
} from "../lib/locations";
import { useTranslations } from "@/i18n";
import {
  customerSchema,
  GENDER_RADIO_OPTIONS,
  type CustomerFormValues,
} from "../schemas/customer-schema";

const fieldClassName =
  "h-11 rounded-sm border-border bg-background px-3 text-sm shadow-none md:text-sm";
const selectTriggerClassName = cn(fieldClassName, "w-full");

interface CustomerFormProps {
  defaultValues: CustomerFormValues;
  onSubmit: (values: CustomerFormValues, avatarFile: File | null) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: CustomerFormProps) {
  const t = useTranslations();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    defaultValues.avatar_url || null,
  );

  const initialPhone = splitPhone(defaultValues.phone);
  const [dialCode, setDialCode] = React.useState(initialPhone.dialCode);
  const [localPhone, setLocalPhone] = React.useState(initialPhone.localNumber);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const country = form.watch("country");
  const selectedCountry = findCountryByName(country);
  const cityOptions = selectedCountry?.cities ?? [];

  React.useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleFormSubmit(values: CustomerFormValues) {
    onSubmit(
      {
        ...values,
        phone: joinPhone(dialCode, localPhone),
      },
      avatarFile,
    );
  }

  const previewName = `${form.watch("first_name")} ${form.watch("last_name")}`.trim();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-4">
            <Avatar className="size-20 shrink-0 after:rounded-full" size="lg">
              {previewUrl ? <AvatarImage src={previewUrl} alt={previewName || "Customer"} /> : null}
              <AvatarFallback className="text-lg">
                {previewName ? getInitials(previewName) : <UserRoundIcon className="size-7" />}
              </AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={isSubmitting}
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="h-11 rounded-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="size-4" />
              {t("customers.uploadImage")}
            </Button>
          </div>
          <p className="text-muted-foreground pl-24 text-xs">{t("customers.uploadHint")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">
                  {t("customers.firstName")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("customers.enterFirstName")}
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
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">
                  {t("customers.lastName")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("customers.enterLastName")}
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
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">
                  {t("customers.birthDate")}
                </FormLabel>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">
                  {t("customers.email")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("customers.enterEmail")}
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
            name="phone"
            render={() => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-muted-foreground text-xs font-medium">
                  {t("customers.phone")}
                </FormLabel>
                <div className="flex items-center gap-2">
                  <Select
                    items={COUNTRY_OPTIONS.map((option) => ({
                      value: option.dialCode,
                      label: `${option.flag} ${option.dialCode}`,
                    }))}
                    value={dialCode}
                    onValueChange={(value) => {
                      if (value) setDialCode(value);
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      className={cn(
                        selectTriggerClassName,
                        "h-11! w-[7.5rem] shrink-0 data-[size=default]:h-11",
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.code} value={option.dialCode}>
                          {option.flag} {option.dialCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormControl className="flex-1">
                    <Input
                      placeholder={t("customers.enterPhone")}
                      disabled={isSubmitting}
                      className={cn(fieldClassName, "w-full")}
                      value={localPhone}
                      onChange={(event) => setLocalPhone(event.target.value)}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs font-medium">
                {t("customers.gender")}
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap items-center gap-5 pt-1">
                  {GENDER_RADIO_OPTIONS.map((option) => {
                    const checked = field.value === option.value;
                    return (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={option.value}
                          checked={checked}
                          disabled={isSubmitting}
                          onChange={() => field.onChange(option.value)}
                          className="peer sr-only"
                        />
                        <span
                          className={cn(
                            "border-border flex size-4 items-center justify-center rounded-full border",
                            checked && "border-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "size-2 rounded-full bg-transparent",
                              checked && "bg-foreground",
                            )}
                          />
                        </span>
                        {t(`customers.${option.value}`)}
                      </label>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">
                  {t("customers.country")}
                </FormLabel>
                <Select
                  items={COUNTRY_OPTIONS.map((option) => ({
                    value: option.name,
                    label: `${option.flag} ${option.name}`,
                  }))}
                  value={field.value ? field.value : null}
                  onValueChange={(value) => {
                    field.onChange(value ?? "");
                    const next = findCountryByName(value);
                    const currentCity = form.getValues("city");
                    if (next && currentCity && !next.cities.includes(currentCity)) {
                      form.setValue("city", "");
                    }
                    if (next) {
                      setDialCode(next.dialCode);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className={selectTriggerClassName}>
                      <SelectValue placeholder={t("customers.selectCountry")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((option) => (
                      <SelectItem key={option.code} value={option.name}>
                        <span className="flex items-center gap-2">
                          <span aria-hidden>{option.flag}</span>
                          {option.name}
                        </span>
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-medium">
                  {t("customers.cities")}
                </FormLabel>
                <Select
                  items={cityOptions.map((city) => ({ value: city, label: city }))}
                  value={field.value ? field.value : null}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  disabled={isSubmitting || cityOptions.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className={selectTriggerClassName}>
                      <MapPinIcon className="text-muted-foreground size-4" />
                      <SelectValue placeholder={t("customers.selectCities")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cityOptions.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormLabel className="text-muted-foreground text-xs font-medium">
                {t("customers.notes")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("customers.enterNotes")}
                  disabled={isSubmitting}
                  className="min-h-20 rounded-sm border-border bg-background px-3 py-3 text-sm shadow-none md:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <DialogClose
            render={
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                className="h-11 w-full rounded-sm bg-muted text-foreground hover:bg-muted/80"
              >
                {t("common.cancel")}
              </Button>
            }
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-sm bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            {isSubmitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {submitLabel || t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
