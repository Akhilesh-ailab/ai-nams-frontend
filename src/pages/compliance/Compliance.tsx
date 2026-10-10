import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Plus, ShieldCheck, CheckCircle2, XCircle, ClipboardCheck } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import YesNoBadge from "@/components/common/YesNoBadge";
import HorizontalBarList from "@/components/charts/HorizontalBarList";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { INITIAL_COMPLIANCE_RECORDS } from "@/constants/complianceMockData";
import { COMPLIANCE_AREA_OPTIONS, COMPLIANCE_CHECKS, COMPLIANCE_RECORDER_ROLES } from "@/constants/complianceOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { complianceSchema, type ComplianceFormValues } from "@/lib/validations/compliance";
import { calculateScore, countFailedChecks, getScoreLevel, latestPerArea } from "@/lib/complianceUtils";
import type { RootState } from "@/redux/store";
import type { ComplianceChecks, ComplianceRecord } from "@/types/compliance";

const scoreClass = {
  good: "bg-success/10 text-success",
  fair: "bg-warning/10 text-warning",
  poor: "bg-destructive/10 text-destructive",
} as const;

const columns: Column<ComplianceRecord>[] = [
  { key: "date", label: "Date" },
  { key: "area", label: "Department / Area", render: (r) => <span className="font-bold">{r.area}</span> },
  ...COMPLIANCE_CHECKS.map(
    (check): Column<ComplianceRecord> => ({
      key: check.key,
      label: check.label,
      render: (r) => <YesNoBadge value={r[check.key]} />,
    })
  ),
  {
    key: "score",
    label: "Compliance Score",
    render: (r) => (
      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${scoreClass[getScoreLevel(r.score)]}`}>
        {r.score} / 100
      </span>
    ),
  },
  { key: "checkedBy", label: "Checked By" },
];

const emptyForm: ComplianceFormValues = {
  date: "",
  area: "",
  dailyClosingBalance: "",
  doubleLockStorage: "",
  dualSignature: "",
  monthlyReconciliation: "",
  inspectionReady: "",
};

export default function Compliance() {
  const user = useSelector((state: RootState) => state.auth.user);
  const canRecord = !!user && COMPLIANCE_RECORDER_ROLES.includes(user.role);

  const [records, setRecords] = useState<ComplianceRecord[]>(INITIAL_COMPLIANCE_RECORDS);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<ComplianceFormValues>({
    resolver: zodResolver(complianceSchema),
    defaultValues: emptyForm,
  });

  const values = watch();
  const allAnswered = COMPLIANCE_CHECKS.every((c) => values[c.key] === "yes" || values[c.key] === "no");
  const liveScore = allAnswered
    ? calculateScore(COMPLIANCE_CHECKS.filter((c) => values[c.key] === "yes").length)
    : null;

  const latest = useMemo(() => latestPerArea(records), [records]);
  const overall = latest.length > 0 ? Math.round(latest.reduce((sum, r) => sum + r.score, 0) / latest.length) : null;
  const fullyCompliant = latest.filter((r) => r.score === 100).length;
  const failedChecks = countFailedChecks(latest);
  const inspectionReady = latest.filter((r) => r.inspectionReady).length;
  const scoreBars = latest.map((r) => ({ label: r.area, value: r.score }));

  const stats = [
    { title: "Overall Compliance Score", value: overall === null ? "—" : `${overall}%`, subtitle: "Average of the latest check in each area", icon: ShieldCheck, iconBg: "#ECFEFF", iconColor: "#0891B2" },
    { title: "Fully Compliant Areas", value: `${fullyCompliant} of ${latest.length}`, subtitle: "Latest check scored 100 / 100", icon: CheckCircle2, iconBg: "#E7F9EF", iconColor: "#12B76A" },
    { title: "Failed Checks", value: String(failedChecks), subtitle: "Answered No in the latest checks", icon: XCircle, iconBg: "#FEECEB", iconColor: "#F04438" },
    { title: "Inspection Ready", value: `${inspectionReady} of ${latest.length}`, subtitle: "Areas ready for inspection at any time", icon: ClipboardCheck, iconBg: "#FFF4E5", iconColor: "#F79009" },
  ];

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: ComplianceFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const checks = Object.fromEntries(
      COMPLIANCE_CHECKS.map((c) => [c.key, data[c.key] === "yes"])
    ) as ComplianceChecks;
    const record: ComplianceRecord = {
      id: `CMP-${8000 + records.length + 1}`,
      date: data.date,
      area: data.area,
      ...checks,
      score: calculateScore(COMPLIANCE_CHECKS.filter((c) => checks[c.key]).length),
      checkedBy: user?.fullName ?? "Unknown",
    };
    setRecords((prev) => [record, ...prev]);
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="NDPS Compliance Check"
        subtitle="Compliance checks for Essential Narcotic Drugs (END) in Central Pharmacy and each department"
        actionLabel={canRecord ? "New Compliance Check" : undefined}
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={canRecord ? () => setOpen(true) : undefined}
      />

      {!canRecord && (
        <p className="mb-4 text-xs text-muted-foreground">You have read-only access to compliance records.</p>
      )}

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="text-base font-extrabold">Latest Score by Area</h3>
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </div>
            <HorizontalBarList items={scoreBars} max={100} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="text-base font-extrabold">How the Score Is Calculated</h3>
              <p className="text-xs text-muted-foreground">Each check answered Yes adds an equal share of the 100 points</p>
            </div>
            <ul className="space-y-2">
              {COMPLIANCE_CHECKS.map((check) => (
                <li key={check.key} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                  <span>{check.label}</span>
                  <span className="font-bold text-primary">+{100 / COMPLIANCE_CHECKS.length}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} rows={records} getRowId={(r) => r.id} emptyMessage="No compliance checks recorded yet" />

      <FormDialog
        open={open}
        title="New Compliance Check"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Save Check"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <div className={FORM_GRID_CLASS}>
            <FormField label="Date" error={errors.date?.message}>
              <Input type="date" {...register("date")} />
            </FormField>
            <FormField label="Department / Area" error={errors.area?.message}>
              <select className={SELECT_CLASS} {...register("area")}>
                <option value="" disabled>Select department / area</option>
                {COMPLIANCE_AREA_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </FormField>
          </div>

          {COMPLIANCE_CHECKS.map((check) => (
            <FormField key={check.key} label={check.label} error={errors[check.key]?.message}>
              <select className={SELECT_CLASS} {...register(check.key)}>
                <option value="" disabled>Select Yes or No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </FormField>
          ))}

          <p className="text-xs text-muted-foreground">
            Compliance Score: <strong className="text-foreground">{liveScore === null ? "—" : `${liveScore} / 100`}</strong> (calculated automatically)
          </p>
        </form>
      </FormDialog>
    </>
  );
}