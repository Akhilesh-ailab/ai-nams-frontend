
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { INITIAL_DISPENSING } from "@/constants/dispensingMockData";
import { DEPARTMENT_OPTIONS, END_OPTIONS } from "@/constants/clinicalOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { dispensingSchema, type DispensingFormValues } from "@/lib/validations/dispensing";
import { toNumber } from "@/lib/numberUtils";
import type { DispensingRecord } from "@/types/dispensing";

const columns: Column<DispensingRecord>[] = [
  { key: "date", label: "Date" },
  {
    key: "patientNameOrCode",
    label: "Patient",
    render: (row) => (
      <div>
        <div className="font-bold">{row.patientNameOrCode}</div>
        <span className="text-[10px] text-muted-foreground">{row.uhid}</span>
      </div>
    ),
  },
  { key: "diagnosis", label: "Diagnosis" },
  { key: "wardUnit", label: "Ward / Unit" },
  { key: "prescribingDoctor", label: "Prescribing Doctor" },
  {
    key: "endName",
    label: "Drug",
    render: (row) => (
      <div>
        <div className="font-bold">{row.endName}</div>
        <span className="text-[10px] text-muted-foreground">{row.dose} · {row.frequency}</span>
      </div>
    ),
  },
  { key: "quantityIssued", label: "Qty Issued", render: (row) => <span className="font-black">{row.quantityIssued}</span> },
  {
    key: "departmentStockAfter",
    label: "Dept. Stock (Before → After)",
    render: (row) => (
      <span>
        {row.departmentStockBefore} → <strong>{row.departmentStockAfter}</strong>
      </span>
    ),
  },
  { key: "administeringNurseSignature", label: "Administering Nurse" },
];

const emptyForm: DispensingFormValues = {
  date: "",
  patientNameOrCode: "",
  uhid: "",
  diagnosis: "",
  wardUnit: "",
  prescribingDoctor: "",
  endName: "",
  dose: "",
  frequency: "",
  departmentStockBefore: "",
  quantityIssued: "",
  patientAttenderSignature: "",
  administeringNurseSignature: "",
};

export default function Dispensing() {
  const [records, setRecords] = useState<DispensingRecord[]>(INITIAL_DISPENSING);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<DispensingFormValues>({
    resolver: zodResolver(dispensingSchema),
    defaultValues: emptyForm,
  });

  const [stockBefore, issued] = watch(["departmentStockBefore", "quantityIssued"]);
  const before = toNumber(stockBefore);
  const qty = toNumber(issued);
  const stockAfter = before !== null && qty !== null ? before - qty : null;

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: DispensingFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const departmentStockBefore = Number(data.departmentStockBefore);
    const quantityIssued = Number(data.quantityIssued);
    const record: DispensingRecord = {
      id: `DSP-${6000 + records.length + 1}`,
      date: data.date,
      patientNameOrCode: data.patientNameOrCode,
      uhid: data.uhid,
      diagnosis: data.diagnosis,
      wardUnit: data.wardUnit,
      prescribingDoctor: data.prescribingDoctor,
      endName: data.endName,
      dose: data.dose,
      frequency: data.frequency,
      quantityIssued,
      departmentStockBefore,
      departmentStockAfter: departmentStockBefore - quantityIssued,
      patientAttenderSignature: data.patientAttenderSignature,
      administeringNurseSignature: data.administeringNurseSignature,
    };
    setRecords((prev) => [record, ...prev]);
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="Patient-wise Dispensing Record"
        subtitle="Record every dose of an Essential Narcotic Drug (END) given to a patient"
        actionLabel="New Dispensing Record"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => setOpen(true)}
      />

      <DataTable columns={columns} rows={records} getRowId={(row) => row.id} emptyMessage="No dispensing records yet" />

      <FormDialog
        open={open}
        title="New Dispensing Record"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Save Record"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <div className={FORM_GRID_CLASS}>
            <FormField label="Date" error={errors.date?.message}>
              <Input type="date" {...register("date")} />
            </FormField>
            <FormField label="Patient Name or Code" error={errors.patientNameOrCode?.message}>
              <Input placeholder="e.g. P-4402" {...register("patientNameOrCode")} />
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="UHID" error={errors.uhid?.message}>
              <Input placeholder="e.g. UHID-102938" {...register("uhid")} />
            </FormField>
            <FormField label="Ward / Unit" error={errors.wardUnit?.message}>
              <select className={SELECT_CLASS} {...register("wardUnit")}>
                <option value="" disabled>Select ward / unit</option>
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Diagnosis" error={errors.diagnosis?.message}>
            <Input placeholder="e.g. Post-operative pain management" {...register("diagnosis")} />
          </FormField>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Prescribing Doctor" error={errors.prescribingDoctor?.message}>
              <Input placeholder="e.g. Dr. A. Sharma" {...register("prescribingDoctor")} />
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
            <FormField label="Dose" error={errors.dose?.message}>
              <Input placeholder="e.g. 50 mcg" {...register("dose")} />
            </FormField>
            <FormField label="Frequency" error={errors.frequency?.message}>
              <Input placeholder="e.g. Every 6 hours" {...register("frequency")} />
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Department Stock Before Issue" error={errors.departmentStockBefore?.message}>
              <Input type="number" placeholder="units" {...register("departmentStockBefore")} />
            </FormField>
            <FormField label="Quantity Issued" error={errors.quantityIssued?.message}>
              <Input type="number" placeholder="units" {...register("quantityIssued")} />
            </FormField>
          </div>
          <p className="text-xs text-muted-foreground">
            Department Stock After Issue: <strong className="text-foreground">{stockAfter ?? "—"}</strong> (calculated automatically)
          </p>

          <div className={FORM_GRID_CLASS}>
            <FormField
              label="Patient / Attender Signature"
              error={errors.patientAttenderSignature?.message}
              hint="Typed name for now; digital signature capture can replace this later."
            >
              <Input placeholder="e.g. Attender: R. Kumar" {...register("patientAttenderSignature")} />
            </FormField>
            <FormField label="Administering Nurse Signature" error={errors.administeringNurseSignature?.message}>
              <Input placeholder="e.g. Nurse Anita M." {...register("administeringNurseSignature")} />
            </FormField>
          </div>
        </form>
      </FormDialog>
    </>
  );
}
