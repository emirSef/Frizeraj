"use client";

import { ClipboardListIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/utils/format";
import { useClientServiceRecords } from "../hooks/use-client-service-records";
import { serviceRecordDate, type ClientServiceRecord } from "../types";

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="col-span-2 text-sm whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

function RecordImages({ record }: { record: ClientServiceRecord }) {
  if (!record.before_image_url && !record.after_image_url) return null;

  return (
    <div className="flex flex-wrap gap-3 pt-1">
      {record.before_image_url ? (
        <figure className="space-y-1">
          <a href={record.before_image_url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={record.before_image_url}
              alt="Before"
              className="size-24 rounded-sm border object-cover"
            />
          </a>
          <figcaption className="text-muted-foreground text-center text-xs">Before</figcaption>
        </figure>
      ) : null}
      {record.after_image_url ? (
        <figure className="space-y-1">
          <a href={record.after_image_url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={record.after_image_url}
              alt="After"
              className="size-24 rounded-sm border object-cover"
            />
          </a>
          <figcaption className="text-muted-foreground text-center text-xs">After</figcaption>
        </figure>
      ) : null}
    </div>
  );
}

export function ServiceRecordsTab({ clientId }: { clientId: string | null }) {
  const recordsQuery = useClientServiceRecords(clientId);
  const records = recordsQuery.data ?? [];

  if (recordsQuery.isLoading) {
    return (
      <div className="space-y-2 py-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!records.length) {
    return (
      <EmptyState
        icon={ClipboardListIcon}
        title="No service records yet"
        description="Complete an appointment to record what was done to this customer's hair."
      />
    );
  }

  return (
    <div className="max-h-96 space-y-3 overflow-y-auto py-1">
      {records.map((record) => (
        <div key={record.id} className="rounded-sm border p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{formatDate(serviceRecordDate(record))}</span>
            {record.service?.name ? (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: record.service.color }}
                />
                {record.service.name}
              </span>
            ) : null}
          </div>

          <dl className="space-y-1.5">
            <Field label="Hair Condition" value={record.hair_condition} />
            <Field label="Treatment" value={record.treatment} />
            <Field label="Products Used" value={record.products_used} />
            <Field label="Color Formula" value={record.color_formula} />
            <Field label="Notes" value={record.notes} />
            <Field label="Recommendations" value={record.recommendations} />
          </dl>

          <RecordImages record={record} />
        </div>
      ))}
    </div>
  );
}
