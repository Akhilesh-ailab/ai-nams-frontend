import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { INITIAL_STOCK_REGISTER } from "@/constants/departmentStockMockData";
import { DEPARTMENT_OPTIONS, END_OPTIONS } from "@/constants/clinicalOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { departmentStockSchema, type DepartmentStockFormValues } from "@/lib/validations/departmentStock";
import { toNumber } from "@/lib/numberUtils";
import type { DepartmentStockRecord } from "@/types/departmentStock";

const columns: Column<DepartmentStockRecord>[] = [
  { key: "date", label: "Date" },
  { key: "departmentName", label: "Department" },
  { key: "drugName", label: "Drug Name" },
  { key: "openingBalance", label: "Opening Balance" },
  { key: "quantityReceived", label: "Received from Pharmacy" },
  { key: "totalAvailable", label: "Total Available", render: (r) => <span className="font-black">{r.totalAvailable}</span> },
  { key: "quantityDispensed", label: "Dispensed to Patients" },
  { key: "closingBalanceRecorded", label: "Closing (Recorded)", render: (r) => <span className="font-black">{r.closingBalanceRecorded}</span> },
  { key: "physicalVerifiedBalance", label: "Physical Verified", render: (r) => <span className="font-black">{r.physicalVerifiedBalance}</span> },
  {
    key: "discrepancyPresent",
    label: "Discrepancy",
    render: (r) => (
      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${r.discrepancyPresent ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
        {r.discrepancyPresent ? `Yes (${r.discrepancyQuantity ?? 0})` : "None"}
      </span>
    ),
  },
];

const emptyForm: DepartmentStockFormValues = {
  date: "",
  departmentName: "",
  drugName: "",
  openingBalance: "",
  quantityReceived: "",
  quantityDispensed: "",
  closingBalanceRecorded: "",
  physicalVerifiedBalance: "",
  dateOfDetection: "",
};

export default function DepartmentStockRegister() {
  const [records, setRecords] = useState<DepartmentStockRecord[]>(INITIAL_STOCK_REGISTER);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<DepartmentStockFormValues>({
    resolver: zodResolver(departmentStockSchema),
    defaultValues: emptyForm,
  });

  const [opening, received, recorded, physical] = watch([
    "openingBalance",
    "quantityReceived",
    "closingBalanceRecorded",
    "physicalVerifiedBalance",
  ]);
  const openingNum = toNumber(opening);
  const receivedNum = toNumber(received);
  const recordedNum = toNumber(recorded);
  const physicalNum = toNumber(physical);

  const totalAvailable = openingNum !== null && receivedNum !== null ? openingNum + receivedNum : null;
  const discrepancy = recordedNum !== null && physicalNum !== null ? Math.abs(recordedNum - physicalNum) : null;
  const hasDiscrepancy = discrepancy !== null && discrepancy > 0;

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: DepartmentStockFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const openingBalance = Number(data.openingBalance);
    const quantityReceived = Number(data.quantityReceived);
    const closingBalanceRecorded = Number(data.closingBalanceRecorded);
    const physicalVerifiedBalance = Number(data.physicalVerifiedBalance);
    const difference = Math.abs(closingBalanceRecorded - physicalVerifiedBalance);

    const record: DepartmentStockRecord = {
      id: `STK-${4000 + records.length + 1}`,
      date: data.date,
      departmentName: data.departmentName,
      drugName: data.drugName,
      openingBalance,
      quantityReceived,
      totalAvailable: openingBalance + quantityReceived,
      quantityDispensed: Number(data.quantityDispensed),
      closingBalanceRecorded,
      physicalVerifiedBalance,
      discrepancyPresent: difference > 0,
      discrepancyQuantity: difference > 0 ? difference : undefined,
      dateOfDetection: difference > 0 ? data.dateOfDetection : undefined,
    };
    setRecords((prev) => [record, ...prev]);
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="Departmental Stock Register"
        subtitle="Daily opening, received, dispensed and closing balance of Essential Narcotic Drugs (END) in each department"
        actionLabel="New Register Entry"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => setOpen(true)}
      />

      <DataTable columns={columns} rows={records} getRowId={(r) => r.id} emptyMessage="No register entries yet" />

      <FormDialog
        open={open}
        title="New Stock Register Entry"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Save Entry"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <div className={FORM_GRID_CLASS}>
            <FormField label="Date" error={errors.date?.message}>
              <Input type="date" {...register("date")} />
            </FormField>
            <FormField label="Department Name" error={errors.departmentName?.message}>
              <select className={SELECT_CLASS} {...register("departmentName")}>
                <option value="" disabled>Select department</option>
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Essential Narcotic Drug Name" error={errors.drugName?.message}>
            <select className={SELECT_CLASS} {...register("drugName")}>
              <option value="" disabled>Select drug</option>
              {END_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </FormField>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Opening Balance" error={errors.openingBalance?.message}>
              <Input type="number" placeholder="units" {...register("openingBalance")} />
            </FormField>
            <FormField label="Quantity Received from Central Pharmacy" error={errors.quantityReceived?.message}>
              <Input type="number" placeholder="units" {...register("quantityReceived")} />
            </FormField>
          </div>
          <p className="text-xs text-muted-foreground">
            Total Available: <strong className="text-foreground">{totalAvailable ?? "—"}</strong> (calculated automatically)
          </p>

          <FormField label="Quantity Dispensed to Patients" error={errors.quantityDispensed?.message}>
            <Input type="number" placeholder="units" {...register("quantityDispensed")} />
          </FormField>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Closing Balance (Recorded)" error={errors.closingBalanceRecorded?.message}>
              <Input type="number" placeholder="units" {...register("closingBalanceRecorded")} />
            </FormField>
            <FormField label="Physical Verified Balance" error={errors.physicalVerifiedBalance?.message}>
              <Input type="number" placeholder="units" {...register("physicalVerifiedBalance")} />
            </FormField>
          </div>

          {hasDiscrepancy && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Discrepancy present: recorded and physical balance differ by <strong>{discrepancy}</strong> units.
                </span>
              </div>
              <FormField label="Date of Detection" error={errors.dateOfDetection?.message}>
                <Input type="date" {...register("dateOfDetection")} />
              </FormField>
            </div>
          )}
        </form>
      </FormDialog>
    </>
  );
}