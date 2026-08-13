import React, { useEffect, useState } from 'react';
import { Scan, Binary, Table, ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';
import { VelcoraLogo } from './VelcoraLogo';

interface ExtractionProgressProps {
  fileName?: string;
}

export const ExtractionProgress: React.FC<ExtractionProgressProps> = ({ fileName = 'Document' }) => {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    {
      title: 'Multimodal Visual & OCR Segmentation',
      desc: 'Decoding document geometry, table structures, and text blocks...',
      icon: Scan,
    },
    {
      title: 'Field Schema Extraction',
      desc: 'Parsing vendor metadata, tax IDs, invoice numbers, and due dates...',
      icon: Binary,
    },
    {
      title: 'Financial Math Reconciliation',
      desc: 'Verifying line item unit prices, quantities, subtotal sum, and tax formulas...',
      icon: Table,
    },
    {
      title: 'Risk Anomaly & Compliance Audit',
      desc: 'Auditing document against company procurement guidelines and tax rules...',
      icon: ShieldAlert,
    },
    {
      title: 'Automation & ERP Webhook Ready',
      desc: 'Formulating structured JSON payload for external system dispatch...',
      icon: Zap,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <VelcoraLogo size="sm" showText={false} />
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">
                Document Processing Pipeline
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Target: <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{fileName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <span>Step {currentStage + 1} of {stages.length}</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isDone = idx < currentStage;
            const isCurrent = idx === currentStage;

            return (
              <div
                key={idx}
                className={`flex items-start gap-4 p-3.5 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/50 shadow-sm'
                    : isDone
                    ? 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800/80 opacity-90'
                    : 'bg-zinc-50/30 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/30 opacity-40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                    isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono text-zinc-900 dark:text-white uppercase tracking-wider">
                      {stage.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 animate-pulse font-bold">
                        EXECUTING...
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        COMPLETED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
