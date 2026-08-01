"use client";

import * as React from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslations } from "@/i18n";
import { clientLabel, type CalendarClient } from "../types";

interface CustomerComboboxProps {
  clients: CalendarClient[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  accentColor?: string;
  invalid?: boolean;
}

export function CustomerCombobox({
  clients,
  value,
  onChange,
  disabled,
  accentColor = "#3b82f6",
  invalid,
}: CustomerComboboxProps) {
  const t = useTranslations();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const selected = clients.find((client) => client.id === value) ?? null;
  const selectedLabel = selected ? clientLabel(selected) : "";

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return clients;
    return clients.filter((client) =>
      clientLabel(client).toLowerCase().includes(normalized),
    );
  }, [clients, query]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "border-input bg-background flex h-11 items-center gap-2 rounded-xl border px-3 transition-colors",
          open && "border-ring ring-ring/50 ring-3",
          invalid && "border-destructive ring-destructive/20 ring-3",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <SearchIcon className="text-muted-foreground size-4 shrink-0" />
        <input
          type="text"
          value={open ? query : selectedLabel}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!open) setOpen(true);
            if (value) onChange("");
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("calendar.enterCustomer")}
          disabled={disabled}
          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          autoComplete="off"
        />
        <span
          aria-hidden
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <ChevronDownIcon
          className={cn(
            "text-muted-foreground size-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </div>

      {open ? (
        <div className="bg-popover text-popover-foreground absolute top-[calc(100%+0.35rem)] left-0 z-50 max-h-56 w-full overflow-y-auto rounded-xl border shadow-md">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground px-3 py-2.5 text-sm">
              {t("calendar.noCustomersFound")}
            </p>
          ) : (
            <ul className="p-1">
              {filtered.map((client) => {
                const label = clientLabel(client);
                const isSelected = client.id === value;
                return (
                  <li key={client.id}>
                    <button
                      type="button"
                      className={cn(
                        "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-lg px-3 py-2 text-left text-sm",
                        isSelected && "bg-accent text-accent-foreground",
                      )}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        onChange(client.id);
                        setOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
