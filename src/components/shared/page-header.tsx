import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Content shown immediately after the title on the same row (e.g. view toggles). */
  titleAside?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Consistent page title block with an optional description and action slot
 * (e.g. a primary "New" button) aligned to the right.
 */
export function PageHeader({
  title,
  description,
  titleAside,
  actions,
  className,
}: PageHeaderProps) {
  const flushAside = Boolean(titleAside) && !description;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:justify-between",
        flushAside ? "sm:items-stretch" : "sm:items-center",
        className,
      )}
    >
      <div className={cn("min-w-0", description && "space-y-1")}>
        <div
          className={cn(
            "flex flex-wrap gap-x-5 gap-y-2",
            flushAside ? "items-stretch" : "items-center",
          )}
        >
          <h1
            className={cn(
              "text-2xl font-semibold tracking-tight",
              flushAside && "pb-5",
            )}
          >
            {title}
          </h1>
          {titleAside}
        </div>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {actions ? (
        <div className={cn("flex shrink-0 items-center gap-2", flushAside && "pb-5")}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
