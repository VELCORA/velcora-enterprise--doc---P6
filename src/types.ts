/**
 * Velcora AI - Document Processing & Business Automation Data Models
 */

export type DocumentType = 
  | 'Invoice'
  | 'Purchase Order'
  | 'Commercial Contract'
  | 'Receipt'
  | 'Utility Bill'
  | 'Tax Form'
  | 'Financial Statement'
  | 'Other';

export type AnomalySeverity = 'low' | 'medium' | 'high';

export interface VendorInfo {
  name: string;
  address?: string;
  taxId?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface CustomerInfo {
  name: string;
  address?: string;
  accountId?: string;
}

export interface FinancialSummary {
  invoiceNumber: string;
  poNumber: string;
  documentDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}

export interface LineItem {
  id: string;
  itemCode?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: string;
}

export interface DocumentAnomaly {
  id: string;
  severity: AnomalySeverity;
  field: string;
  issue: string;
  recommendation: string;
}

export interface ActionableTrigger {
  id: string;
  ruleName: string;
  actionType: 'webhook' | 'email' | 'approval' | 'erp_sync' | 'flag_anomaly';
  targetSystem: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'triggered' | 'skipped' | 'failed';
  executedAt?: string;
  details?: string;
}

export interface ExtractedDocumentData {
  documentType: DocumentType;
  confidenceScore: number; // 0 - 100
  processingTimeMs: number;
  summary: string;
  vendorInfo: VendorInfo;
  customerInfo: CustomerInfo;
  financials: FinancialSummary;
  lineItems: LineItem[];
  anomalies: DocumentAnomaly[];
  keyClauses?: string[];
  actionableTriggers: ActionableTrigger[];
  rawTextExcerpt?: string;
}

export interface ProcessedDocumentRecord {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  status: 'processing' | 'processed' | 'needs_review' | 'archived';
  extractedData: ExtractedDocumentData;
  thumbnailUrl?: string;
  isSample?: boolean;
}

export interface SampleDocumentTemplate {
  id: string;
  title: string;
  category: DocumentType;
  description: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  previewImage?: string;
  sampleText: string;
  preExtractedData: ExtractedDocumentData;
}

export interface AutomationRule {
  id: string;
  name: string;
  conditionField: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'contains' | 'has_anomaly';
  conditionValue: string | number;
  action: string;
  targetEndpoint: string;
  enabled: boolean;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  documentId: string;
  targetSystem: string;
  payload: Record<string, any>;
  statusCode: number;
  responseMessage: string;
}
