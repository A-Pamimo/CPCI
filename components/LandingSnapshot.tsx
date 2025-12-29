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
      if (val < 2) return { label: 'OPTIMAL', color: 'text-green-700', bg: 'bg-green-50' };
      if (val < 4) return { label: 'ELEVATED', color: 'text-amber-700', bg: 'bg-amber-50' };
      return { label: 'CRITICAL', color: 'text-[#E3120B]', bg: 'bg-[#FEF2F2]' };
    }
    if (type === 'friction') {
      if (val < 4) return { label: 'STABLE', color: 'text-green-700', bg: 'bg-green-50' };
      if (val < 7) return { label: 'VOLATILE', color: 'text-amber-700', bg: 'bg-amber-50' };
      return { label: 'STRESS', color: 'text-[#E3120B]', bg: 'bg-[#FEF2F2]' };
    }
    return { label: 'NOMINAL', color: 'text-blue-700', bg: 'bg-blue-50' };
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
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-inter text-slate-900">

      {/* Executive Abstract (Paper Header) */}
      <section className="border-b-4 border-slate-900 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Abstract / Executive Summary</h2>
            <h3 className="text-4xl font-serif font-black text-slate-900 tracking-tight">
              The Divergence of <br /><span className="text-[#E3120B]">Perceived Friction</span>
            </h3>
            <p className="text-lg font-serif italic text-slate-600 leading-relaxed max-w-2xl">
              "While official CPI measures anchored inflation, the Friction Coefficient—weighted for transaction frequency and regional inelasticity—reveals a hidden decay in purchasing power."
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Divergence</div>
            <div className="text-6xl font-serif font-black text-[#E3120B]">+{spread}%</div>
            <div className="text-[10px] font-bold uppercase tracking-tight text-slate-500 mt-2">CPCI vs CPI Spread</div>
          </div>
        </div>
      </section>

      {/* Primary KPI Grid - Tufte Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200">

        <div className="p-8 space-y-4">
          <h4 className="text-[10px] font-black pointer-events-none uppercase tracking-widest text-slate-400">Friction Coefficient (Frequency)</h4>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-serif font-bold text-slate-900">{latest.frictionCoefficient.toFixed(1)}</span>
            <span className={`text-[9px] font-black px-2 py-1 ${frictionStatus.bg} ${frictionStatus.color} uppercase tracking-widest`}>{frictionStatus.label}</span>
          </div>
          <p className="text-[11px] font-serif text-slate-600 leading-relaxed">
            Aggregated impact of high-frequency purchases ($\phi$) on consumer sentiment.
          </p>
        </div>

        <div className="p-8 space-y-4">
          <h4 className="text-[10px] font-black pointer-events-none uppercase tracking-widest text-slate-400">Shrinkflation Penalty ($\lambda$)</h4>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-serif font-bold text-slate-900">3.9 pts</span>
            <span className="text-[9px] font-black px-2 py-1 bg-amber-50 text-amber-700 uppercase tracking-widest">Structural</span>
          </div>
          <p className="text-[11px] font-serif text-slate-600 leading-relaxed">
            Hidden inflation derived from unit-weight utility discontinuity (Rojas et al.).
          </p>
        </div>

        <div className="p-8 space-y-4">
          <h4 className="text-[10px] font-black pointer-events-none uppercase tracking-widest text-slate-400">Decay Projection (EOY)</h4>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-serif font-bold text-slate-900">$0.82</span>
            <span className="text-[9px] font-black px-2 py-1 bg-slate-100 text-slate-500 uppercase tracking-widest">Est.</span>
          </div>
          <p className="text-[11px] font-serif text-slate-600 leading-relaxed">
            Real purchasing power of $1.00 relative to 2020 baseline after friction adjustments.
          </p>
        </div>

      </div>

      {/* National Trend Visualization */}
      <section className="bg-white p-8 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] font-serif">Fig 1. The Perception Gap</h3>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2"><div className="w-4 h-0.5 bg-slate-300 border-t border-dashed"></div><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Official CPI</span></div>
            <div className="flex items-center space-x-2"><div className="w-4 h-1 bg-[#E3120B]"></div><span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">CPCI (Felt)</span></div>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HISTORICAL_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCpci" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E3120B" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#E3120B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} fontFamily="sans-serif" />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="%" fontFamily="sans-serif" />
              <Tooltip
                contentStyle={{ border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#0f172a', fontSize: '11px', fontFamily: 'serif' }}
              />
              <Area type="monotone" dataKey="cpci" stroke="#E3120B" fillOpacity={1} fill="url(#colorCpci)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="cpi" stroke="#94a3b8" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-[10px] text-slate-400 font-serif italic text-right">
          Source: Statistics Canada Table 18-10-0004-01 & Internal Frequency Audit
        </div>
      </section>

      {/* Snapshot Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shrinkflation Data Audit */}
        <div className="space-y-6">
          <div className="border-b-2 border-slate-900 pb-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-serif">Volume Density Audit</h4>
          </div>
          <div className="overflow-hidden border border-slate-200 rounded-sm">
            <table className="w-full text-left">
              <thead className="bg-[#F2F2F2] text-[9px] font-black uppercase text-slate-500 tracking-widest">
                <tr>
                  <th className="p-3 pl-4">Item</th>
                  <th className="p-3">Retailer</th>
                  <th className="p-3 text-right pr-4">Utility Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {topShrink.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 pl-4 text-[11px] font-bold text-slate-900 font-serif">{item.name}</td>
                    <td className="p-3 text-[10px] text-slate-500 uppercase">{item.retailer}</td>
                    <td className="p-3 pr-4 text-right font-mono text-xs font-bold text-[#E3120B]">
                      -{(((item.oldSize - item.newSize) / item.oldSize) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-[#fff] border-l-2 border-[#E3120B] text-[10px] text-slate-600 italic font-serif leading-relaxed">
            "Shrinkflation represents a 'Hidden Tax' on consumer utility. While the nominal price remains sticky, the per-unit cost escalates, creating a divergence between measured inflation and experienced value." — <em>Rojas et al. (2024)</em>
          </div>
        </div>

        {/* Regional Coefficient Distribution */}
        <div className="space-y-6">
          <div className="border-b-2 border-slate-900 pb-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-serif">Regional Friction ($M_{loc}$)</h4>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {regionalSorted.map(([province, value]) => (
              <div key={province} className="flex justify-between items-center p-3 bg-white border border-slate-200">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{province}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${value > 8 ? 'bg-[#E3120B]' : 'bg-slate-400'}`} style={{ width: `${(value / 12) * 100}%` }}></div>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${value > 8 ? 'text-[#E3120B]' : 'text-slate-900'} w-8 text-right`}>{value.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-serif italic text-slate-500 leading-relaxed mt-2">
            Regional multipliers derived from housing supply elasticity. Inelastic markets (e.g. BC, ON) exhibit higher friction coefficients due to substitution constraints.
          </p>
        </div>
      </div>

    </div>
  );
};

export default LandingSnapshot;
