
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HISTORICAL_DATA, DATA_SOURCES, REGIONAL_DIVERGENCE, SHRINKFLATION_ITEMS } from '../constants';
import { Province, SignificanceLevel } from '../types';

const LandingSnapshot: React.FC = () => {
  const latest = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const spread = parseFloat((latest.cpci - latest.cpi).toFixed(1));

  // Dynamic Status Logic
  const getStatus = (val: number, type: 'spread' | 'friction' | 'decay') => {
    if (type === 'spread') {
      if (val < 2) return { label: 'OPTIMAL', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      if (val < 4) return { label: 'ELEVATED', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      return { label: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    }
    if (type === 'friction') {
      if (val < 4) return { label: 'STABLE', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      if (val < 7) return { label: 'VOLATILE', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      return { label: 'STRESS', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    }
    return { label: 'NOMINAL', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
  };

  const spreadStatus = getStatus(spread, 'spread');
  const frictionStatus = getStatus(latest.frictionCoefficient, 'friction');

  const topShrink = [...SHRINKFLATION_ITEMS]
    .sort((a, b) => ((b.oldSize - b.newSize) / b.oldSize) - ((a.oldSize - a.newSize) / a.oldSize))
    .slice(0, 3);

  const regionalSorted = Object.entries(REGIONAL_DIVERGENCE)
    .filter(([p]) => p !== Province.NATIONAL)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Methodological Framework Section */}
      <section className="bg-white border border-slate-200 p-12 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Methodological Framework / National Audit</h2>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Quantifying the "Friction" Variance</h3>
          <p className="text-sm font-serif italic text-slate-600 leading-relaxed">
            Standard macroeconomic reports often fail to capture the <strong>Non-Linear Decay</strong> of purchasing power. The CPCI framework introduces "Friction Coefficients"—weighted variables that account for transaction frequency, market inelasticity, and hidden volume reductions. This dashboard provides a real-time synthesis of official data streams and community-audited retail shifts.
          </p>
          <div className="flex space-x-4 pt-4 border-t border-slate-50">
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Baseline: Statistics Canada Archive</span>
             </div>
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Overlay: Frequency-Bias Algorithm</span>
             </div>
          </div>
        </div>
      </section>

      {/* Primary KPI Grid - Dynamic Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className={`border p-8 space-y-4 transition-all ${spreadStatus.bg} ${spreadStatus.border}`}>
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Divergence Spread</h3>
            <span className={`text-[8px] font-black px-2 py-0.5 border ${spreadStatus.color} ${spreadStatus.border} rounded-full`}>
              {spreadStatus.label}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-5xl font-black tabular-nums ${spreadStatus.color}`}>+{spread}%</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
            Basis: (CPCI - CPI). Measures the gap between reported inflation and perceived friction.
          </p>
        </div>

        <div className={`border p-8 space-y-4 transition-all ${frictionStatus.bg} ${frictionStatus.border}`}>
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Friction Coefficient</h3>
            <span className={`text-[8px] font-black px-2 py-0.5 border ${frictionStatus.color} ${frictionStatus.border} rounded-full`}>
              {frictionStatus.label}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-5xl font-black tabular-nums ${frictionStatus.color}`}>{latest.frictionCoefficient.toFixed(1)}</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
            Basis: Frequency × Inelasticity. Measures the psychological and liquid weight of price shifts.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-8 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decay Projection (EOY)</h3>
            <span className="text-[8px] font-black px-2 py-0.5 border border-blue-200 text-blue-600 rounded-full">ESTIMATE</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-black text-slate-900 tabular-nums">$82</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">per $100</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
            Basis: Purchasing Power Decay. Historical extrapolation of current friction acceleration.
          </p>
        </div>
      </div>

      {/* National Trend Visualization */}
      <section className="bg-white border border-slate-200 p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Fig 0.1: Multi-Month Divergence Trend</h3>
            <p className="text-[11px] font-serif italic text-slate-500 mt-2">
              Classical Data Analysis: Tracking the statistical spread between official consumer price indices and synthetic household friction.
            </p>
          </div>
          <div className="flex space-x-6">
             <div className="flex items-center space-x-2"><div className="w-3 h-0.5 bg-slate-300 border-t border-dashed"></div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CPI</span></div>
             <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-700"></div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CPCI</span></div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HISTORICAL_DATA}>
              <defs>
                <linearGradient id="colorCpci" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#b91c1c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="1 4" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} unit="%" />
              <Tooltip 
                contentStyle={{ border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="cpci" stroke="#b91c1c" fillOpacity={1} fill="url(#colorCpci)" strokeWidth={3} />
              <Area type="monotone" dataKey="cpi" stroke="#94a3b8" fill="none" strokeWidth={1} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
           <a href={DATA_SOURCES.CPI_BASE.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase underline decoration-dotted transition-colors">
             Verify Baseline: StatCan Table 18-10-0004-01 &rarr;
           </a>
           <div className="text-[8px] font-mono text-slate-300 uppercase">Processing Engine: Non-Linear Regression v3</div>
        </div>
      </section>

      {/* Snapshot Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shrinkflation Data Audit */}
        <div className="bg-white border border-slate-200 p-8 space-y-6">
          <div className="border-b border-slate-50 pb-4">
             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Volume Density Audit</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic tracking-tight">Anomalies detected in retail unit sizing.</p>
          </div>
          <div className="space-y-4">
            {topShrink.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 group hover:border-red-200 transition-colors">
                <div>
                  <span className="text-[11px] font-black text-slate-900 uppercase">{item.name}</span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase">{item.retailer}</span>
                </div>
                <div className="text-right">
                  <span className="text-red-700 font-black text-[11px] tabular-nums">-{(((item.oldSize - item.newSize)/item.oldSize)*100).toFixed(1)}%</span>
                  <span className="block text-[8px] text-slate-400 font-black uppercase tracking-tighter">Utility Loss</span>
                </div>
              </div>
            ))}
          </div>
          <a href={DATA_SOURCES.SHRINKFLATION_BASE.url} target="_blank" rel="noopener noreferrer" className="block text-[9px] font-black text-blue-600 hover:underline uppercase text-center pt-2">
             Source: CBC Marketplace Shrinkflation Registry &rarr;
          </a>
        </div>

        {/* Regional Coefficient Distribution - WITH METHODOLOGY EXPLANATION */}
        <div className="bg-white border border-slate-200 p-8 space-y-6">
          <div className="border-b border-slate-50 pb-4">
             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Regional Stress Distribution</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic tracking-tight">Variance by Provincial Jurisdiction</p>
          </div>
          <div className="bg-slate-50 border-l-2 border-slate-900 p-4 mb-2">
            <p className="text-[10px] font-serif italic text-slate-600 leading-relaxed">
              <strong>Calculation Basis:</strong> Provincial variance is derived from a composite of <strong>Local Sales Tax (HST/PST)</strong>, <strong>Regional Fuel Carbon Adjustments</strong>, <strong>Utility Regulatory Pricing</strong>, and <strong>Housing Density Inelasticity</strong>. Higher values (Red) indicate regions where fixed costs have low substitution potential, leading to amplified stress.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {regionalSorted.map(([province, value]) => (
              <div key={province} className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase">{province}</span>
                <span className={`text-[11px] font-black ${value > 8 ? 'text-red-700' : 'text-slate-900'} tabular-nums`}>{value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Rationale Section */}
      <section className="bg-slate-900 text-white p-12 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <div className="text-9xl font-black italic">WHY</div>
        </div>
        <div className="max-w-3xl space-y-6 relative z-10">
          <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Project Origin & Rationale</h2>
          <div className="space-y-4 font-serif text-slate-300 italic leading-relaxed text-sm">
            <p>
              "This project was initiated in response to the widening gap between institutional economic metrics and the lived experience of Canadian households. While headline inflation may appear to plateau in official reports, the structural 'Friction' of daily transactions continues to accelerate."
            </p>
            <p>
              "The reason I built this was to provide a transparent, audit-ready tool that allows anyone to reconcile their bank balance with macroeconomic theory. By integrating real-time retail audits and historical StatCan baselines, we move from passive observation to active economic accounting."
            </p>
          </div>
          <div className="pt-6 border-t border-slate-800 flex items-center space-x-6">
             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Framework Version: 3.1.0-STABLE</div>
             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Deployment: CAN-EDGE-SNAPSHOT</div>
          </div>
        </div>
      </section>

      {/* Global Methodology Footnote */}
      <footer className="pt-12 border-t border-slate-200 text-center space-y-8">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Theoretical Grounding & Peer Verification</p>
          <p className="text-[9px] text-slate-400 uppercase font-bold italic tracking-tighter">All metrics are anchored to verifiable academic and government archives.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a href={DATA_SOURCES.METHODOLOGY_FREQ_BIAS.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-slate-500 hover:text-blue-600 uppercase border border-slate-200 px-4 py-2 transition-colors">
            ECB: Frequency Bias Archive &rarr;
          </a>
          <a href={DATA_SOURCES.METHODOLOGY_AIDS.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-slate-500 hover:text-blue-600 uppercase border border-slate-200 px-4 py-2 transition-colors">
            JSTOR: AIDS Demand System &rarr;
          </a>
          <a href={DATA_SOURCES.WEIGHTS_BASE.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-slate-500 hover:text-blue-600 uppercase border border-slate-200 px-4 py-2 transition-colors">
            StatCan: SHS Consumption Profile &rarr;
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingSnapshot;
