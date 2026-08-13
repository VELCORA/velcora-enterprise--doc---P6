import React, { useEffect, useState } from 'react';
import { FileUp, Table, Zap, Plus, RefreshCw, CheckCircle2, Server } from 'lucide-react';
import { VelcoraLogo } from './VelcoraLogo';

interface NavbarProps {
  activeTab: 'intake' | 'extraction' | 'structured' | 'dashboard';
  setActiveTab: (tab: 'intake' | 'extraction' | 'structured' | 'dashboard') => void;
  hasExtractedData: boolean;
  onNewDocument: () => void;
  documentCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasExtractedData,
  onNewDocument,
  documentCount = 0,
}) => {
  const [serverHealth, setServerHealth] = useState<{ status: string; version: string } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === 'healthy') {
          setServerHealth({ status: 'healthy', version: data.version || '4.2' });
        }
      })
      .catch(() => setServerHealth(null));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-zinc-900 text-white border-b border-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('intake')}
              className="text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            >
              <VelcoraLogo size="sm" showText={true} />
            </button>

            {/* Server SLA Status Badge */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700/80 text-xs font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-zinc-400">Engine:</span>
              <span className="text-emerald-400 font-semibold">Ready</span>
              {serverHealth && <span className="text-zinc-500 text-[10px]">v{serverHealth.version}</span>}
            </div>
          </div>

          {/* Center View Selector */}
          <nav className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setActiveTab('intake')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'intake' || activeTab === 'extraction'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Document Workbench</span>
            </button>

            <button
              onClick={() => hasExtractedData && setActiveTab('structured')}
              disabled={!hasExtractedData}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'structured'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : hasExtractedData
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  : 'text-zinc-600 cursor-not-allowed opacity-60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Structured Inspector</span>
              {hasExtractedData && (
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Automation & API</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNewDocument}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Document</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
