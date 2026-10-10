import { useState } from "react";
import FormDialog from "@/components/common/FormDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const selectClass = "w-full p-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function ReceiptModal({ open, onClose, onSuccess }: ReceiptModalProps) {
  const [form, setForm] = useState({ drugName: "Morphine Sulfate 10mg", batchNo: "", qty: "", location: "Central Pharmacy Store" });

  const handleSubmit = () => {
    if (!form.qty || !form.batchNo) return;
    onSuccess(`Bulk drug receipt logged successfully: ${form.qty} units of ${form.drugName}`);
    setForm({ drugName: "Morphine Sulfate 10mg", batchNo: "", qty: "", location: "Central Pharmacy Store" });
    onClose();
  };

  return (
    <FormDialog open={open} title="Log New Bulk Receipt" onClose={onClose} onSubmit={handleSubmit} submitLabel="Confirm Log Receipt">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Drug Name</Label>
          <select className={selectClass} value={form.drugName} onChange={(e) => setForm({ ...form, drugName: e.target.value })}>
            <option>Morphine Sulfate 10mg</option>
            <option>Fentanyl Citrate 100mcg</option>
            <option>Oxycodone HCl 20mg</option>
            <option>Hydromorphone 2mg</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Batch / Lot Number</Label>
            <Input placeholder="e.g. BATCH-9942" value={form.batchNo} onChange={(e) => setForm({ ...form, batchNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Quantity Received</Label>
            <Input type="number" placeholder="e.g. 500" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Storage Location</Label>
          <select className={selectClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
            <option>Central Pharmacy Store</option>
            <option>ICU Ward</option>
            <option>Operation Theatre (OT)</option>
            <option>Emergency Ward</option>
          </select>
        </div>
      </div>
    </FormDialog>
  );
}