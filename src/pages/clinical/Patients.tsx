import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { INITIAL_PATIENTS } from "@/constants/patientsMockData";
import { GENDER_OPTIONS, DEPARTMENT_OPTIONS } from "@/constants/clinicalOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { patientSchema, type PatientFormValues } from "@/lib/validations/patient";
import type { PatientRecord, Gender } from "@/types/patient";

const columns: Column<PatientRecord>[] = [
  { key: "uhid", label: "UHID" },
  { key: "patientNameOrCode", label: "Patient Name / Code", render: (row) => <span className="font-bold">{row.patientNameOrCode}</span> },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "wardUnit", label: "Ward / Unit" },
  { key: "diagnosis", label: "Diagnosis" },
  { key: "registeredOn", label: "Registered On" },
];

const emptyForm: PatientFormValues = {
  registeredOn: "",
  uhid: "",
  patientNameOrCode: "",
  age: "",
  gender: "",
  wardUnit: "",
  diagnosis: "",
};

export default function Patients() {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: emptyForm,
  });

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: PatientFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const record: PatientRecord = {
      id: `PAT-${5000 + patients.length + 1}`,
      uhid: data.uhid,
      patientNameOrCode: data.patientNameOrCode,
      age: Number(data.age),
      gender: data.gender as Gender,
      wardUnit: data.wardUnit,
      diagnosis: data.diagnosis,
      registeredOn: data.registeredOn,
    };
    setPatients((prev) => [record, ...prev]);
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="Patients"
        subtitle="Patients receiving Essential Narcotic Drugs (END)"
        actionLabel="Register Patient"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => setOpen(true)}
      />

      <DataTable columns={columns} rows={patients} getRowId={(row) => row.id} emptyMessage="No patients registered yet" />

      <FormDialog
        open={open}
        title="Register Patient"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Save Patient"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <div className={FORM_GRID_CLASS}>
            <FormField label="Date of Registration" error={errors.registeredOn?.message}>
              <Input type="date" {...register("registeredOn")} />
            </FormField>
            <FormField label="UHID" error={errors.uhid?.message}>
              <Input placeholder="e.g. UHID-102938" {...register("uhid")} />
            </FormField>
          </div>

          <FormField label="Patient Name or Code" error={errors.patientNameOrCode?.message}>
            <Input placeholder="e.g. P-4402" {...register("patientNameOrCode")} />
          </FormField>

          <div className={FORM_GRID_CLASS}>
            <FormField label="Age (years)" error={errors.age?.message}>
              <Input type="number" placeholder="e.g. 58" {...register("age")} />
            </FormField>
            <FormField label="Gender" error={errors.gender?.message}>
              <select className={SELECT_CLASS} {...register("gender")}>
                <option value="" disabled>Select gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Ward / Unit" error={errors.wardUnit?.message}>
            <select className={SELECT_CLASS} {...register("wardUnit")}>
              <option value="" disabled>Select ward / unit</option>
              {DEPARTMENT_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Diagnosis" error={errors.diagnosis?.message}>
            <Input placeholder="e.g. Cancer pain (palliative)" {...register("diagnosis")} />
          </FormField>
        </form>
      </FormDialog>
    </>
  );
}