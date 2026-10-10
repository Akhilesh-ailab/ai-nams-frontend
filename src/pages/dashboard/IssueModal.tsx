// IssueModal.tsx
import { useState } from "react";
import FormDialog from "@/components/common/FormDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IssueModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const selectClass = "w-full p-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function IssueModal({ open, onClose, onSuccess }: IssueModalProps) {
  const [form, setForm] = useState({ drugName: "Fentanyl Citrate 100mcg", dept: "ICU Ward", qty: "", requestedBy: "Dr. A. Sharma" });

  const handleSubmit = () => {
    if (!form.qty) return;
    onSuccess(`Stock issued to ${form.dept}: ${form.qty} units of ${form.drugName}`);
    setForm({ drugName: "Fentanyl Citrate 100mcg", dept: "ICU Ward", qty: "", requestedBy: "Dr. A. Sharma" });
    onClose();
  };

  return (
    <FormDialog open={open} title="Issue Stock to Department" onClose={onClose} onSubmit={handleSubmit} submitLabel="Authorize & Issue">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Target Department</Label>
          <select className={selectClass} value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
            <option>ICU Ward</option>
            <option>Operation Theatre (OT)</option>
            <option>Emergency Room (ER)</option>
            <option>Post-Op Care Unit</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Drug Selected</Label>
            <select className={selectClass} value={form.drugName} onChange={(e) => setForm({ ...form, drugName: e.target.value })}>
              <option>Fentanyl Citrate 100mcg</option>
              <option>Morphine Sulfate 10mg</option>
              <option>Oxycodone HCl 20mg</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Quantity to Issue</Label>
            <Input type="number" placeholder="e.g. 25" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Authorized Physician / Nurse</Label>
          <Input value={form.requestedBy} onChange={(e) => setForm({ ...form, requestedBy: e.target.value })} />
        </div>
      </div>
    </FormDialog>
  );
}