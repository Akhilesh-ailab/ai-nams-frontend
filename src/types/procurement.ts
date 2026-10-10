export type Formulation = "Inj" | "Tab" | "Syrup" | "Patch" | "Other";

export interface BulkReceiptRecord {
  id: string;
  dateOfReceipt: string;
  drugName: string;
  formulation: Formulation;
  strength: string;
  batchNumber: string;
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string;
  expiryDate: string;
  openingStock: number;
  quantityReceived: number;
  totalAvailableStock: number;
  verifiedBy: string;
  storageConfirmed: boolean;
}