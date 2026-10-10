import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { INITIAL_ISSUES } from "@/constants/departmentIssueMockData";
import { DEPARTMENT_OPTIONS, END_OPTIONS } from "@/constants/clinicalOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { departmentIssueSchema, type DepartmentIssueFormValues } from "@/lib/validations/departmentIssue";
import { toNumber } from "@/lib/numberUtils";
import type { DepartmentIssueRecord } from "@/types/departmentIssue";

const columns: Column<DepartmentIssueRecord>[] = [
  { key: "dateOfIssue", label: "Date of Issue" },
  {
    key: "drugName",
    label: "Drug Name",
    render: (r) => (
      <div>
        <div className="font-bold">{r.drugName}</div>
        <span className="text-[10px] text-muted-foreground">Batch: {r.batchNumber}</span>
      </div>
    ),
  },
  { key: "departmentName", label: "Department" },
  { key: "indentReferenceNumber", label: "Indent Ref. No." },
  { key: "quantityIssued", label: "Qty Issued", render: (r) => <span className="font-black">{r.quantityIssued}</span> },
  { key: "stockAfterIssue", label: "Stock After Issue", render: (r) => <span className="font-black">{r.stockAfterIssue}</span> },
  { key: "issuingPharmacist", label: "Issuing Pharmacist" },
  {
    key: "discrepancyNoted",
    label: "Discrepancy",
    render: (r) => (
      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${r.discrepancyNoted ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
        {r.discrepancyNoted ? `Yes (${r.discrepancyAmount ?? 0})` : "None"}
      </span>
    ),
  },
];

const emptyForm: DepartmentIssueFormValues = {
  dateOfIssue: "",
  departmentName: "",
  indentingOfficer: "",
  indentReferenceNumber: "",
  drugName: "",
  batchNumber: "",
  stockBeforeIssue: "",
  quantityIssued: "",
  departmentReceivingSignatory: "",
  issuingPharmacist: "",
  discrepancyNoted: "",
  discrepancyAmount: "",
};

export default function DepartmentIssue() {
  const [issues, setIssues] = useState<DepartmentIssueRecord[]>(INITIAL_ISSUES);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<DepartmentIssueFormValues>({
    resolver: zodResolver(departmentIssueSchema),
    defaultValues: emptyForm,
  });

  const [stockBefore, issued, discrepancyNoted] = watch(["stockBeforeIssue", "quantityIssued", "discrepancyNoted"]);
  const before = toNumber(stockBefore);
  const qty = toNumber(issued);
  const stockAfter = before !== null && qty !== null ? before - qty : null;

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: DepartmentIssueFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const stockBeforeIssue = Number(data.stockBeforeIssue);
    const quantityIssued = Number(data.quantityIssued);
    const noted = data.discrepancyNoted === "yes";
    const record: DepartmentIssueRecord = {
      id: `ISS-${3000 + issues.length + 1}`,
      dateOfIssue: data.dateOfIssue,
      departmentName: data.departmentName,
      indentingOfficer: data.indentingOfficer,
      indentReferenceNumber: data.indentReferenceNumber,
      drugName: data.drugName,
      batchNumber: data.batchNumber,
      quantityIssued,
      stockBeforeIssue,
      stockAfterIssue: stockBeforeIssue - quantityIssued,
      departmentReceivingSignatory: data.departmentReceivingSignatory,
      issuingPharmacist: data.issuingPharmacist,
      discrepancyNoted: noted,
      discrepancyAmount: noted ? Number(data.discrepancyAmount) : undefined,
    };
    setIssues((prev) => [record, ...prev]);
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="Issue to Department"
        subtitle="Record Central Pharmacy issues of Essential Narcotic Drugs (END) to hospital departments"
        actionLabel="New Department Issue"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => setOpen(true)}
      />

      <DataTable columns={columns} rows={issues} getRowId={(r) => r.id} emptyMessage="No issues logged yet" />

      <FormDialog
        open={open}
        title="Issue to Department"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Confirm Issue"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <div className={FORM_GRID_CLASS}>
            <FormField label="Date of Issue" error={errors.dateOfIssue?.message}>
              <Input type="date" {...register("dateOfIssue")} />
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

          <div className={FORM_GRID_CLASS}>
            <FormField label="Indenting Officer Name" error={errors.indentingOfficer?.message}>
              <Input placeholder="e.g. Dr. A. Sharma" {...register("indentingOfficer")} />
            </FormField>
            <FormField label="Indent Reference Number" error={errors.indentReferenceNumber?.message}>
              <Input placeholder="e.g. IND-2026-118" {...register("indentReferenceNumber")} />
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Drug Name" error={errors.drugName?.message}>
              <select className={SELECT_CLASS} {...register("drugName")}>
                <option value="" disabled>Select drug</option>
                {END_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Batch Number" error={errors.batchNumber?.message}>
              <Input placeholder="e.g. BATCH-7710" {...register("batchNumber")} />
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Stock Before Issue" error={errors.stockBeforeIssue?.message}>
              <Input type="number" placeholder="units" {...register("stockBeforeIssue")} />
            </FormField>
            <FormField label="Quantity Issued" error={errors.quantityIssued?.message}>
              <Input type="number" placeholder="units" {...register("quantityIssued")} />
            </FormField>
          </div>
          <p className="text-xs text-muted-foreground">
            Stock After Issue: <strong className="text-foreground">{stockAfter ?? "—"}</strong> (calculated automatically)
          </p>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Department Receiving Signatory" error={errors.departmentReceivingSignatory?.message}>
              <Input placeholder="e.g. Nurse Anita M." {...register("departmentReceivingSignatory")} />
            </FormField>
            <FormField label="Central Pharmacy Issuing Pharmacist" error={errors.issuingPharmacist?.message}>
              <Input placeholder="e.g. Pharmacist R. Nair" {...register("issuingPharmacist")} />
            </FormField>
          </div>

          <FormField label="Discrepancy Noted at Issue?" error={errors.discrepancyNoted?.message}>
            <select className={SELECT_CLASS} {...register("discrepancyNoted")}>
              <option value="" disabled>Select Yes or No</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>

          {discrepancyNoted === "yes" && (
            <FormField label="Discrepancy Amount" error={errors.discrepancyAmount?.message}>
              <Input type="number" placeholder="units" {...register("discrepancyAmount")} />
            </FormField>
          )}
        </form>
      </FormDialog>
    </>
  );
}