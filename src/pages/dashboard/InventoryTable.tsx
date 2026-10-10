import { useState } from "react";
import { Search } from "lucide-react";
import DataTable, { type Column } from "@/components/common/DataTable";
import { INITIAL_INVENTORY } from "@/constants/dashboardMockData";
import type { InventoryItem } from "@/types/inventory";

const riskClass = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
} as const;

const statusClass = {
  Optimal: "bg-success/10 text-success",
  "Low Stock": "bg-destructive/10 text-destructive",
} as const;

const columns: Column<InventoryItem>[] = [
  {
    key: "name",
    label: "Drug Code & Name",
    render: (row) => (
      <div>
        <div className="font-bold">{row.name}</div>
        <span className="text-[10px] text-muted-foreground">{row.id}</span>
      </div>
    ),
  },
  { key: "schedule", label: "Schedule", render: (row) => <span className="px-2.5 py-1 bg-muted font-semibold rounded-md text-[11px]">{row.schedule}</span> },
  { key: "location", label: "Department / Location" },
  {
    key: "stock",
    label: "Current Stock",
    render: (row) => (
      <span className="font-black">
        {row.stock} <span className="text-[10px] text-muted-foreground font-normal">{row.unit}</span>
      </span>
    ),
  },
  { key: "status", label: "Status", render: (row) => <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${statusClass[row.status]}`}>{row.status}</span> },
  { key: "risk", label: "AI Risk", render: (row) => <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${riskClass[row.risk]}`}>{row.risk}</span> },
  {
    key: "action",
    label: "Action",
    align: "right",
    render: () => (
      <button className="px-3 py-1 bg-secondary hover:bg-secondary/70 text-primary font-bold rounded-lg transition-colors text-[11px]">
        Audit Log
      </button>
    ),
  },
];

export default function InventoryTable() {
  const [search, setSearch] = useState("");

  const rows = INITIAL_INVENTORY.filter(
    (item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase())
  );

  const header = (
    <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-extrabold">Central Pharmacy Stock Register</h3>
        <p className="text-xs text-muted-foreground">Real-time stock level and risk categorization</p>
      </div>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter table..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 pr-3 py-1.5 bg-muted rounded-lg text-xs border-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );

  return <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} header={header} emptyMessage="No matching drugs found" />;
}