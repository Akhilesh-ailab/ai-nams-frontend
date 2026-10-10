import type { InventoryItem, AlertItem, ConsumptionPoint } from "@/types/inventory";

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "DRG-101", name: "Morphine Sulfate", schedule: "Schedule II", location: "Central Pharmacy Store", stock: 450, unit: "vials", status: "Optimal", risk: "Low" },
  { id: "DRG-102", name: "Fentanyl Citrate", schedule: "Schedule II", location: "ICU Ward", stock: 85, unit: "ampoules", status: "Low Stock", risk: "High" },
  { id: "DRG-103", name: "Oxycodone HCl", schedule: "Schedule II", location: "Central Pharmacy Store", stock: 320, unit: "tablets", status: "Optimal", risk: "Low" },
  { id: "DRG-104", name: "Hydromorphone", schedule: "Schedule II", location: "Operation Theatre (OT)", stock: 140, unit: "vials", status: "Optimal", risk: "Medium" },
  { id: "DRG-105", name: "Lorazepam", schedule: "Schedule IV", location: "Emergency Ward", stock: 245, unit: "ampoules", status: "Optimal", risk: "Low" },
];

export const INITIAL_ALERTS: AlertItem[] = [
  { id: "ALT-8801", drug: "Fentanyl 100mcg", location: "ICU Ward", time: "12 mins ago", severity: "Critical", details: "Physical count (85) differs from digital log (87)." },
  { id: "ALT-8802", drug: "Pethidine 50mg", location: "Central Pharmacy Store", time: "1 hour ago", severity: "Warning", details: "Batch #B-9942 expires in 14 days (40 vials remaining)." },
  { id: "ALT-8803", drug: "Morphine 10mg", location: "Emergency Ward", time: "3 hours ago", severity: "Warning", details: "Dispensing rate increased by 45% during shift transition." },
  { id: "ALT-8804", drug: "Oxycodone 20mg", location: "Operation Theatre (OT)", time: "5 hours ago", severity: "Info", details: "Authorized override by Dr. S. Mehta at 02:14 AM." },
];

export const CONSUMPTION_DATA: ConsumptionPoint[] = [
  { day: "Mon", morphine: 65, fentanyl: 40 },
  { day: "Tue", morphine: 80, fentanyl: 55 },
  { day: "Wed", morphine: 45, fentanyl: 70 },
  { day: "Thu", morphine: 95, fentanyl: 60 },
  { day: "Fri", morphine: 110, fentanyl: 85 },
  { day: "Sat", morphine: 75, fentanyl: 50 },
  { day: "Sun", morphine: 90, fentanyl: 65 },
];