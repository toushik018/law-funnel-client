// This declares the pdfjs-dist library's global object for TypeScript.
// The library is loaded via a script tag in index.html, making `pdfjsLib` a global variable.
declare global {
  const pdfjsLib: any;
  const jspdf: any;
  const html2canvas: any;
}

export enum AppState {
  IDLE,
  PROCESSING_PDF,
  EXTRACTING_DATA,
  GENERATING_NOTICE,
  SUCCESS,
  ERROR,
}

export type ClientType = 'company' | 'private';

export interface InvoiceData {
  dueDate: string; // Fälligkeitsdatum
  totalAmount: number; // Rechnungsbetrag
  clientName: string; // Name des Kunden
  clientAddress: string; // Adresse des Kunden
  invoiceNumber: string; // Rechnungsnummer
  invoiceDate: string; // Rechnungsdatum
}

export interface Demands {
  mainAmount: string;
  interestAmount: string;
  flatFee: string; // e.g. "40,00 €" or ""
  totalAmount: string;
}

export interface PaymentNoticeContent {
  subject: string;
  body: string[]; // an array of paragraphs for the main body
  demands: Demands;
}

export interface CompanyDetails {
  name: string;
  address: string;
  contact: string;
  bankName: string;
  iban: string;
  bic: string;
  signerName?: string;
}

export interface LawyerDetails {
  name: string;
}

// Case Management Types
export enum CaseStatus {
  DRAFT = 'draft',
  QUALIFICATION_COMPLETE = 'qualification_complete',
  SIGNATURE_COMPLETE = 'signature_complete',
  CLIENT_TYPE_SELECTED = 'client_type_selected',
  INVOICE_PROCESSED = 'invoice_processed',
  NOTICE_GENERATED = 'notice_generated',
  NOTICE_SENT = 'notice_sent',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface LegalQualificationData {
  isLegalProfessional: boolean;
  hasPermissionToCollect: boolean;
  understandsLegalConsequences: boolean;
  acceptsLiability: boolean;
  confirmedAccuracy: boolean;
}

export interface DigitalSignatureData {
  signatureData: string; // Base64 encoded signature
  signerName: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface InterestCalculation {
  clientType: ClientType;
  daysOverdue: number;
  baseInterestRate: number;
  calculatedInterestRate: number;
  interestAmount: number;
  flatFee: number;
  totalLateFee: number;
  newTotalAmount: number;
}

export interface CaseData {
  id: string;
  userId: string;
  caseNumber: string;
  status: CaseStatus;
  title?: string;
  legalQualification?: LegalQualificationData;
  digitalSignature?: DigitalSignatureData;
  clientType?: ClientType;
  originalFileName?: string;
  invoiceData?: InvoiceData;
  interestCalculation?: InterestCalculation;
  paymentNotice?: PaymentNoticeContent;
  workflowStartedAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStatistics {
  total: number;
  byStatus: Record<CaseStatus, number>;
  recentActivity: number;
}