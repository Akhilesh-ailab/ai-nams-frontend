export interface InventoryItem {
  id: string;
  name: string;
  schedule: string;
  location: string;
  stock: number;
  unit: string;
  status: "Optimal" | "Low Stock";
  risk: "Low" | "Medium" | "High";
}

export interface AlertItem {
  id: string;
  drug: string;
  location: string;
  time: string;
  severity: "Critical" | "Warning" | "Info";
  details: string;
}

export interface ConsumptionPoint {
  day: string;
  morphine: number;
  fentanyl: number;
}