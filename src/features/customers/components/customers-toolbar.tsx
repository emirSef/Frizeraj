"use client";

import {
  ArrowDownWideNarrowIcon,
  LayoutGridIcon,
  ListFilterIcon,
  Rows2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from "@/i18n";
import {
  countActiveFilters,
  DEFAULT_CUSTOMER_FILTERS,
  type CustomerFilters,
  type CustomerGenderFilter,
  type CustomerSortField,
  type CustomerStatusFilter,
  type CustomerViewMode,
  type SortOrder,
} from "../types";

const SORT_FIELDS: { value: CustomerSortField; labelKey: string }[] = [
  { value: "name", labelKey: "customers.fullName" },
  { value: "email", labelKey: "customers.email" },
  { value: "phone", labelKey: "customers.phone" },
  { value: "city", labelKey: "customers.city" },
  { value: "created_at", labelKey: "customers.dateAdded" },
];

const STATUS_OPTIONS: { value: CustomerStatusFilter; labelKey: string }[] = [
  { value: "all", labelKey: "customers.allStatuses" },
  { value: "active", labelKey: "customers.active" },
  { value: "new", labelKey: "customers.new" },
];

const GENDER_OPTIONS: { value: CustomerGenderFilter; labelKey: string }[] = [
  { value: "all", labelKey: "customers.allGenders" },
  { value: "female", labelKey: "customers.female" },
  { value: "male", labelKey: "customers.male" },
];

interface CustomersViewToggleProps {
  view: CustomerViewMode;
  onViewChange: (view: CustomerViewMode) => void;
}

export function CustomersViewToggle({ view, onViewChange }: CustomersViewToggleProps) {
  const t = useTranslations();

  return (
    <ToggleGroup
      aria-label={t("customers.view")}
      value={[view]}
      onValueChange={(value) => {
        const next = value[0] as CustomerViewMode | undefined;
        if (next) onViewChange(next);
      }}
      className="bg-transparent h-auto gap-5 self-stretch rounded-none p-0"
    >
      <ToggleGroupItem
        value="list"
        className="text-muted-foreground data-pressed:text-foreground relative h-auto min-h-full gap-2 self-stretch rounded-none border-0 bg-transparent px-0.5 pb-5 text-sm font-medium shadow-none hover:bg-transparent data-pressed:bg-transparent data-pressed:shadow-none after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-foreground after:opacity-0 data-pressed:after:opacity-100 dark:data-pressed:bg-transparent"
      >
        <Rows2Icon className="size-4" strokeWidth={2} />
        {t("customers.listView")}
      </ToggleGroupItem>
      <ToggleGroupItem
        value="grid"
        className="text-muted-foreground data-pressed:text-foreground relative h-auto min-h-full gap-2 self-stretch rounded-none border-0 bg-transparent px-0.5 pb-5 text-sm font-medium shadow-none hover:bg-transparent data-pressed:bg-transparent data-pressed:shadow-none after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-foreground after:opacity-0 data-pressed:after:opacity-100 dark:data-pressed:bg-transparent"
      >
        <LayoutGridIcon className="size-4" strokeWidth={2} />
        {t("customers.gridView")}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

interface CustomersSortFilterProps {
  sortField: CustomerSortField;
  sortOrder: SortOrder;
  onSortChange: (sortField: CustomerSortField, sortOrder: SortOrder) => void;
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
}

export function CustomersSortFilter({
  sortField,
  sortOrder,
  onSortChange,
  filters,
  onFiltersChange,
}: CustomersSortFilterProps) {
  const t = useTranslations();
  const activeFilters = countActiveFilters(filters);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="border-foreground">
              <ArrowDownWideNarrowIcon />
              {t("customers.sortBy")}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48 rounded-sm">
          <DropdownMenuRadioGroup
            value={sortField}
            onValueChange={(value) => onSortChange(value as CustomerSortField, sortOrder)}
          >
            <DropdownMenuLabel>{t("customers.sortBy")}</DropdownMenuLabel>
            {SORT_FIELDS.map((field) => (
              <DropdownMenuRadioItem key={field.value} value={field.value}>
                {t(field.labelKey)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sortOrder}
            onValueChange={(value) => onSortChange(sortField, value as SortOrder)}
          >
            <DropdownMenuLabel>{t("customers.order")}</DropdownMenuLabel>
            <DropdownMenuRadioItem value="asc">{t("customers.ascending")}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">{t("customers.descending")}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="border-foreground">
              <ListFilterIcon />
              {t("customers.filter")}
              {activeFilters > 0 ? (
                <span className="bg-primary text-primary-foreground ml-0.5 inline-flex size-4 items-center justify-center rounded-full text-[0.625rem] font-semibold">
                  {activeFilters}
                </span>
              ) : null}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48 rounded-sm">
          <DropdownMenuRadioGroup
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value as CustomerStatusFilter })
            }
          >
            <DropdownMenuLabel>{t("customers.status")}</DropdownMenuLabel>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.gender}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, gender: value as CustomerGenderFilter })
            }
          >
            <DropdownMenuLabel>{t("customers.gender")}</DropdownMenuLabel>
            {GENDER_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          {activeFilters > 0 ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onFiltersChange(DEFAULT_CUSTOMER_FILTERS)}>
                {t("customers.clearFilters")}
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
