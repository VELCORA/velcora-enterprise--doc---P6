import React, { useState } from 'react';
import {
  ExtractedDocumentData,
  LineItem,
  DocumentAnomaly,
  DocumentType,
} from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Send,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  FileCode,
  FileText,
  ShieldCheck,
  Building2,
  DollarSign,
  Calendar,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  Check,
} from 'lucide-react';

interface StructuredDataViewerProps {
  data: ExtractedDocumentData;
  onUpdateData: (updated: ExtractedDocumentData) => void;
  fileName?: string;
  fileData?: string;
  rawTextExcerpt?: string;
  onDispatchWebhook?: (targetSystem: string) => void;
  webhookStatus?: {
    success: boolean;
    targetSystem: string;
    message: string;
    timestamp: string;
  } | null;
}

export const StructuredDataViewer: React.FC<StructuredDataViewerProps> = ({
  data,
  onUpdateData,
  fileName = 'Document',
  fileData,
  rawTextExcerpt,
  onDispatchWebhook,
  webhookStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'json' | 'audit'>('editor');
  const [selectedTargetSystem, setSelectedTargetSystem] = useState('SAP / Workday ERP');
  const [isApproved, setIsApproved] = useState(false);
  const [approvalTimestamp, setApprovalTimestamp] = useState<string | null>(null);

  // Document Canvas View controls
  const [zoomLevel, setZoomLevel] = useState(100);
  const [highlightField, setHighlightField] = useState<string | null>(null);

  // Live Math Check
  const calculatedSubtotal = data.lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const calculatedTotal = calculatedSubtotal + (Number(data.financials.taxAmount) || 0) - (Number(data.financials.discountAmount) || 0);
  const mathMismatch = Math.abs(calculatedSubtotal - Number(data.financials.subtotal)) > 0.05 || Math.abs(calculatedTotal - Number(data.financials.totalAmount)) > 0.05;

  // Handlers for editable fields
  const handleVendorChange = (field: keyof typeof data.vendorInfo, value: string) => {
    onUpdateData({
      ...data,
      vendorInfo: {
        ...data.vendorInfo,
        [field]: value,
      },
    });
  };

  const handleFinancialChange = (field: keyof typeof data.financials, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    const newFinancials = {
      ...data.financials,
      [field]: typeof data.financials[field] === 'number' ? numValue : value,
    };

    onUpdateData({
      ...data,
      financials: newFinancials,
    });
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updatedItems = [...data.lineItems];
    const item = { ...updatedItems[index], [field]: value };

    // Auto update item amount if quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : Number(item.quantity);
      const p = field === 'unitPrice' ? Number(value) : Number(item.unitPrice);
      item.amount = Number((q * p).toFixed(2));
    }

    updatedItems[index] = item;

    // Recalculate subtotal & total
    const newSubtotal = updatedItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const newTotal = newSubtotal + (Number(data.financials.taxAmount) || 0) - (Number(data.financials.discountAmount) || 0);

    onUpdateData({
      ...data,
      lineItems: updatedItems,
      financials: {
        ...data.financials,
        subtotal: Number(newSubtotal.toFixed(2)),
        totalAmount: Number(newTotal.toFixed(2)),
      },
    });
  };

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: `item-${data.lineItems.length + 1}`,
      itemCode: `SKU-${100 + data.lineItems.length}`,
      description: 'New Services / Products Item',
      quantity: 1,
      unitPrice: 100.0,
      amount: 100.0,
      category: 'General Expense',
    };

    const updatedItems = [...data.lineItems, newItem];
    const newSubtotal = updatedItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const newTotal = newSubtotal + (Number(data.financials.taxAmount) || 0) - (Number(data.financials.discountAmount) || 0);

    onUpdateData({
      ...data,
      lineItems: updatedItems,
      financials: {
        ...data.financials,
        subtotal: Number(newSubtotal.toFixed(2)),
        totalAmount: Number(newTotal.toFixed(2)),
      },
    });
  };

  const handleDeleteLineItem = (index: number) => {
    const updatedItems = data.lineItems.filter((_, idx) => idx !== index);
    const newSubtotal = updatedItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const newTotal = newSubtotal + (Number(data.financials.taxAmount) || 0) - (Number(data.financials.discountAmount) || 0);

    onUpdateData({
      ...data,
      lineItems: updatedItems,
      financials: {
        ...data.financials,
        subtotal: Number(newSubtotal.toFixed(2)),
        totalAmount: Number(newTotal.toFixed(2)),
      },
    });
  };

  const handleReconcileMath = () => {
    onUpdateData({
      ...data,
      financials: {
        ...data.financials,
        subtotal: Number(calculatedSubtotal.toFixed(2)),
        totalAmount: Number(calculatedTotal.toFixed(2)),
      },
    });
  };

  const handleApprove = () => {
    setIsApproved(true);
    setApprovalTimestamp(new Date().toLocaleTimeString());
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Velcora_Extraction_${data.financials.invoiceNumber || 'Doc'}.json`;
    a.click();
  };

  const exportCSV = () => {
    let csv = 'SKU,Description,Quantity,UnitPrice,Amount,Category\n';
    data.lineItems.forEach((item) => {
      csv += `"${item.itemCode || ''}","${item.description}",${item.quantity},${item.unitPrice},${item.amount},"${item.category || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Velcora_LineItems_${data.financials.invoiceNumber || 'Doc'}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {data.financials.invoiceNumber || fileName}
            </h2>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
              {data.documentType}
            </span>
            {isApproved ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified & Approved ({approvalTimestamp})</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                Pending Review
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            OCR Confidence Score: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data.confidenceScore}%</span> | Speed: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{(data.processingTimeMs / 1000).toFixed(2)}s</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isApproved && (
            <button
              onClick={handleApprove}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Verify & Approve</span>
            </button>
          )}

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportJSON}
            className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-all"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Interactive Document Canvas Sheet (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col h-[800px]">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider">
                Document Canvas & OCR Region
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="px-1 text-zinc-500">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Canvas Sheet View */}
          <div className="flex-1 overflow-auto bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
              className="bg-white text-zinc-900 p-6 rounded shadow-md border border-zinc-300 font-mono text-xs leading-relaxed space-y-4 transition-all"
            >
              {/* Image Preview if Base64 Image */}
              {fileData && fileData.startsWith('data:image') ? (
                <div className="relative group">
                  <img src={fileData} alt="Scanned Document" className="w-full h-auto rounded border border-zinc-300" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                    OCR Image Bounding Overlay Active
                  </div>
                </div>
              ) : (
                /* Interactive Document Representation */
                <div className="space-y-4">
                  <div className="border-b border-zinc-300 pb-3 flex justify-between items-start">
                    <div
                      onMouseEnter={() => setHighlightField('vendor')}
                      onMouseLeave={() => setHighlightField(null)}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        highlightField === 'vendor' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-zinc-100'
                      }`}
                    >
                      <div className="text-xs font-black uppercase text-zinc-800">
                        {data.vendorInfo.name || 'VENDOR ORGANISATION'}
                      </div>
                      <div className="text-[10px] text-zinc-500 leading-tight">
                        {data.vendorInfo.address || 'Street Address / City State'}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Tax ID: {data.vendorInfo.taxId || 'N/A'}
                      </div>
                    </div>

                    <div
                      onMouseEnter={() => setHighlightField('invNo')}
                      onMouseLeave={() => setHighlightField(null)}
                      className={`p-1.5 rounded text-right transition-all cursor-pointer ${
                        highlightField === 'invNo' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-zinc-100'
                      }`}
                    >
                      <div className="text-sm font-black text-blue-600">
                        {data.financials.invoiceNumber || 'INV-0000'}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Date: {data.financials.documentDate}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Terms: {data.financials.paymentTerms}
                      </div>
                    </div>
                  </div>

                  {/* Customer Block */}
                  <div className="p-2 bg-zinc-50 rounded border border-zinc-200">
                    <div className="text-[10px] uppercase font-bold text-zinc-400">Billed To:</div>
                    <div className="text-xs font-bold text-zinc-800">{data.customerInfo.name}</div>
                    <div className="text-[10px] text-zinc-500">{data.customerInfo.address}</div>
                  </div>

                  {/* Table Representation */}
                  <div>
                    <div className="text-[10px] font-bold uppercase text-zinc-400 mb-1">
                      Parsed Line Items ({data.lineItems.length})
                    </div>
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-300 text-zinc-500 font-mono">
                          <th className="py-1">Item</th>
                          <th className="py-1 text-center">Qty</th>
                          <th className="py-1 text-right">Price</th>
                          <th className="py-1 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.lineItems.map((item, idx) => (
                          <tr key={idx} className="border-b border-zinc-100">
                            <td className="py-1.5 font-sans font-medium text-zinc-800">{item.description}</td>
                            <td className="py-1.5 text-center font-mono">{item.quantity}</td>
                            <td className="py-1.5 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                            <td className="py-1.5 text-right font-mono font-bold">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-zinc-300 pt-2 space-y-1 text-right font-mono">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-500">Subtotal:</span>
                      <span className="font-bold">${data.financials.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-500">Tax Amount:</span>
                      <span className="font-bold">${data.financials.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black text-blue-600 border-t border-zinc-300 pt-1">
                      <span>Total Amount:</span>
                      <span>${data.financials.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Structured Field Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Editor Header Navigation */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'editor'
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Structured Field Studio
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'audit'
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Risk Audits ({data.anomalies.length})</span>
                </button>
              </div>

              {/* Math Reconciliation Warning Banner */}
              {mathMismatch && (
                <button
                  onClick={handleReconcileMath}
                  className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold px-3 py-1 rounded hover:bg-amber-500/20 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                  <span>Subtotal Mismatch — Click to Recalculate</span>
                </button>
              )}
            </div>
          </div>

          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* Vendor & Customer Grid */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
                <h3 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>Entity Metadata & Counterparty</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      value={data.vendorInfo.name}
                      onChange={(e) => handleVendorChange('name', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-bold px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Vendor Tax ID / EIN
                    </label>
                    <input
                      type="text"
                      value={data.vendorInfo.taxId || ''}
                      onChange={(e) => handleVendorChange('taxId', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Vendor Address
                    </label>
                    <input
                      type="text"
                      value={data.vendorInfo.address || ''}
                      onChange={(e) => handleVendorChange('address', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Headers */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
                <h3 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>Financial Statement Headers</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Invoice #
                    </label>
                    <input
                      type="text"
                      value={data.financials.invoiceNumber}
                      onChange={(e) => handleFinancialChange('invoiceNumber', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      PO #
                    </label>
                    <input
                      type="text"
                      value={data.financials.poNumber}
                      onChange={(e) => handleFinancialChange('poNumber', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      value={data.financials.documentDate}
                      onChange={(e) => handleFinancialChange('documentDate', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs px-2.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={data.financials.dueDate}
                      onChange={(e) => handleFinancialChange('dueDate', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs px-2.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Subtotal / Tax / Total Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Subtotal ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.financials.subtotal}
                      onChange={(e) => handleFinancialChange('subtotal', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono font-bold text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Tax ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.financials.taxAmount}
                      onChange={(e) => handleFinancialChange('taxAmount', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Discount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.financials.discountAmount}
                      onChange={(e) => handleFinancialChange('discountAmount', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Total Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.financials.totalAmount}
                      onChange={(e) => handleFinancialChange('totalAmount', e.target.value)}
                      className="w-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-black text-sm px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Table Studio */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-500" />
                    <span>Line Items Breakdown ({data.lineItems.length})</span>
                  </h3>

                  <button
                    onClick={handleAddLineItem}
                    className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded text-xs font-bold border border-zinc-200 dark:border-zinc-700 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-mono uppercase text-[10px]">
                        <th className="py-2 px-1">Code</th>
                        <th className="py-2 px-1">Description</th>
                        <th className="py-2 px-1 w-16 text-center">Qty</th>
                        <th className="py-2 px-1 w-24 text-right">Unit ($)</th>
                        <th className="py-2 px-1 w-28 text-right">Amount ($)</th>
                        <th className="py-2 px-1 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.lineItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                          <td className="py-2 px-1">
                            <input
                              type="text"
                              value={item.itemCode || ''}
                              onChange={(e) => handleLineItemChange(idx, 'itemCode', e.target.value)}
                              className="w-full bg-transparent font-mono text-[11px] text-zinc-600 dark:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 px-1 py-0.5 rounded border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                              className="w-full bg-transparent font-semibold text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 px-1 py-0.5 rounded border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                              className="w-full text-center font-mono font-bold bg-transparent text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 px-1 py-0.5 rounded border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                              className="w-full text-right font-mono bg-transparent text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 px-1 py-0.5 rounded border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                            />
                          </td>
                          <td className="py-2 px-1 text-right font-mono font-bold text-zinc-900 dark:text-white">
                            ${item.amount.toFixed(2)}
                          </td>
                          <td className="py-2 px-1 text-center">
                            <button
                              onClick={() => handleDeleteLineItem(idx)}
                              className="text-zinc-400 hover:text-rose-600 p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Webhook ERP Dispatch Panel */}
              <div className="bg-zinc-900 text-white rounded-xl border border-zinc-800 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>Dispatch Payload to Enterprise ERP Webhook</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Triggers real HTTP POST call with validated JSON schema.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={selectedTargetSystem}
                      onChange={(e) => setSelectedTargetSystem(e.target.value)}
                      className="bg-zinc-800 text-white text-xs font-mono border border-zinc-700 rounded px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="SAP / Workday ERP">SAP / Workday ERP</option>
                      <option value="QuickBooks Online API">QuickBooks Online API</option>
                      <option value="NetSuite Finance Hub">NetSuite Finance Hub</option>
                      <option value="CFO Approval Queue">CFO Approval Queue</option>
                      <option value="Custom Webhook Receiver">Custom Webhook Receiver</option>
                    </select>

                    <button
                      onClick={() => onDispatchWebhook?.(selectedTargetSystem)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded text-xs font-bold shadow transition-all whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Now</span>
                    </button>
                  </div>
                </div>

                {/* Webhook Response Log Banner */}
                {webhookStatus && (
                  <div className="mt-4 p-3 rounded bg-zinc-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>HTTP 200 DELIVERED -&gt; {webhookStatus.targetSystem}</span>
                      </span>
                      <span className="text-[10px] text-zinc-500">{webhookStatus.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-zinc-300">{webhookStatus.message}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Risk Anomalies & Corporate Compliance Audits</span>
              </h3>

              {data.anomalies.length === 0 ? (
                <div className="p-4 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
                  No risk compliance anomalies detected. Document aligns with master corporate policy.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.anomalies.map((anom, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase">
                          Field: {anom.field}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            anom.severity === 'high'
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : 'bg-amber-100 text-amber-700 border border-amber-300'
                          }`}
                        >
                          {anom.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">{anom.issue}</p>
                      <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                        Recommendation: {anom.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
