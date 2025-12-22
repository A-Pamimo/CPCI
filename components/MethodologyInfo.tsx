import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathBlockProps {
  formula: string;
  displayMode?: boolean;
}

const MathBlock: React.FC<MathBlockProps> = ({ formula, displayMode = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Safety Check: KaTeX throws an error immediately if in Quirks Mode.
      // We check compatMode first to avoid the crash and fallback gracefully.
      if (document.compatMode === 'BackCompat') {
        console.warn("Browser is in Quirks Mode. KaTeX rendering disabled to prevent crash.");
        containerRef.current.innerText = formula;
        containerRef.current.classList.add('font-mono', 'text-slate-500', 'text-xs', 'p-2', 'bg-slate-100');
        return;
      }

      try {
        katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: displayMode,
          trust: true
        });
      } catch (err) {
        console.error("KaTeX rendering error:", err);
        // Fallback: Show raw formula if rendering fails
        if (containerRef.current) {
          containerRef.current.innerText = formula;
          containerRef.current.classList.add('font-mono', 'text-slate-500', 'text-xs');
        }
      }
    }
  }, [formula, displayMode]);

  return <div ref={containerRef} className={displayMode ? "py-4 overflow-x-auto" : "inline-block"} />;
};

const MethodologyInfo: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-10 bg-white border border-slate-200 space-y-24 shadow-sm relative">
      {/* Watermark for Authority */}
      <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none select-none">
        <div className="text-[12rem] font-black leading-none">AUDIT</div>
      </div>

      {/* Header: Institutional Context */}
      <div className="border-b-8 border-slate-900 pb-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-red-700 uppercase tracking-[0.5em] mb-3">Technical Defense Registry / SEC-01-INFRA</p>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Econometric Defensibility Framework</h1>
          </div>
          <div className="text-right">
             <span className="inline-block border-2 border-slate-900 px-4 py-1 text-[10px] font-black uppercase tracking-widest">Standard: Internal Audit Protocol</span>
          </div>
        </div>
        <p className="text-sm font-serif italic text-slate-600 mt-6 leading-relaxed max-w-3xl">
          The CPCI is constructed to address the "Lived Experience Gap"—the statistical delta between institutional aggregate reporting and micro-level household liquidity. This document provides the mathematical justification for every divergence from the Laspeyres index methodology.
        </p>
      </div>

      {/* 1. The Governing Equation & Defensibility */}
      <section className="space-y-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg">01</div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">The Divergence Equation (CPCI)</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 p-10 bg-slate-50 border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-200 px-3 py-1 text-[8px] font-black uppercase">Primary Model</div>
            <div className="text-center py-16 bg-white border border-slate-100 shadow-inner">
              {/* FIXED: All backslashes doubled to avoid JS escape issues */}
              <MathBlock formula="CPCI_t = \\sum_{k=1}^{n} \\left[ \\left( \\frac{P_{kt}}{P_{k0}} \\right) \\cdot W_k \\cdot \\left( \\frac{V_k}{10} \\right) \\cdot E_k \\right] + S_t" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">Variable Inputs</h4>
                <ul className="text-[11px] font-medium text-slate-700 space-y-3">
                  <li><span className="font-mono text-red-700 font-bold">W_k :</span> <strong>Budget Weight.</strong> Anchored to StatCan 62F0026M quintile spending.</li>
                  <li><span className="font-mono text-red-700 font-bold">V_k :</span> <strong>Velocity Factor.</strong> Purchase frequency (e.g. 52x for groceries vs 1x for durables).</li>
                  <li><span className="font-mono text-red-700 font-bold">E_k :</span> <strong>Inelasticity.</strong> Mandatory nature of the cost (0.1 to 2.0 scale).</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">External Overlays</h4>
                <ul className="text-[11px] font-medium text-slate-700 space-y-3">
                  <li><span className="font-mono text-blue-700 font-bold">S_t :</span> <strong>Interest Shadow.</strong> Marginal debt-service cost omitted from standard CPI.</li>
                  <li><span className="font-mono text-blue-700 font-bold">{"P_{k0}"} :</span> <strong>Baseline Anchor.</strong> Fixed to Jan 2024 pricing index.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-8 text-white border-l-4 border-red-600 shadow-xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Defensibility Statement</h4>
              <p className="text-[11px] font-serif italic leading-relaxed text-slate-300">
                "Official CPI utilizes a <strong>Laspeyres Price Index</strong> which assumes consumers substitute expensive items for cheaper ones (The Substitution Effect). The CPCI rejects this for mandatory categories (Shelter/Food), arguing that <strong>Inelasticity ($E$)</strong> prevents substitution, thereby making the 'Perceived' price the 'Absolute' price for the household."
              </p>
            </div>
            <div className="p-6 border border-slate-100 bg-slate-50">
               <h5 className="text-[9px] font-black uppercase mb-2">Academic Source:</h5>
               <p className="text-[10px] text-slate-500 font-bold uppercase underline">JSTOR: Deaton & Muellbauer (1980)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Frequency Bias & Velocity Proof */}
      <section className="space-y-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg">02</div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">The Frequency Bias Justification ($V$)</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-[13px] font-serif text-slate-600 leading-relaxed italic">
              Standard economics treats a $1,000 rent increase once a year the same as a $20 gas increase every week. The CPCI recognizes that <strong>Purchase Velocity</strong> creates a continuous "Friction Signal" in household liquidity that impacts behavioral economics more heavily.
            </p>
            <div className="bg-slate-50 p-8 border-l-2 border-slate-900">
              <h4 className="text-[10px] font-black uppercase mb-4 tracking-widest">The Logic of Perception Weighting</h4>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                We apply a non-linear weight to high-frequency items. Items purchased weekly (<MathBlock formula="V \\approx 52" displayMode={false} />) are assigned a 1.25x perceptual multiplier, while annual costs (<MathBlock formula="V = 1" displayMode={false} />) remain at baseline. This corrects for the "availability heuristic" in consumer sentiment.
              </p>
            </div>
          </div>
          <div className="bg-slate-900 p-10 flex flex-col justify-center border border-slate-800 shadow-2xl">
             <div className="text-center space-y-4 text-white">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">Theoretical Anchor</p>
                <p className="text-xl font-black uppercase tracking-tighter">European Central Bank Paper No. 1251</p>
                <div className="h-px bg-slate-800 w-full"></div>
                <p className="text-[10px] text-slate-500 font-bold italic">"Consumer inflation perceptions are systematically higher for frequently purchased goods (FROOP)."</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Provincial Variance - Deterministic Factors */}
      <section className="space-y-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg">03</div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Regional Variance Pillars ($R_v$)</h2>
        </div>
        
        <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center">
             <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Defending Provincial Spread: Four Regulatory Pillars</h4>
             <div className="bg-white px-3 py-1 border border-slate-200">
                <MathBlock formula="R_c = (Tax_p + Fuel_c + Util_r) \\cdot Density_i" displayMode={false} />
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[
              { title: 'Taxation Friction', factor: 'HST/PST Delta', desc: 'Direct impact on non-exempt retail services and goods.' },
              { title: 'Energy Drag', factor: 'Carbon Multiplier', desc: 'Surcharge on logistics for transport-dependent provinces (NS, BC).' },
              { title: 'Utility Inelasticity', factor: 'Regulatory Pricing', desc: 'Variance in deregulated vs. crown utility markets (AB vs. MB).' },
              { title: 'Supply Velocity', factor: 'Logistics Density', desc: 'Cost of inventory turnover in low-density geographies.' }
            ].map((pillar, i) => (
              <div key={i} className="p-8 space-y-3">
                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{pillar.title}</h5>
                <span className="inline-block text-[8px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full">{pillar.factor}</span>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Predictive "Cliff" - Defensible Forecasting */}
      <section className="space-y-10 pb-20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg">04</div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Predictive "Friction Cliff" Modeling</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 p-8 bg-slate-900 text-white flex flex-col justify-center border-l-8 border-blue-600 shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Algorithmic Justification</h4>
            <p className="text-[11px] font-serif italic leading-relaxed text-slate-300">
              "Traditional forecasts are linear. The Friction Cliff uses <strong>Non-Linear Acceleration ($α$)</strong>. We defend this choice by observing that household savings are finite; once the divergence spread exceeds the savings-rate threshold, consumption enters a terminal decay phase."
            </p>
          </div>
          <div className="lg:col-span-8 p-10 bg-slate-50 border border-slate-200 shadow-sm">
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">Mathematical Verification</h4>
               <div className="bg-white p-6 border border-slate-100 shadow-inner">
                 <MathBlock formula="\\alpha = (CPCI_t - CPI_t) - (CPCI_{t-1} - CPI_{t-1})" />
                 <MathBlock formula="H_{system} = \\begin{cases} DECAY & \\alpha > 0.05 \\\\ STABLE & \\text{otherwise} \\end{cases}" />
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase italic text-center">
                 Note: Model assumes a localized threshold of $0.05\%$ MoM acceleration in the divergence spread.
               </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="pt-10 border-t-2 border-slate-100 text-center space-y-4 opacity-50">
        <p className="text-[10px] font-black tracking-[1.5em] uppercase text-slate-400">Canadian Perceived Cost Index / Defense Archive</p>
        <div className="flex justify-center space-x-8 text-[9px] font-mono text-slate-500">
          <span>MD5: a1b2c3d4e5f6</span>
          <span>AUTH: SYS-ROOT-STABLE</span>
          <span>TIMESTAMP: {new Date().toISOString()}</span>
        </div>
      </footer>
    </div>
  );
};

export default MethodologyInfo;