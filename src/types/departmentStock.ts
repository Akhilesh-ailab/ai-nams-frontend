export interface DepartmentStockRecord {
  id: string;
  date: string;
  departmentName: string;
  drugName: string;
  openingBalance: number;
  quantityReceived: number;
  totalAvailable: number;
  quantityDispensed: number;
  closingBalanceRecorded: number;
  physicalVerifiedBalance: number;
  discrepancyPresent: boolean;
  discrepancyQuantity?: number;
  dateOfDetection?: string;
}