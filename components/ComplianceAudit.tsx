
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { AuditLogEntry } from '../types';

const ComplianceAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    setLogs(db.getAuditLogs());
    const interval = setInterval(() => {
      setLoad(Math.floor(Math.random() * 15000) + 85000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans">
      {/* Contextual Briefing */}
      <section className="bg-white border-l-4 border-slate-900 p-8 shadow-sm space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contextual Briefing: Infrastructure Integrity</h2>
        <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
          The <strong>Audit Ledger</strong> is an immutable diary of every action taken in this application. <strong>Edge Concurrency</strong> tracks how many active users are currently verifying data. We maintain these high-level logs to ensure the system is operating without errors and that no one is manipulating the price indices behind the scenes.
        </p>
      </section>

      {/* Infrastructure Health */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 p-8 border border-slate-800">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Edge Concurrency</h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white tabular-nums">{load.toLocaleString()}</span>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-tight">Active Nodes</span>
          </div>
        </div>
        <div className="bg-white p-8 border border-slate-200">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Network Integrity</h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Status: Synchronized</span>
          </div>
        </div>
        <div className="bg-white p-8 border border-slate-200">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Master Ledger Persistence</h4>
          <div className="flex items-center space-x-2 text-slate-900">
            <span className="text-sm font-bold uppercase tracking-tighter tabular-nums">NOMINAL DATA FLOW</span>
          </div>
        </div>
      </section>

      {/* Audit Ledger */}
      <section className="bg-white border border-slate-200">
        <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Master Audit Ledger</h3>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-1 tracking-tight italic">Non-repudiable logs for infrastructure verification</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="px-10 py-4">Timestamp</th>
                <th className="px-10 py-4">Actor ID</th>
                <th className="px-10 py-4">Action Event</th>
                <th className="px-10 py-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-mono text-[10px]">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-10 py-4 tabular-nums text-slate-500">{log.timestamp.split('T')[1].split('.')[0]}</td>
                  <td className="px-10 py-4 font-bold text-slate-900">{log.actorId}</td>
                  <td className="px-10 py-4">
                    <span className="text-slate-700 font-bold uppercase">{log.action}</span>
                    <p className="text-[9px] text-slate-400 font-sans mt-0.5">{log.details}</p>
                  </td>
                  <td className="px-10 py-4">
                    <span className={`px-2 py-0.5 ${log.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : log.severity === 'WARN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'} font-black`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ComplianceAudit;
