
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
          <div className="bg-[#F9F7F5] p-8 md:p-12 border border-slate-200">
            <div className="max-w-6xl mx-auto">

              {/* Header Section: The Economist Style */}
              <div className="mb-12 border-b-2 border-slate-900 pb-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-serif font-black text-slate-900 mb-2">Stochastic Divergence</h2>
                    <p className="text-sm font-sans uppercase tracking-widest text-[#E3120B] font-bold">
                      Official vs. Perceived Inflation (2023-2025)
                    </p>
                  </div>
                  <div className="hidden md:block text-right">
                    <div className="text-xs font-mono text-slate-500">
                      LATEST OBSERVATION
                    </div>
                    <div className="text-4xl font-serif font-bold text-slate-900 tabular-nums">
                      {simData.length > 0 ? simData[simData.length - 1].cpci_simulated.toFixed(1) : "---"}
                    </div>
                    <div className="text-xs font-sans text-slate-500 mt-1">
                      Index (2023=100)
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Main Chart Area */}
                <div className="lg:col-span-8">
                  <div className="bg-white p-6 border border-slate-200 shadow-sm h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                          tick={{ fontFamily: 'sans-serif', fontSize: 10, fill: '#64748b' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={['auto', 'auto']} // Adjust domain to be dynamic
                          tick={{ fontFamily: 'sans-serif', fontSize: 10, fill: '#64748b' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', fontFamily: 'serif' }}
                          itemStyle={{ fontSize: 12 }}
                          labelStyle={{ marginBottom: 5, fontWeight: 'bold', color: '#0f172a' }}
                        />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />

                        {/* Official CPI (Baseline) */}
                        <Line
                          type="monotone"
                          dataKey="cpi_official"
                          name="Official CPI (Expenditure Weighted)"
                          stroke="#94a3b8"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />

                        {/* CPCI (Felt) */}
                        <Line
                          type="monotone"
                          dataKey="cpci_simulated"
                          name={`CPCI (α=${alpha.toFixed(2)})`}
                          stroke="#E3120B"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, fill: '#E3120B' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-4 text-[10px] text-slate-500 font-serif italic max-w-2xl">
                    Fig 1. Longitudinal analysis of price perception. The divergence, $\delta$, is a function of frequency bias $\alpha$ and shrinkflation utility penalties $\lambda$.
                    Source: Academic Engine (v2.0).
                  </p>
                </div>

                {/* Sensitivity Console (Right Sidebar) */}
                <div className="lg:col-span-4 space-y-8">

                  {/* Control Panel */}
                  <div className="bg-[#F2F2f2] p-6 border-t-4 border-slate-900">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">
                      Sensitivity Analysis
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2 max-w-[200px]">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Frequency Bias (α)</label>
                          <span className="text-xs font-serif font-bold text-[#E3120B]">{alpha.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={alpha}
                          onChange={(e) => setAlpha(parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E3120B]"
                        />
                        <div className="flex justify-between mt-1 text-[9px] text-slate-400 font-mono">
                          <span>0.0 (Rational)</span>
                          <span>0.44 (Georganas)</span>
                          <span>1.0 (Bounded)</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-300">
                        <p className="text-[11px] leading-relaxed font-serif text-slate-700">
                          <strong>Simulator Note:</strong> Adjusting $\alpha$ simulates the impact of purchase frequency on inflation perception.
                          At $\alpha=0.44$, the index replicates the findings of <em>Georganas et al. (2014)</em>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Findings Box */}
                  <div className="p-6 border border-slate-200 bg-white">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                      Key Statistcs
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between text-xs">
                        <span className="font-serif text-slate-600">Perception Gap</span>
                        <span className="font-mono font-bold text-[#E3120B]">
                          +{simData.length > 0 ? (simData[simData.length - 1].cpci_simulated - simData[simData.length - 1].cpi_official).toFixed(2) : "0.00"} pts
                        </span>
                      </li>
                      <li className="flex justify-between text-xs">
                        <span className="font-serif text-slate-600">Shrinkflation Penalty</span>
                        <span className="font-mono font-bold text-slate-900">3.9 pts</span>
                      </li>
                      <li className="flex justify-between text-xs">
                        <span className="font-serif text-slate-600">Survey n-count</span>
                        <span className="font-mono font-bold text-slate-900">1,240</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
          );
};

          export default Dashboard;
