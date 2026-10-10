import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import FormDialog from "@/components/common/FormDialog";
import FormField from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { INITIAL_DRUGS } from "@/constants/drugMasterMockData";
import { FORMULATION_OPTIONS, formulationLabel } from "@/constants/drugOptions";
import { FORM_GRID_CLASS, FORM_SCROLL_CLASS, SELECT_CLASS } from "@/constants/formStyles";
import { drugSchema, type DrugFormValues } from "@/lib/validations/drug";
import type { DrugRecord } from "@/types/drug";
import type { Formulation } from "@/types/procurement";

const columns: Column<DrugRecord>[] = [
  { key: "id", label: "Drug Code" },
  { key: "name", label: "Essential Narcotic Drug (END)", render: (r) => <span className="font-bold">{r.name}</span> },
  { key: "formulation", label: "Formulation", render: (r) => formulationLabel(r.formulation) },
  { key: "strength", label: "Strength" },
];

const emptyForm: DrugFormValues = { name: "", formulation: "", strength: "" };

export default function DrugMaster() {
  const [drugs, setDrugs] = useState<DrugRecord[]>(INITIAL_DRUGS);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<DrugFormValues>({
    resolver: zodResolver(drugSchema),
    defaultValues: emptyForm,
  });

  const closeDialog = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: DrugFormValues) => {
    const exists = drugs.some(
      (d) =>
        d.name.toLowerCase() === data.name.trim().toLowerCase() &&
        d.formulation === data.formulation &&
        d.strength.toLowerCase() === data.strength.trim().toLowerCase()
    );
    if (exists) {
      setError("name", { message: "This drug with the same formulation and strength already exists" });
      return;
    }
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    const record: DrugRecord = {
      id: `DRG-${100 + drugs.length + 1}`,
      name: data.name.trim(),
      formulation: data.formulation as Formulation,
      strength: data.strength.trim(),
    };
    setDrugs((prev) => [...prev, record]);
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="Drug Master"
        subtitle="Master list of Essential Narcotic Drugs (END) handled by the hospital"
        actionLabel="Add Drug"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => setOpen(true)}
      />

      <DataTable columns={columns} rows={drugs} getRowId={(r) => r.id} emptyMessage="No drugs added yet" />

      <FormDialog
        open={open}
        title="Add Drug"
        onClose={closeDialog}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isSubmitting ? "Saving..." : "Save Drug"}
        loading={isSubmitting}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_SCROLL_CLASS}>
          <FormField label="Essential Narcotic Drug Name" error={errors.name?.message}>
            <Input placeholder="e.g. Morphine Sulfate" {...register("name")} />
          </FormField>
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
        </form>
      </FormDialog>
    </>
  );
}