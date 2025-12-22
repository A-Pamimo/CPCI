
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { HISTORICAL_DATA, DATA_SOURCES } from '../constants';
import { Province, SignificanceLevel } from '../types';
import { db } from '../services/db';
import GeminiInsight from './GeminiInsight';
import { calculateFrictionCliff } from '../services/engine';

const Dashboard: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province>(Province.NATIONAL);
  const [regionalData, setRegionalData] = useState<Record<string, number>>({});
  const [prediction, setPrediction] = useState<string>('');
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    setRegionalData(db.getRegionalData());
    setPrediction(calculateFrictionCliff(HISTORICAL_DATA));
  }, []);

  const currentRegionalValue = regionalData[selectedProvince] || 0;

  const handlePredictiveAudit = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setPrediction(calculateFrictionCliff(HISTORICAL_DATA));
      setIsPredicting(false);
    }, 400);
  };

  const getSignificance = (val: number): { level: SignificanceLevel; color: string; bg: string } => {
    if (val <= 2.5) return { level: SignificanceLevel.OPTIMAL, color: 'text-green-600', bg: 'bg-green-50' };
    if (val <= 5.0) return { level: SignificanceLevel.MODERATE, color: 'text-amber-600', bg: 'bg-amber-50' };
    if (val <= 8.0) return { level: SignificanceLevel.HIGH, color: 'text-red-600', bg: 'bg-red-50' };
    return { level: SignificanceLevel.CRITICAL, color: 'text-slate-900', bg: 'bg-slate-200 animate-pulse' };
  };

  const sig = getSignificance(currentRegionalValue);

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto">
      {/* Contextual Briefing */}
      <section className="bg-white border-l-4 border-slate-900 p-8 shadow-sm space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Executive Briefing: Macro Analysis</h2>
        <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
          Standard inflation reports (CPI) track a "fixed basket" of goods, often ignoring how quickly prices change or how much choice you have. This dashboard measures the <strong>Friction Delta</strong>—the hidden gap between government data and your actual bank balance. When the red line (CPCI) rises above the grey line (CPI), it indicates your purchasing power is evaporating faster than officially admitted.
        </p>
      </section>

      {/* Executive Summary Section */}
      <section className="bg-white border border-slate-200 p-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative overflow-hidden">
        <div className="md:col-span-1 space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Regional Audit</h3>
          <select 
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value as Province)}
            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-slate-400"
          >
            {Object.values(Province).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-0.5 ${sig.bg} ${sig.color} text-[8px] font-black uppercase tracking-widest border border-current opacity-70`}>
                {sig.level.replace('_', ' ')}
              </span>
            </div>
            <p className={`text-4xl font-bold ${sig.color} tabular-nums leading-none`}>
              {currentRegionalValue.toFixed(1)}%
            </p>
            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter italic">Measured Friction Delta</p>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12 border-l border-slate-100 pl-12">
          {[
            { label: 'Composite CPCI', value: '7.2%', detail: 'Real Market Friction' },
            { label: 'Interest Shadow', value: '2.6%', detail: 'Hidden Debt Penalty' },
            { label: 'Official CPI', value: '2.0%', detail: 'StatCan 18-10-0004-01' }
          ].map((m, i) => {
            const mSig = getSignificance(parseFloat(m.value));
            return (
              <div key={i}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{m.label}</p>
                <p className={`text-3xl font-bold ${mSig.color} tabular-nums`}>{m.value}</p>
                <div className="flex items-center space-x-1 mt-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${mSig.bg.split(' ')[0]} border border-current`}></div>
                   <p className="text-[9px] font-medium text-slate-500 uppercase tracking-tight">{m.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Local Prediction Bar */}
      <section className="bg-slate-900 text-white p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 border border-slate-700 flex items-center justify-center text-blue-500 font-black text-xs">LOCAL</div>
          <div>
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Deterministic Forecasting Engine</span>
            <p className="text-[11px] font-serif italic text-slate-400 max-w-xl">
              {prediction || "Calculating non-linear divergence projection..."}
            </p>
          </div>
        </div>
        <button 
          onClick={handlePredictiveAudit}
          disabled={isPredicting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
        >
          {isPredicting ? 'Calculating...' : 'Run Prediction'}
        </button>
      </section>

      {/* Main Analytical Chart */}
      <section className="bg-white border border-slate-200 p-10">
        <div className="flex justify-between items-end mb-10 border-b border-slate-50 pb-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Fig 1. Longitudinal Divergence</h3>
            <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-tight">Shaded regions indicate systemic instability thresholds (Critical > 5.0%)</p>
          </div>
          <div className="flex space-x-4">
             <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-slate-300"></div><span className="text-[8px] font-bold text-slate-400 uppercase">CPI (StatCan)</span></div>
             <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-red-700"></div><span className="text-[8px] font-bold text-slate-400 uppercase">CPCI (Synthetic)</span></div>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HISTORICAL_DATA}>
              <CartesianGrid strokeDasharray="1 4" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tick={{fontWeight: 600}} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} unit="%" tick={{fontWeight: 600}} />
              <Tooltip 
                contentStyle={{ border: 'none', backgroundColor: '#0f172a', color: '#fff', borderRadius: '0px', fontSize: '10px', fontWeight: 'bold' }}
                itemStyle={{ color: '#fff' }}
              />
              <ReferenceArea y1={5.1} y2={10} fill="#fef2f2" stroke="none" fillOpacity={0.5} />
              <Line type="monotone" dataKey="cpi" name="Official CPI" stroke="#94a3b8" strokeWidth={1} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="cpci" name="CPCI Friction" stroke="#b91c1c" strokeWidth={3} dot={{ r: 4, fill: '#b91c1c', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data Source Footer */}
        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center space-x-2">
             <div className="w-2 h-2 bg-slate-200"></div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Data Source:</span>
             <a 
               href={DATA_SOURCES.CPI_BASE.url} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-[9px] font-bold text-blue-600 hover:text-blue-800 uppercase underline decoration-dotted transition-colors"
             >
               {DATA_SOURCES.CPI_BASE.name} &rarr;
             </a>
           </div>
           <span className="text-[8px] font-mono text-slate-300">VALID_THRU: SEPT_2024</span>
        </div>
      </section>

      <GeminiInsight />
    </div>
  );
};

export default Dashboard;
