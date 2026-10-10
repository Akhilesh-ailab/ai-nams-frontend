import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Target, Activity, TrendingUp, BellRing } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import TableTitle from "@/components/common/TableTitle";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DEFAULT_REORDER_SETTINGS, INITIAL_FORECAST_RECORDS, REORDER_SETTINGS } from "@/constants/forecastingMockData";
import { SEASONAL_FACTOR_OPTIONS } from "@/constants/aiOptions";
import { END_OPTIONS } from "@/constants/clinicalOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { forecastSchema, type ForecastFormValues } from "@/lib/validations/forecast";
import {
  absoluteError,
  calculateMetrics,
  calculateReorder,
  forecastAccuracy,
  formatMonth,
  placeholderForecast,
} from "@/lib/forecastUtils";
import type { ForecastRecord, SeasonalFactor } from "@/types/forecast";

interface NumericField {
  name: keyof ForecastFormValues;
  label: string;
}

const MONTHLY_FIELDS: NumericField[] = [
  { name: "openingStock", label: "Opening Stock (Start of Month)" },
  { name: "quantityReceived", label: "Total Quantity Received (Central Pharmacy)" },
  { name: "quantityIssued", label: "Total Quantity Issued to All Departments" },
  { name: "quantityDispensed", label: "Total Quantity Dispensed to Patients (Actual Consumption)" },
  { name: "closingStock", label: "Closing Stock (End of Month)" },
  { name: "stockOutDays", label: "Number of Stock-Out Days in Month" },
  { name: "emergencyIndents", label: "Number of Emergency Indents Raised" },
];

const LOAD_FIELDS: NumericField[] = [
  { name: "oncologyAdmissions", label: "Total Oncology Admissions This Month" },
  { name: "icuAdmissions", label: "Total ICU Admissions" },
  { name: "surgicalCases", label: "Total Surgical Cases" },
  { name: "palliativePatients", label: "Total Palliative Care Patients" },
  { name: "traumaCases", label: "Total Trauma Cases" },
  { name: "averageDosePerPatientMg", label: "Average Dose per Patient (mg)" },
];

