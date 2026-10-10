export interface DepartmentIssueRecord {
  id: string;
  dateOfIssue: string;
  departmentName: string;
  indentingOfficer: string;
  indentReferenceNumber: string;
  drugName: string;
  batchNumber: string;
  quantityIssued: number;
  stockBeforeIssue: number;
  stockAfterIssue: number;
  departmentReceivingSignatory: string;
  issuingPharmacist: string;
  discrepancyNoted: boolean;
  discrepancyAmount?: number;
}