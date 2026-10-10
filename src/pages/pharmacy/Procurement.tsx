import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import YesNoBadge from "@/components/common/YesNoBadge";
import { Input } from "@/components/ui/input";
import { INITIAL_RECEIPTS } from "@/constants/procurementMockData";
import { END_OPTIONS } from "@/constants/clinicalOptions";
import { FORMULATION_OPTIONS, formulationLabel } from "@/constants/drugOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { bulkReceiptSchema, type BulkReceiptFormValues } from "@/lib/validations/procurement";
import { toNumber } from "@/lib/numberUtils";
import type { BulkReceiptRecord, Formulation } from "@/types/procurement";

const columns: Column<BulkReceiptRecord>[] = [
  { key: "dateOfReceipt", label: "Date of Receipt" },
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
  { key: "formulation", label: "Formulation", render: (r) => formulationLabel(r.formulation) },
  { key: "strength", label: "Strength" },
  { key: "supplierName", label: "Supplier" },
  { key: "quantityReceived", label: "Qty Received", render: (r) => <span className="font-black">{r.quantityReceived}</span> },
  { key: "totalAvailableStock", label: "Total Available", render: (r) => <span className="font-black">{r.totalAvailableStock}</span> },
  { key: "verifiedBy", label: "Verified By" },
  { key: "storageConfirmed", label: "Double Lock Storage", render: (r) => <YesNoBadge value={r.storageConfirmed} /> },
];

const emptyForm: BulkReceiptFormValues = {
  dateOfReceipt: "",
  drugName: "",
  formulation: "",
  strength: "",
  batchNumber: "",
  supplierName: "",
  invoiceNumber: "",
  invoiceDate: "",
  expiryDate: "",
  openingStock: "",
  quantityReceived: "",
  verifiedBy: "",
  storageConfirmed: "",
};

export default function Procurement() {
  const [receipts, setReceipts] = useState<BulkReceiptRecord[]>(INITIAL_RECEIPTS);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<BulkReceiptFormValues>({
    resolver: zodResolver(bulkReceiptSchema),
    defaultValues: emptyForm,
  });

  const [opening, received] = watch(["openingStock", "quantityReceived"]);
  const openingNum = toNumber(opening);
  const receivedNum = toNumber(received);
  const totalAvailable = openingNum !== null && receivedNum !== null ? openingNum + receivedNum : null;

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: BulkReceiptFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const openingStock = Number(data.openingStock);
    const quantityReceived = Number(data.quantityReceived);
    const record: BulkReceiptRecord = {
      id: `RCPT-${2000 + receipts.length + 1}`,
      dateOfReceipt: data.dateOfReceipt,
      drugName: data.drugName,
      formulation: data.formulation as Formulation,
      strength: data.strength,
      batchNumber: data.batchNumber,
      supplierName: data.supplierName,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate,
      expiryDate: data.expiryDate,
      openingStock,
      quantityReceived,
      totalAvailableStock: openingStock + quantityReceived,
      verifiedBy: data.verifiedBy,
      storageConfirmed: data.storageConfirmed === "yes",
    };
    setReceipts((prev) => [record, ...prev]);
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="Bulk Receipt Record"
        subtitle="Log incoming Essential Narcotic Drug (END) shipments at Central Pharmacy"
        actionLabel="Log New Receipt"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => setOpen(true)}
      />

      <DataTable columns={columns} rows={receipts} getRowId={(r) => r.id} emptyMessage="No receipts logged yet" />

      <FormDialog
        open={open}
        title="Log New Bulk Receipt"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Confirm Log Receipt"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <div className={FORM_GRID_CLASS}>
            <FormField label="Date of Receipt" error={errors.dateOfReceipt?.message}>
              <Input type="date" {...register("dateOfReceipt")} />
            </FormField>
            <FormField label="Essential Narcotic Drug Name" error={errors.drugName?.message}>
              <select className={SELECT_CLASS} {...register("drugName")}>
                <option value="" disabled>Select drug</option>
                {END_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Formulation" error={errors.formulation?.message}>
              <select className={SELECT_CLASS} {...register("formulation")}>
                <option value="" disabled>Select formulation</option>
                {FORMULATION_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Strength" error={errors.strength?.message}>
              <Input placeholder="e.g. 10 mg/ml" {...register("strength")} />
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Batch Number" error={errors.batchNumber?.message}>
              <Input placeholder="e.g. BATCH-9942" {...register("batchNumber")} />
            </FormField>
            <FormField label="Supplier Name (Authorized)" error={errors.supplierName?.message}>
              <Input placeholder="e.g. MedPharma Ltd" {...register("supplierName")} />
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Invoice Number" error={errors.invoiceNumber?.message}>
              <Input placeholder="e.g. INV-2026-0451" {...register("invoiceNumber")} />
            </FormField>
            <FormField label="Invoice Date" error={errors.invoiceDate?.message}>
              <Input type="date" {...register("invoiceDate")} />
            </FormField>
          </div>

          <FormField label="Expiry Date" error={errors.expiryDate?.message}>
            <Input type="date" {...register("expiryDate")} />
          </FormField>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Opening Stock (Before Receipt)" error={errors.openingStock?.message}>
              <Input type="number" placeholder="units" {...register("openingStock")} />
            </FormField>
            <FormField label="Quantity Received" error={errors.quantityReceived?.message}>
              <Input type="number" placeholder="units" {...register("quantityReceived")} />
            </FormField>
          </div>
          <p className="text-xs text-muted-foreground">
            Total Available Stock: <strong className="text-foreground">{totalAvailable ?? "—"}</strong> (calculated automatically)
          </p>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Verified By (Pharmacist Name)" error={errors.verifiedBy?.message}>
              <Input placeholder="e.g. Pharmacist R. Nair" {...register("verifiedBy")} />
            </FormField>
            <FormField label="Storage Confirmed (Double Lock System)" error={errors.storageConfirmed?.message}>
              <select className={SELECT_CLASS} {...register("storageConfirmed")}>
                <option value="" disabled>Select Yes or No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </FormField>
          </div>
        </form>
      </FormDialog>
    </>
  );
}