const monthlyColumns: Column<ForecastRecord>[] = [
  { key: "month", label: "Month", render: (r) => <span className="font-bold">{formatMonth(r.month)}</span> },
  { key: "openingStock", label: "Opening Stock" },
  { key: "quantityReceived", label: "Received (Central Pharmacy)" },
  { key: "quantityIssued", label: "Issued to Departments" },
  { key: "quantityDispensed", label: "Dispensed (Actual)", render: (r) => <span className="font-black">{r.quantityDispensed}</span> },
  { key: "closingStock", label: "Closing Stock" },
  {
    key: "stockOutDays",
    label: "Stock-out Days",
    render: (r) => (
      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${r.stockOutDays > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
        {r.stockOutDays}
      </span>
    ),
  },
  { key: "emergencyIndents", label: "Emergency Indents" },
  { key: "aiPredictedConsumption", label: "AI Predicted", render: (r) => r.aiPredictedConsumption ?? "—" },
  { key: "absoluteError", label: "Absolute Error", render: (r) => absoluteError(r) ?? "—" },
  {
    key: "accuracy",
    label: "Forecast Accuracy",
    render: (r) => {
      const accuracy = forecastAccuracy(r);
      return accuracy === null ? "—" : `${accuracy.toFixed(1)}%`;
    },
  },
];

const loadColumns: Column<ForecastRecord>[] = [
  { key: "month", label: "Month", render: (r) => <span className="font-bold">{formatMonth(r.month)}</span> },
  { key: "oncologyAdmissions", label: "Oncology Admissions" },
  { key: "icuAdmissions", label: "ICU Admissions" },
  { key: "surgicalCases", label: "Surgical Cases" },
  { key: "palliativePatients", label: "Palliative Care Patients" },
  { key: "traumaCases", label: "Trauma Cases" },
  { key: "averageDosePerPatientMg", label: "Avg Dose per Patient (mg)" },
  { key: "seasonalFactor", label: "Seasonal Factor" },
];

const emptyForm: ForecastFormValues = {
  month: "",
  endName: "",
  openingStock: "",
  quantityReceived: "",
  quantityIssued: "",
  quantityDispensed: "",
  closingStock: "",
  stockOutDays: "",
  emergencyIndents: "",
  oncologyAdmissions: "",
  icuAdmissions: "",
  surgicalCases: "",
  palliativePatients: "",
  traumaCases: "",
  averageDosePerPatientMg: "",
  seasonalFactor: "",
};

export default function Forecasting() {
  const [records, setRecords] = useState<ForecastRecord[]>(INITIAL_FORECAST_RECORDS);
  const [selectedDrug, setSelectedDrug] = useState<string>(INITIAL_FORECAST_RECORDS[0].endName);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<ForecastFormValues>({
    resolver: zodResolver(forecastSchema),
    defaultValues: emptyForm,
  });

  const drugOptions = useMemo(() => Array.from(new Set(records.map((r) => r.endName))), [records]);

  const drugRecords = useMemo(
    () => records.filter((r) => r.endName === selectedDrug).sort((a, b) => a.month.localeCompare(b.month)),
    [records, selectedDrug]
  );

  const metrics = useMemo(() => calculateMetrics(drugRecords), [drugRecords]);

  const reorder = useMemo(
    () => calculateReorder(drugRecords, REORDER_SETTINGS[selectedDrug] ?? DEFAULT_REORDER_SETTINGS),
    [drugRecords, selectedDrug]
  );

  const openDialog = () => {
    reset({ ...emptyForm, endName: selectedDrug });
    setOpen(true);
  };

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: ForecastFormValues) => {
    if (records.some((r) => r.endName === data.endName && r.month === data.month)) {
      setError("month", { message: "A record for this drug and month already exists" });
      return;
    }
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const record: ForecastRecord = {
      id: `FC-${7000 + records.length + 1}`,
      month: data.month,
      endName: data.endName,
      openingStock: Number(data.openingStock),
      quantityReceived: Number(data.quantityReceived),
      quantityIssued: Number(data.quantityIssued),
      quantityDispensed: Number(data.quantityDispensed),
      closingStock: Number(data.closingStock),
      stockOutDays: Number(data.stockOutDays),
      emergencyIndents: Number(data.emergencyIndents),
      oncologyAdmissions: Number(data.oncologyAdmissions),
      icuAdmissions: Number(data.icuAdmissions),
      surgicalCases: Number(data.surgicalCases),
      palliativePatients: Number(data.palliativePatients),
      traumaCases: Number(data.traumaCases),
      averageDosePerPatientMg: Number(data.averageDosePerPatientMg),
      seasonalFactor: data.seasonalFactor as SeasonalFactor,
      aiPredictedConsumption: placeholderForecast(
        records.filter((r) => r.endName === data.endName),
        data.month
      ),
    };
    setRecords((prev) => [...prev, record]);
    setSelectedDrug(data.endName);
    closeDialog();
  };

  const stats = [
    { title: "Mean Absolute Error (MAE)", value: metrics ? metrics.mae.toFixed(1) : "—", subtitle: "Average gap between actual and predicted units", icon: Target, iconBg: "#ECFEFF", iconColor: "#0891B2" },
    { title: "Root Mean Square Error (RMSE)", value: metrics ? metrics.rmse.toFixed(1) : "—", subtitle: "Gives more weight to larger forecast misses", icon: Activity, iconBg: "#FFF4E5", iconColor: "#F79009" },
    { title: "Forecast Accuracy", value: metrics ? `${metrics.accuracy.toFixed(1)}%` : "—", subtitle: "Average of (1 − error ÷ actual) × 100", icon: TrendingUp, iconBg: "#E7F9EF", iconColor: "#12B76A" },
  ];

  const reorderItems = reorder
    ? [
        { label: "Average Monthly Consumption (Last 6 Months)", value: `${reorder.averageMonthlyConsumption} units` },
        { label: "Lead Time for Procurement", value: `${reorder.leadTimeDays} days` },
        { label: "Safety Stock Level", value: `${reorder.safetyStock} units` },
        { label: "Reorder Level", value: `${reorder.reorderLevel} units` },
        { label: "Current Closing Stock", value: `${reorder.currentStock} units` },
        { label: "Did AI Trigger Early Reorder Alert?", value: reorder.earlyReorderAlert ? "Yes" : "No" },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Forecasting"
        subtitle="Monthly consumption data, AI forecast accuracy and reorder levels for Essential Narcotic Drugs (END)"
        actionLabel="New Monthly Record"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={openDialog}
      />

      <div className="mb-6 max-w-xs">
        <FormField label="Essential Narcotic Drug (END)">
          <select className={SELECT_CLASS} value={selectedDrug} onChange={(e) => setSelectedDrug(e.target.value)}>
            {drugOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="space-y-6">
        <DataTable
          columns={monthlyColumns}
          rows={drugRecords}
          getRowId={(r) => r.id}
          emptyMessage="No monthly records for this drug yet"
          header={<TableTitle title="Monthly Consumption and AI Forecast" subtitle="Actual consumption compared with the AI prediction for each month" />}
        />

        <DataTable
          columns={loadColumns}
          rows={drugRecords}
          getRowId={(r) => r.id}
          emptyMessage="No patient load data for this drug yet"
          header={<TableTitle title="Patient Load Indicators" subtitle="Demand drivers that help the AI forecast more accurately" />}
        />

        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="text-base font-extrabold">Reorder Threshold and Safety Stock</h3>
              <p className="text-xs text-muted-foreground">Based on the last 6 months of actual consumption for {selectedDrug}</p>
            </div>

            {reorder ? (
              <>
                {reorder.earlyReorderAlert && (
                  <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <BellRing className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Early reorder alert: current stock ({reorder.currentStock}) is at or below the reorder level ({reorder.reorderLevel}). Place a new order now.
                    </span>
                  </div>
                )}
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {reorderItems.map((item) => (
                    <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                      <dt className="text-xs text-muted-foreground">{item.label}</dt>
                      <dd className="text-lg font-black">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-xs text-muted-foreground">
                  Reorder level = (average monthly consumption ÷ 30) × lead time + safety stock.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Add monthly records to calculate the reorder level.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <FormDialog
        open={open}
        title="New Monthly Record"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Save Record"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Monthly Consumption</p>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Month and Year" error={errors.month?.message}>
              <Input type="month" {...register("month")} />
            </FormField>
            <FormField label="Essential Narcotic Drug (END)" error={errors.endName?.message}>
              <select className={SELECT_CLASS} {...register("endName")}>
                <option value="" disabled>Select drug</option>
                {END_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            {MONTHLY_FIELDS.map((field) => (
              <FormField key={field.name} label={field.label} error={errors[field.name]?.message}>
                <Input type="number" placeholder="units" {...register(field.name)} />
              </FormField>
            ))}
          </div>

          <p className="pt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Patient Load Indicators</p>

          <div className={FORM_GRID_CLASS}>
            {LOAD_FIELDS.map((field) => (
              <FormField key={field.name} label={field.label} error={errors[field.name]?.message}>
                <Input type="number" step="any" {...register(field.name)} />
              </FormField>
            ))}
            <FormField label="Seasonal Factor" error={errors.seasonalFactor?.message}>
              <select className={SELECT_CLASS} {...register("seasonalFactor")}>
                <option value="" disabled>Select factor</option>
                {SEASONAL_FACTOR_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
          </div>

          <p className="text-xs text-muted-foreground">
            AI Predicted Consumption is added automatically. Until the real AI model is connected, it is the average of the previous 3 months.
          </p>
        </form>
      </FormDialog>
    </>
  );
}