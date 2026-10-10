import type { DepartmentStockRecord } from "@/types/departmentStock";

export const INITIAL_STOCK_REGISTER: DepartmentStockRecord[] = [
  {
    id: "STK-4001",
    date: "2026-09-21",
    departmentName: "ICU Ward",
    drugName: "Fentanyl Citrate",
    openingBalance: 40,
    quantityReceived: 15,
    totalAvailable: 55,
    quantityDispensed: 10,
    closingBalanceRecorded: 45,
    physicalVerifiedBalance: 45,
    discrepancyPresent: false,
  },
  {
    id: "STK-4002",
    date: "2026-09-21",
    departmentName: "Operation Theatre (OT)",
    drugName: "Hydromorphone",
    openingBalance: 30,
    quantityReceived: 10,
    totalAvailable: 40,
    quantityDispensed: 8,
    closingBalanceRecorded: 32,
    physicalVerifiedBalance: 30,
    discrepancyPresent: true,
    discrepancyQuantity: 2,
    dateOfDetection: "2026-09-21",
  },
];