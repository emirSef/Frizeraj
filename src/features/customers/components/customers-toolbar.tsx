"use client";

import {
  ArrowDownWideNarrowIcon,
  LayoutGridIcon,
  ListFilterIcon,
  ListIcon,
  SearchIcon,
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
import { Input } from "@/components/ui/input";
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

interface CustomersToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  view: CustomerViewMode;
  onViewChange: (view: CustomerViewMode) => void;
  sortField: CustomerSortField;
  sortOrder: SortOrder;
  onSortChange: (sortField: CustomerSortField, sortOrder: SortOrder) => void;
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  isFetching: boolean;
}

export function CustomersToolbar({
  search,
  onSearchChange,
  view,
  onViewChange,
  sortField,
  sortOrder,
  onSortChange,
  filters,
  onFiltersChange,
  isFetching,
}: CustomersToolbarProps) {
  const t = useTranslations();
  const activeFilters = countActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-xs">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("customers.searchPlaceholder")}
          className="pl-8"
          aria-label={t("customers.searchPlaceholder")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isFetching ? (
          <span className="text-muted-foreground mr-1 text-xs">{t("customers.updating")}</span>
        ) : null}

        <ToggleGroup
          aria-label={t("customers.view")}
          value={[view]}
          onValueChange={(value) => {
            const next = value[0] as CustomerViewMode | undefined;
            if (next) onViewChange(next);
          }}
        >
          <ToggleGroupItem value="list">
            <ListIcon />
            {t("customers.listView")}
          </ToggleGroupItem>
          <ToggleGroupItem value="grid">
            <LayoutGridIcon />
            {t("customers.gridView")}
          </ToggleGroupItem>
        </ToggleGroup>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline">
                <ArrowDownWideNarrowIcon />
                {t("customers.sortBy")}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
              <DropdownMenuRadioItem value="desc">
                {t("customers.descending")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline">
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
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
      </div>
    </div>
  );
}
