import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentUploader } from './components/DocumentUploader';
import { ExtractionProgress } from './components/ExtractionProgress';
import { StructuredDataViewer } from './components/StructuredDataViewer';
import { AutomationDashboard } from './components/AutomationDashboard';
import { ExtractedDocumentData, DocumentType, WebhookLog, SampleDocumentTemplate } from './types';
import { VelcoraLogo } from './components/VelcoraLogo';

export function App() {
  const [activeTab, setActiveTab] = useState<'intake' | 'extraction' | 'structured' | 'dashboard'>('intake');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);
  const [activeFileName, setActiveFileName] = useState('Document');
  const [activeFileData, setActiveFileData] = useState<string | undefined>(undefined);
  const [activeTextContent, setActiveTextContent] = useState<string | undefined>(undefined);

  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [webhookStatus, setWebhookStatus] = useState<{
    success: boolean;
    targetSystem: string;
    message: string;
    timestamp: string;
  } | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);

  // Handle Process Document
  const handleProcessDocument = async (payload: {
    fileData?: string;
    mimeType?: string;
    textContent?: string;
    fileName: string;
    documentCategory: DocumentType;
  }) => {
    setIsProcessing(true);
    setProcessError(null);
    setActiveTab('extraction');
    setActiveFileName(payload.fileName);
    setActiveFileData(payload.fileData);
    setActiveTextContent(payload.textContent);

    try {
      const response = await fetch('/api/extract-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        setExtractedData(resData.data);
        setTimeout(() => {
          setIsProcessing(false);
          setActiveTab('structured');
        }, 1200);
      } else {
        throw new Error(resData.error || 'Failed to extract document');
      }
    } catch (err) {
      console.error('Extraction error:', err);
      setIsProcessing(false);
      setActiveTab('intake');
      setProcessError(
        'Document processing failed. The extraction service may be temporarily unavailable — please try again shortly.'
      );
    }
  };

  // Load a pre-parsed sample directly (works with no API key)
  const handleLoadSample = (sample: SampleDocumentTemplate) => {
    setIsProcessing(true);
    setProcessError(null);
    setActiveTab('extraction');
    setActiveFileName(sample.fileName || sample.title);
    setActiveTextContent(sample.sampleText);
    setActiveFileData(undefined);
    window.setTimeout(() => {
      setExtractedData(sample.preExtractedData);
      setIsProcessing(false);
      setActiveTab('structured');
    }, 1200);
  };

  // Dispatch Webhook Simulation
  const handleDispatchWebhook = async (targetSystem: string) => {
    if (!extractedData) return;

    try {
      const response = await fetch('/api/webhook/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSystem,
          documentId: extractedData.financials.invoiceNumber || 'DOC-CURRENT',
          payload: extractedData,
          ruleName: 'Auto-Post Structured Payload',
        }),
      });

      const resJson = await response.json();

      if (resJson.success) {
        const log: WebhookLog = {
          id: resJson.executionId,
          timestamp: new Date().toLocaleTimeString(),
          documentId: resJson.documentId,
          targetSystem: resJson.targetSystem,
          payload: extractedData,
          statusCode: 200,
          responseMessage: resJson.message,
        };

        setWebhookLogs((prev) => [log, ...prev]);
        setWebhookStatus({
          success: true,
          targetSystem: resJson.targetSystem,
          message: resJson.message,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      console.error('Webhook dispatch error:', err);
    }
  };

  const handleNewDocument = () => {
    setExtractedData(null);
    setActiveFileData(undefined);
    setActiveTextContent(undefined);
    setWebhookStatus(null);
    setProcessError(null);
    setActiveTab('intake');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasExtractedData={!!extractedData}
        onNewDocument={handleNewDocument}
        documentCount={extractedData ? 1 : 0}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'intake' && (
          <>
            {processError && (
              <div className="max-w-3xl mx-auto mt-6 px-4">
                <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-300">
                  <span className="font-semibold">Processing error</span>
                  <span className="flex-1">{processError}</span>
                  <button
                    type="button"
                    onClick={() => setProcessError(null)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-200 font-medium"
                    aria-label="Dismiss error"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            <DocumentUploader
              onProcessDocument={handleProcessDocument}
              isProcessing={isProcessing}
              onLoadSample={handleLoadSample}
            />
          </>
        )}

        {activeTab === 'extraction' && (
          <ExtractionProgress fileName={activeFileName} />
        )}

        {activeTab === 'structured' && extractedData && (
          <StructuredDataViewer
            data={extractedData}
            onUpdateData={setExtractedData}
            fileName={activeFileName}
            fileData={activeFileData}
            rawTextExcerpt={activeTextContent}
            onDispatchWebhook={handleDispatchWebhook}
            webhookStatus={webhookStatus}
          />
        )}

        {activeTab === 'dashboard' && (
          <AutomationDashboard webhookLogs={webhookLogs} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <VelcoraLogo size="sm" showText={false} />
            <span>VELCORA ENTERPRISE DOCUMENT INTELLIGENCE • SYSTEM v4.2</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               SLA: Active (99.9% Uptime)
            </span>
            <span>REST API Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
