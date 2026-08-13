import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  Layers,
  Wand2,
} from 'lucide-react';
import { DocumentType, SampleDocumentTemplate } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

interface DocumentUploaderProps {
  onProcessDocument: (payload: {
    fileData?: string;
    mimeType?: string;
    textContent?: string;
    fileName: string;
    documentCategory: DocumentType;
  }) => void;
  isProcessing: boolean;
  onLoadSample: (sample: SampleDocumentTemplate) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onProcessDocument,
  isProcessing,
  onLoadSample,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'paste' | 'generate'>('upload');
  const [selectedCategory, setSelectedCategory] = useState<DocumentType>('Invoice');
  const [pastedText, setPastedText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick generator sample generator function
  const handleGenerateTestDocument = () => {
    const invNum = Math.floor(100000 + Math.random() * 900000);
    const poNum = Math.floor(10000 + Math.random() * 90000);
    const today = new Date().toISOString().split('T')[0];

    const generatedDoc = `INVOICE / BILL OF SALE
==================================================
Vendor: Delta Cybernetics Corp
Address: 100 Innovation Way, Suite 400, Austin, TX 78701
EIN / Tax ID: US-991820491
Phone: +1 (512) 555-0199 | Email: billing@deltacyber.io

CUSTOMER / BILLED TO:
Name: Velcora Enterprise Corp
Address: 750 Enterprise Blvd, Suite 1200, New York, NY 10005
Account ID: ACC-889102

DOCUMENT DETAILS:
Invoice Number: INV-${invNum}
PO Reference: PO-${poNum}
Invoice Date: ${today}
Payment Terms: NET 30 (Due in 30 Days)
Currency: USD ($)

LINE ITEMS:
--------------------------------------------------
1. SKU-ENT-01: Enterprise Cloud Node Cluster
   Qty: 2 | Unit Price: $1,200.00 | Amount: $2,400.00
2. SKU-INTEG-02: System Onboarding & API Integration
   Qty: 1 | Unit Price: $800.00 | Amount: $800.00
3. SKU-SUPP-03: 24/7 SLA Priority Technical Support
   Qty: 1 | Unit Price: $300.00 | Amount: $300.00

FINANCIAL SUMMARY:
--------------------------------------------------
Subtotal: $3,500.00
Tax (8.25% State Sales Tax): $288.75
Discount: $0.00
TOTAL AMOUNT DUE: $3,788.75

REMITTANCE INSTRUCTIONS:
Please remit electronic ACH wire payments to Chase Bank (Routing: 021000021, Acct: 9918204192).
Late payments subject to 1.5% late fee per month.`;

    setPastedText(generatedDoc);
    setActiveMode('paste');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFile({
        name: file.name,
        size: `${sizeMb} MB`,
        type: file.type || 'application/pdf',
        dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeMode === 'upload') {
      if (!uploadedFile) return;
      onProcessDocument({
        fileData: uploadedFile.dataUrl,
        mimeType: uploadedFile.type,
        fileName: uploadedFile.name,
        documentCategory: selectedCategory,
      });
    } else {
      if (!pastedText.trim()) return;
      onProcessDocument({
        textContent: pastedText,
        fileName: `Text_Document_${Date.now().toString().slice(-4)}`,
        documentCategory: selectedCategory,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="mb-8 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>VELCORA ENTERPRISE INTAKE WORKBENCH</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Document Intake & Multimodal OCR Pipeline
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Ingest enterprise financial documents, purchase orders, leases, or raw text. Velcora automatically parses structured fields, validates line items math, detects risk anomalies, and triggers ERP webhooks.
        </p>
      </div>

      {/* Main Upload Box Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Mode & Category Controls */}
        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Mode Selector */}
          <div className="flex items-center space-x-1 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveMode('upload')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeMode === 'upload'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('paste')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeMode === 'paste'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateTestDocument}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all border border-blue-200 dark:border-blue-900/50"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generate Test Invoice</span>
            </button>
          </div>

          {/* Document Type Category Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-zinc-500 whitespace-nowrap">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DocumentType)}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Invoice">Invoice / Bill</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Commercial Contract">Commercial Contract</option>
              <option value="Receipt">Expense Receipt</option>
              <option value="Utility Bill">Utility Bill</option>
              <option value="Tax Form">Tax Form (W-9 / 1099)</option>
              <option value="Financial Statement">Financial Statement</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="p-6">
          {activeMode === 'upload' ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.005]'
                    : uploadedFile
                    ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-950/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf,image/png,image/jpeg,image/webp,text/plain,text/csv"
                  className="hidden"
                />

                {uploadedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-xs font-mono text-zinc-500 mt-0.5">
                        {uploadedFile.size} • {uploadedFile.type}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold mt-2"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        Drag and drop your document here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Supports PDF, PNG, JPG, WEBP, TXT, CSV (Up to 50MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-semibold mb-2">
                  Paste Document Raw Text
                </label>
                <textarea
                  rows={10}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste invoice content, purchase order text, or contract terms here..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="mt-6 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <div className="text-xs text-zinc-500 font-mono">
              Status: {isProcessing ? 'Processing OCR...' : 'Ready for Ingestion'}
            </div>

            <button
              type="submit"
              disabled={isProcessing || (activeMode === 'upload' && !uploadedFile) || (activeMode === 'paste' && !pastedText.trim())}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow transition-all ${
                isProcessing || (activeMode === 'upload' && !uploadedFile) || (activeMode === 'paste' && !pastedText.trim())
                  ? 'bg-zinc-300 dark:bg-zinc-800 cursor-not-allowed text-zinc-500'
                  : 'bg-blue-600 hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 shadow-blue-500/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Processing Extraction...</span>
                </>
              ) : (
                <>
                  <span>Run Document OCR & Extraction</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase font-mono">
              Line Item Recalculation
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Automatically verifies subtotal math and flags item price mismatches instantly.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
          <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase font-mono">
              Compliance & Risk Auditing
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Detects duplicate billing, missing tax registration IDs, or non-standard payment terms.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
          <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase font-mono">
              Direct ERP Webhook Dispatch
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Pushes verified JSON payloads directly to SAP, Workday, QuickBooks, or custom APIs.
            </p>
          </div>
        </div>

        {/* Sample Document Library */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider">
              Or load a sample document
            </h3>
            <span className="text-xs text-zinc-500 font-mono">No upload needed — pre-parsed demo data</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_DOCUMENTS.map((s) => (
              <div key={s.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col">
                <span className="self-start px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                  {s.category}
                </span>
                <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                  {s.title}
                </h4>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed flex-1">
                  {s.description}
                </p>
                <button
                  type="button"
                  onClick={() => onLoadSample(s)}
                  className="mt-3 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Load Sample
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
