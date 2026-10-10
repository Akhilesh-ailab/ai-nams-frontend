import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { INITIAL_PRESCRIPTIONS } from "@/constants/prescriptionsMockData";
import { END_OPTIONS } from "@/constants/clinicalOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { prescriptionSchema, type PrescriptionFormValues } from "@/lib/validations/prescription";
import type { PrescriptionRecord } from "@/types/prescription";

const columns: Column<PrescriptionRecord>[] = [
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
  { key: "prescribingDoctor", label: "Prescribing Doctor" },
  { key: "endName", label: "Drug", render: (row) => <span className="font-bold">{row.endName}</span> },
  { key: "dose", label: "Dose" },
  { key: "frequency", label: "Frequency" },
  { key: "durationDays", label: "Duration (days)" },
  { key: "quantityPrescribed", label: "Qty Prescribed", render: (row) => <span className="font-black">{row.quantityPrescribed}</span> },
];

const emptyForm: PrescriptionFormValues = {
  date: "",
  uhid: "",
  patientNameOrCode: "",
  prescribingDoctor: "",
  endName: "",
  dose: "",
  frequency: "",
  durationDays: "",
  quantityPrescribed: "",
};

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(INITIAL_PRESCRIPTIONS);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: emptyForm,
  });

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: PrescriptionFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const record: PrescriptionRecord = {
      id: `RX-${5100 + prescriptions.length + 1}`,
      date: data.date,
      uhid: data.uhid,
      patientNameOrCode: data.patientNameOrCode,
      prescribingDoctor: data.prescribingDoctor,
      endName: data.endName,
      dose: data.dose,
      frequency: data.frequency,
      durationDays: Number(data.durationDays),
      quantityPrescribed: Number(data.quantityPrescribed),
    };
    setPrescriptions((prev) => [record, ...prev]);
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="Prescriptions"
        subtitle="Prescriptions for Essential Narcotic Drugs (END)"
        actionLabel="New Prescription"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => setOpen(true)}
      />

      <DataTable columns={columns} rows={prescriptions} getRowId={(row) => row.id} emptyMessage="No prescriptions yet" />

      <FormDialog
        open={open}
        title="New Prescription"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Save Prescription"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <div className={FORM_GRID_CLASS}>
            <FormField label="Date" error={errors.date?.message}>
              <Input type="date" {...register("date")} />
            </FormField>
            <FormField label="Prescribing Doctor" error={errors.prescribingDoctor?.message}>
              <Input placeholder="e.g. Dr. A. Sharma" {...register("prescribingDoctor")} />
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="UHID" error={errors.uhid?.message}>
              <Input placeholder="e.g. UHID-102938" {...register("uhid")} />
            </FormField>
            <FormField label="Patient Name or Code" error={errors.patientNameOrCode?.message}>
              <Input placeholder="e.g. P-4402" {...register("patientNameOrCode")} />
            </FormField>
          </div>

          <FormField label="Essential Narcotic Drug (END)" error={errors.endName?.message}>
            <select className={SELECT_CLASS} {...register("endName")}>
              <option value="" disabled>Select drug</option>
              {END_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </FormField>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Dose" error={errors.dose?.message}>
              <Input placeholder="e.g. 10 mg" {...register("dose")} />
            </FormField>
            <FormField label="Frequency" error={errors.frequency?.message}>
              <Input placeholder="e.g. Every 6 hours" {...register("frequency")} />
            </FormField>
          </div>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Duration (days)" error={errors.durationDays?.message}>
              <Input type="number" placeholder="e.g. 5" {...register("durationDays")} />
            </FormField>
            <FormField label="Quantity Prescribed" error={errors.quantityPrescribed?.message}>
              <Input type="number" placeholder="units" {...register("quantityPrescribed")} />
            </FormField>
          </div>
        </form>
      </FormDialog>
    </>
  );
}