"use client";

import * as React from "react";
import { addDays, addMonths, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n";

const DAYS_IN_WEEK = 7;
const WEEKS_SHOWN = 6;

/** A Monday, used to render weekday labels in the grid's column order. */
const REFERENCE_MONDAY = new Date(2024, 0, 1);

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface MiniCalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  className?: string;
}

/**
 * Compact month grid for quickly jumping to a date. Weeks start on Monday and
 * month/weekday labels follow the active app locale.
 */
export function MiniCalendar({ selected, onSelect, className }: MiniCalendarProps) {
  const { locale, t } = useLocale();

  // `new Date()` resolves against the server's timezone during SSR, so the grid
  // is only built after mount to keep hydration stable.
  const [today, setToday] = React.useState<Date | null>(null);
  const [monthOffset, setMonthOffset] = React.useState(0);

  React.useEffect(() => setToday(new Date()), []);

  const anchor = selected ?? today;
  const month = anchor ? startOfMonth(addMonths(anchor, monthOffset)) : null;

  const weekdays = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    return Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
      capitalize(formatter.format(addDays(REFERENCE_MONDAY, index)).slice(0, 2)),
    );
  }, [locale]);

  const days = React.useMemo(() => {
    if (!month) return [];
    const gridStart = startOfWeek(month, { weekStartsOn: 1 });
    return Array.from({ length: DAYS_IN_WEEK * WEEKS_SHOWN }, (_, index) =>
      addDays(gridStart, index),
    );
  }, [month]);

  if (!month) {
    return <div className={cn("bg-card h-[16.5rem] rounded-xl border", className)} aria-hidden />;
  }

  const title = capitalize(
    new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month),
  );

  return (
    <div className={cn("bg-card rounded-xl border p-3", className)}>
      <div className="flex items-center justify-between gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={t("calendar.previousMonth")}
          onClick={() => setMonthOffset((offset) => offset - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-sm font-medium">{title}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={t("calendar.nextMonth")}
          onClick={() => setMonthOffset((offset) => offset + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-0.5">
        {weekdays.map((weekday, index) => (
          <span
            key={index}
            className="text-muted-foreground flex h-6 items-center justify-center text-[0.65rem] font-medium"
          >
            {weekday}
          </span>
        ))}

        {days.map((day) => {
          const isOutside = !isSameMonth(day, month);
          const isToday = today ? isSameDay(day, today) : false;
          const isSelected = selected ? isSameDay(day, selected) : false;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect?.(day)}
              aria-current={isToday ? "date" : undefined}
              aria-pressed={isSelected}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex h-7 items-center justify-center rounded-lg text-xs tabular-nums transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
                isOutside && "text-muted-foreground/40",
                isToday && !isSelected && "text-foreground font-semibold",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-medium",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
