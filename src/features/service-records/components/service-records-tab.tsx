"use client";

import { ClipboardListIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useTranslations } from "@/i18n";
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

function RecordImages({
  record,
  beforeLabel,
  afterLabel,
}: {
  record: ClientServiceRecord;
  beforeLabel: string;
  afterLabel: string;
}) {
  if (!record.before_image_url && !record.after_image_url) return null;

  return (
    <div className="flex flex-wrap gap-3 pt-1">
      {record.before_image_url ? (
        <figure className="space-y-1">
          <a href={record.before_image_url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={record.before_image_url}
              alt={beforeLabel}
              className="size-24 rounded-sm border object-cover"
            />
          </a>
          <figcaption className="text-muted-foreground text-center text-xs">{beforeLabel}</figcaption>
        </figure>
      ) : null}
      {record.after_image_url ? (
        <figure className="space-y-1">
          <a href={record.after_image_url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={record.after_image_url}
              alt={afterLabel}
              className="size-24 rounded-sm border object-cover"
            />
          </a>
          <figcaption className="text-muted-foreground text-center text-xs">{afterLabel}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}

export function ServiceRecordsTab({ clientId }: { clientId: string | null }) {
  const t = useTranslations();
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
        title={t("serviceRecords.noRecordsYet")}
        description={t("serviceRecords.noRecordsDescription")}
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
            <Field label={t("serviceRecords.hairCondition")} value={record.hair_condition} />
            <Field label={t("serviceRecords.treatment")} value={record.treatment} />
            <Field label={t("serviceRecords.productsUsed")} value={record.products_used} />
            <Field label={t("serviceRecords.colorFormula")} value={record.color_formula} />
            <Field label={t("serviceRecords.notes")} value={record.notes} />
            <Field label={t("serviceRecords.recommendations")} value={record.recommendations} />
          </dl>

          <RecordImages
            record={record}
            beforeLabel={t("serviceRecords.beforePhoto")}
            afterLabel={t("serviceRecords.afterPhoto")}
          />
        </div>
      ))}
    </div>
  );
}
