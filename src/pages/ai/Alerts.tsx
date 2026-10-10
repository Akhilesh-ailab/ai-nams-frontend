import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Clock, CheckCircle2, XCircle, Target } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import { INITIAL_AI_ALERTS } from "@/constants/aiAlertsMockData";
import { ACTION_OPTIONS, ALERT_FILTERS, ALERT_REVIEWER_ROLES, VALIDATION_OPTIONS } from "@/constants/aiOptions";
import { SELECT_CLASS } from "@/constants/formStyles";
import { alertReviewSchema, type AlertReviewFormValues } from "@/lib/validations/alertReview";
import { formatDateTime, formatResponseTime, getRiskLevel } from "@/lib/alertUtils";
import type { RootState } from "@/redux/store";
import type { AiAlertRecord, ActionTaken, ValidationResult } from "@/types/aiAlert";

const riskClass = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-muted text-muted-foreground",
} as const;

const validationClass = {
  "True Positive": "bg-destructive/10 text-destructive",
  "False Positive": "bg-muted text-muted-foreground",
} as const;

const emptyReview: AlertReviewFormValues = { validation: "", actionTaken: "" };

export default function Alerts() {
  const user = useSelector((state: RootState) => state.auth.user);
  const canReview = !!user && ALERT_REVIEWER_ROLES.includes(user.role);

  const [alerts, setAlerts] = useState<AiAlertRecord[]>(INITIAL_AI_ALERTS);
  const [filter, setFilter] = useState<(typeof ALERT_FILTERS)[number]>("All");
  const [selected, setSelected] = useState<AiAlertRecord | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AlertReviewFormValues>({
    resolver: zodResolver(alertReviewSchema),
    defaultValues: emptyReview,
  });

  const closeDialog = () => {
    reset();
    setSelected(null);
  };

  const onSubmit = async (data: AlertReviewFormValues) => {
    if (!selected) return;
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const reviewedAt = new Date().toISOString();
    setAlerts((prev) =>
      prev.map(
        (a): AiAlertRecord =>
          a.id === selected.id
            ? {
                ...a,
                status: "Reviewed",
                validation: data.validation as ValidationResult,
                actionTaken: data.actionTaken as ActionTaken,
                reviewedBy: user?.fullName ?? "Unknown",
                reviewedAt,
              }
            : a
      )
    );
    closeDialog();
  };

  const pending = alerts.filter((a) => a.status === "Pending Review").length;
  const truePositives = alerts.filter((a) => a.validation === "True Positive").length;
  const falsePositives = alerts.filter((a) => a.validation === "False Positive").length;
  const reviewed = truePositives + falsePositives;
  const accuracy = reviewed > 0 ? Math.round((truePositives / reviewed) * 100) : null;

  const stats = [
    { title: "Pending Review", value: String(pending), subtitle: "Waiting for the pharmacologist", icon: Clock, iconBg: "#FFF4E5", iconColor: "#F79009" },
    { title: "True Positive", value: String(truePositives), subtitle: "Confirmed as real issues", icon: CheckCircle2, iconBg: "#FEECEB", iconColor: "#F04438" },
    { title: "False Positive", value: String(falsePositives), subtitle: "Dismissed as false alarms", icon: XCircle, iconBg: "#F1F5F9", iconColor: "#64748B" },
    { title: "Alert Accuracy", value: accuracy === null ? "—" : `${accuracy}%`, subtitle: "True positives among reviewed alerts", icon: Target, iconBg: "#ECFEFF", iconColor: "#0D9488" },
  ];

  const rows = filter === "All" ? alerts : alerts.filter((a) => a.status === filter);

  const columns: Column<AiAlertRecord>[] = [
    { key: "generatedAt", label: "Generated", render: (row) => formatDateTime(row.generatedAt) },
    { key: "alertType", label: "Alert Type", render: (row) => <span className="font-bold">{row.alertType}</span> },
    { key: "drugName", label: "Drug" },
    { key: "department", label: "Department" },
    {
      key: "riskScore",
      label: "AI Risk",
      render: (row) => {
        const level = getRiskLevel(row.riskScore);
        return (
          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${riskClass[level]}`}>
            {Math.round(row.riskScore * 100)}% · {level}
          </span>
        );
      },
    },
    {
      key: "reason",
      label: "Why the AI flagged this",
      render: (row) => <span className="block max-w-[18rem] whitespace-normal text-xs text-muted-foreground">{row.reason}</span>,
    },
    {
      key: "validation",
      label: "Validation by Pharmacologist",
      render: (row) =>
        row.validation ? (
          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${validationClass[row.validation]}`}>{row.validation}</span>
        ) : (
          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-warning/10 text-warning">Pending Review</span>
        ),
    },
    { key: "actionTaken", label: "Action Taken", render: (row) => row.actionTaken ?? "—" },
    { key: "reviewedAt", label: "Response Time", render: (row) => formatResponseTime(row.generatedAt, row.reviewedAt) },
    {
      key: "id",
      label: "Action",
      align: "right",
      render: (row) =>
        row.status === "Pending Review" && canReview ? (
          <button
            onClick={() => setSelected(row)}
            className="px-3 py-1 bg-secondary hover:bg-secondary/70 text-primary font-bold rounded-lg transition-colors text-[11px]"
          >
            Review
          </button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="AI Alerts"
        subtitle="Alerts raised by the AI engine, reviewed and validated by a pharmacologist"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {ALERT_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
        {!canReview && (
          <span className="text-xs text-muted-foreground">Only a Pharmacologist can validate alerts. You are viewing in read-only mode.</span>
        )}
      </div>

      <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} emptyMessage="No alerts in this view" />

      <FormDialog
        open={selected !== null}
        title="Review AI Alert"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Save Review"}
        loading={isSubmitting}
      >
        <div className="space-y-4">
          {selected && (
            <div className="space-y-1 rounded-xl border border-border bg-muted/50 p-3 text-sm">
              <p>
                <span className="font-bold">{selected.alertType}</span> · {selected.drugName} · {selected.department}
              </p>
              <p className="text-xs text-muted-foreground">{selected.reason}</p>
              <p className="text-xs">
                AI Risk: <strong>{Math.round(selected.riskScore * 100)}%</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField label="Validation by Pharmacologist" error={errors.validation?.message}>
              <select className={SELECT_CLASS} {...register("validation")}>
                <option value="" disabled>Select result</option>
                {VALIDATION_OPTIONS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Action Taken" error={errors.actionTaken?.message}>
              <select className={SELECT_CLASS} {...register("actionTaken")}>
                <option value="" disabled>Select action</option>
                {ACTION_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </FormField>
          </form>
        </div>
      </FormDialog>
    </>
  );
}