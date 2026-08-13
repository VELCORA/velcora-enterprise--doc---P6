import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  Code,
  Terminal,
  Copy,
  Check,
  Send,
  Layers,
  Server,
  Play,
  ShieldCheck,
} from 'lucide-react';
import { AutomationRule, WebhookLog } from '../types';

interface AutomationDashboardProps {
  webhookLogs: WebhookLog[];
}

export const AutomationDashboard: React.FC<AutomationDashboardProps> = ({ webhookLogs }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'logs' | 'api'>('rules');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'rule-1',
      name: 'High-Value Invoice CFO Routing',
      conditionField: 'totalAmount',
      operator: 'greater_than',
      conditionValue: 5000,
      action: 'Route to CFO Approval Queue',
      targetEndpoint: 'https://api.company.com/approvals/cfo',
      enabled: true,
    },
    {
      id: 'rule-2',
      name: 'Standard AP Voucher Auto-Post',
      conditionField: 'documentType',
      operator: 'equals',
      conditionValue: 'Invoice',
      action: 'Auto-Post Voucher to Workday ERP',
      targetEndpoint: 'https://api.company.com/workday/ap',
      enabled: true,
    },
  ]);

  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleField, setNewRuleField] = useState('totalAmount');
  const [newRuleOp, setNewRuleOp] = useState<'greater_than' | 'less_than' | 'equals' | 'contains'>('greater_than');
  const [newRuleVal, setNewRuleVal] = useState('1000');
  const [newRuleAction, setNewRuleAction] = useState('Dispatch Webhook Alert');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const rule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      conditionField: newRuleField,
      operator: newRuleOp,
      conditionValue: newRuleVal,
      action: newRuleAction,
      targetEndpoint: 'https://api.velcora.io/v1/automation/trigger',
      enabled: true,
    };

    setRules([...rules, rule]);
    setNewRuleName('');
  };

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const curlCode = `curl -X POST https://ai.studio/api/extract-document \\
  -H "Content-Type: application/json" \\
  -d '{
    "documentCategory": "Invoice",
    "textContent": "Vendor: Acme Corp\\nInvoice #: INV-99182\\nSubtotal: $1,200.00\\nTax: $99.00\\nTotal: $1,299.00"
  }'`;

  const jsCode = `async function processDocument() {
  const response = await fetch('/api/extract-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      documentCategory: 'Invoice',
      fileData: 'data:image/png;base64,iVBORw0KGgo...',
      fileName: 'Vendor_Invoice.pdf'
    })
  });
  
  const result = await response.json();
  console.log('Structured Fields:', result.data);
}`;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>VELCORA AUTOMATION & INTEGRATION HUB</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Workflow Rules & API Endpoints
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Configure rule-based automation triggers, inspect delivered webhook payloads, and integrate the Velcora Document API with your enterprise applications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeTab === 'rules'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Automation Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeTab === 'logs'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Webhook Logs ({webhookLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeTab === 'api'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>API SDK</span>
        </button>
      </div>

      {/* Tab 1: Rules Manager */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Create Rule Form */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
            <h3 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" />
              <span>Create New Workflow Automation Rule</span>
            </h3>

            <form onSubmit={handleAddRule} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Flag Large Purchase Orders"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                  Target Field
                </label>
                <select
                  value={newRuleField}
                  onChange={(e) => setNewRuleField(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                >
                  <option value="totalAmount">totalAmount ($)</option>
                  <option value="documentType">documentType</option>
                  <option value="vendorInfo.name">vendorName</option>
                  <option value="anomalies.length">anomalyCount</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                  Condition Value
                </label>
                <input
                  type="text"
                  value={newRuleVal}
                  onChange={(e) => setNewRuleVal(e.target.value)}
                  placeholder="5000"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-mono px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-mono text-zinc-500 uppercase font-semibold mb-1">
                  Automated Action
                </label>
                <input
                  type="text"
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value)}
                  placeholder="e.g. Post Voucher to SAP Accounts Payable API"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Rule</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Rules List */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
            <h3 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Active Enterprise Rules ({rules.length})
            </h3>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${
                        rule.enabled
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-zinc-400 bg-transparent'
                      }`}
                    >
                      {rule.enabled && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        {rule.name}
                      </h4>
                      <p className="text-xs font-mono text-zinc-500 mt-0.5">
                        IF <span className="text-blue-600 dark:text-blue-400 font-bold">{rule.conditionField}</span> {rule.operator} <span className="text-emerald-600 dark:text-emerald-400 font-bold">{String(rule.conditionValue)}</span>
                        {' -> '}
                        <span className="text-zinc-800 dark:text-zinc-200 font-bold">{rule.action}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-zinc-400 hover:text-rose-600 p-1.5 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500" />
            <span>Delivered Webhook Executions Log</span>
          </h3>

          {webhookLogs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800">
              No webhooks dispatched yet. Run a document extraction and click "Dispatch Now" to trigger a payload delivery.
            </div>
          ) : (
            <div className="space-y-3">
              {webhookLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white font-mono text-xs space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>HTTP {log.statusCode} OK -&gt; {log.targetSystem}</span>
                    </span>
                    <span className="text-zinc-500 text-[10px]">{log.timestamp}</span>
                  </div>
                  <div className="text-zinc-300">{log.responseMessage}</div>
                  <pre className="p-2 rounded bg-zinc-900 text-[10px] text-zinc-400 overflow-x-auto">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: API Code */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          {/* cURL */}
          <div className="bg-zinc-950 text-white rounded-xl border border-zinc-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-zinc-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>cURL Document Extraction Endpoint (`POST /api/extract-document`)</span>
              </span>
              <button
                onClick={() => handleCopyCode(curlCode, 'curl')}
                className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white"
              >
                {copiedSnippet === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'curl' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-zinc-900 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed">
              {curlCode}
            </pre>
          </div>

          {/* JavaScript */}
          <div className="bg-zinc-950 text-white rounded-xl border border-zinc-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-zinc-300 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span>JavaScript / Node.js Integration</span>
              </span>
              <button
                onClick={() => handleCopyCode(jsCode, 'js')}
                className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white"
              >
                {copiedSnippet === 'js' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'js' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-zinc-900 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
              {jsCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
