
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';

const ApiPortal: React.FC = () => {
  const [rawDbState, setRawDbState] = useState<any>(null);
  const [activeEndpoint, setActiveEndpoint] = useState('v1/indices');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const activeUser = db.getActiveUser();

  useEffect(() => {
    setRawDbState(db.getRawState());
    if (activeUser) setIsUnlocked(true);
  }, [activeUser]);

  const endpoints = [
    { 
      path: 'GET v1/indices', 
      desc: 'Retrieves national composite index and regional friction coefficients.',
      sample: { region: 'National', coefficient: 7.4, last_audit: '2024-Q3' }
    },
    { 
      path: 'GET v1/ledger/variance', 
      desc: 'Retrieves volume-adjusted valuation logs for retail units.',
      sample: { sku: 'C-01', variance: -12.5, unit: 'ml' }
    },
    { 
      path: 'GET v1/compliance/logs', 
      desc: 'Programmatic access to the non-repudiable audit ledger.',
      sample: { event: 'CONSENSUS_SIGN', checksum: 'sha256-abc...', timestamp: '2024-03-20T14:30:00Z' }
    }
  ];

  const exportData = (format: 'json' | 'csv') => {
    if (!isUnlocked) return;
    const data = JSON.stringify(rawDbState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CPCI_COMPLIANT_EXPORT_${new Date().toISOString()}.${format}`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Contextual Briefing */}
      <section className="bg-white border-l-4 border-slate-900 p-8 shadow-sm space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contextual Briefing: Data Exchange (DEP)</h2>
        <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
          Transparency is a pillar of the CPCI. The <strong>Data Exchange Protocol</strong> allows academic researchers and journalists to download our raw "ledger" of prices and volume changes. This ensures our data is not just a black box, but a verifiable public resource for tracking the true cost of living.
        </p>
      </section>

      <section className="bg-white border border-slate-200 p-12 relative overflow-hidden">
        {!isUnlocked && (
          <div className="absolute inset-0 bg-slate-50/95 backdrop-blur-md z-10 flex flex-col items-center justify-center space-y-6 p-12 text-center">
            <div className="w-16 h-16 border-4 border-slate-900 flex items-center justify-center font-black text-2xl mb-4">🔐</div>
            <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">Identity Handshake Required</h4>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-medium uppercase tracking-widest">Programmatic data access requires an authenticated analyst ID.</p>
            <div className="flex space-x-4 mt-6">
              <span className="bg-slate-100 px-3 py-1 text-[9px] font-black uppercase text-slate-400">Rate Limit: Active</span>
              <span className="bg-slate-100 px-3 py-1 text-[9px] font-black uppercase text-slate-400">Status: Protected</span>
            </div>
          </div>
        )}

        <div className={`flex justify-between items-start mb-10 border-b border-slate-50 pb-8 ${!isUnlocked && 'opacity-20 grayscale'}`}>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Protocol Gateway</h2>
            <p className="text-[11px] text-slate-500 mt-2 font-bold uppercase tracking-tight italic">API endpoints for econometric polling.</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => exportData('json')} className="px-6 py-3 border-2 border-slate-900 text-[10px] font-black uppercase hover:bg-slate-50 tracking-widest transition-all">Download JSON</button>
            <button onClick={() => exportData('csv')} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase hover:bg-black tracking-widest transition-all shadow-xl">Export CSV</button>
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 ${!isUnlocked && 'opacity-20 grayscale'}`}>
          <div className="lg:col-span-1 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Authenticated Endpoints</h4>
            {endpoints.map(e => (
              <button 
                key={e.path}
                onClick={() => setActiveEndpoint(e.path)}
                className={`w-full text-left p-6 border-l-4 transition-all rounded-none ${activeEndpoint === e.path ? 'bg-slate-900 border-white text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'}`}
              >
                <code className="text-[11px] font-black tracking-tighter block">{e.path}</code>
                <p className={`text-[10px] mt-2 leading-relaxed font-medium ${activeEndpoint === e.path ? 'text-slate-400' : 'text-slate-500'}`}>{e.desc}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-8">
             <div className="bg-slate-950 p-10 font-mono text-[11px] leading-relaxed relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-4 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] bg-black border-b border-l border-slate-800">
                 DATA_PAYLOAD
               </div>
               <pre className="text-blue-400">
                {JSON.stringify(endpoints.find(e => e.path === activeEndpoint)?.sample, null, 2)}
               </pre>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApiPortal;
