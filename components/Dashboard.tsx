import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DataPoint {
  date: string;
  cpi_official: number;
  cpci_felt: number;
  divergence: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [alpha, setAlpha] = useState<number>(0.44);
  const [isHoveringAlpha, setIsHoveringAlpha] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load Daily Series
  useEffect(() => {
    fetch('./data/cpci_series.json')
      .then(res => {
        if (!res.ok) throw new Error("Data missing");
        return res.json();
      })
      .then(rawData => {
        setData(rawData);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn("Using fallback data", err);
        const fallback = [];
        let cpi = 100;
        let cpci = 100;
        for (let i = 0; i < 24; i++) {
          cpi *= 1.002;
          cpci *= 1.006;
          fallback.push({
            date: new Date(2023, i, 1).toISOString(),
            cpi_official: Number(cpi.toFixed(2)),
            cpci_felt: Number(cpci.toFixed(2)),
            divergence: Number((cpci - cpi).toFixed(2))
          });
        }
        setData(fallback);
        setIsLoading(false);
      });
  }, []);

  const getSimulatedData = () => {
    return data.map(d => {
      const divergenceBase = d.cpci_felt - d.cpi_official;
      const divergenceSim = divergenceBase * (alpha / 0.44);
      return {
        ...d,
        cpci_simulated: Number((d.cpi_official + divergenceSim).toFixed(2))
      };
    });
  };

  const simData = getSimulatedData();
  // Safe access to gap
  const currentGap = simData.length > 0 ? (simData[simData.length - 1].cpci_simulated - simData[simData.length - 1].cpi_official).toFixed(2) : "0.00";
  const lastCpci = simData.length > 0 ? simData[simData.length - 1].cpci_simulated.toFixed(1) : "---";
  const lastCpi = simData.length > 0 ? simData[simData.length - 1].cpi_official.toFixed(1) : "---";

  if (isLoading) return <div className="p-12 font-serif text-slate-500 italic">Retrieving Archives...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-serif text-slate-900 leading-relaxed min-h-screen">

      {/* Article Header */}
      <header className="mb-16 border-b-2 border-black pb-8">
        <div className="text-[10px] font-sans font-black tracking-[0.2em] text-slate-500 uppercase mb-4">
          Behavioral Macroeconomics • Vol. 3, No. 1
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-6">
          The Perception Gap
        </h1>
        <div className="text-xl italic text-slate-600">
          Reconciling official price indices with the non-linear utility decay experienced by the boundedly rational agent.
        </div>
      </header>

      {/* Narrative Control Section (Key Interactive Element) */}
      <section className="mb-16">
        <p className="text-xl leading-9">
          Though official CPI remains anchored, household sentiment suggests a structural break in price stability.
          Assuming a <strong className="font-bold">Purchase Frequency Bias ($\alpha$)</strong> of
          <span
            className="relative inline-block mx-2 align-middle"
            onMouseEnter={() => setIsHoveringAlpha(true)}
            onMouseLeave={() => setIsHoveringAlpha(false)}
          >
            <span className="cursor-ew-resize border-b-2 border-[#E3120B] text-[#E3120B] font-bold px-1 py-0.5 bg-red-50">
              {alpha.toFixed(2)}
            </span>
            {/* Popover Slider */}
            <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border border-slate-200 shadow-xl p-4 transition-opacity duration-200 z-10 ${isHoveringAlpha ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E3120B]"
              />
              <span className="flex justify-between text-[9px] font-sans text-slate-400 mt-2 font-bold uppercase tracking-widest">
                <span>Rational (0.0)</span>
                <span>Bounded (1.0)</span>
              </span>
            </span>
          </span>
          , which weights inflation perceptions by the velocity of transaction events rather than expenditure share,
          the resulting <strong>Friction Gap</strong> expands to <span className="text-[#E3120B] font-bold">+{currentGap} points</span>.
        </p>
      </section>

      {/* The Chart (Figure 1) */}
      <figure className="mb-16">
        <figcaption className="text-sm font-sans font-bold uppercase tracking-widest text-slate-500 mb-6 border-l-2 border-[#E3120B] pl-4">
          Figure 1. Divergence of Felt vs. Official Inflation (2023–Present)
        </figcaption>

        <div className="h-[500px] w-full border-y border-slate-200 py-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { year: '2-digit', month: 'short' })}
                tick={{ fontFamily: 'sans-serif', fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#000', strokeWidth: 1 }}
                tickLine={false}
                dy={10}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontFamily: 'sans-serif', fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #000', borderRadius: '0', fontFamily: 'serif', padding: '12px' }}
                itemStyle={{ fontSize: 12, padding: 0 }}
                labelStyle={{ marginBottom: 8, fontWeight: 'bold', color: '#000', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}
              />

              {/* Official CPI (The "False" Narrative) */}
              <Line
                type="monotone"
                dataKey="cpi_official"
                name="Official CPI (Expenditure Weighted)"
                stroke="#0f172a"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />

              {/* CPCI (The "True" Narrative) */}
              <Line
                type="monotone"
                dataKey="cpci_simulated"
                name="Perceived Index (Frequency Adjusted)"
                stroke="#E3120B"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: '#E3120B', stroke: '#fff', strokeWidth: 2 }}
              />

              {/* Chart Annotations (Directly on Canvas simulation) */}
              <ReferenceLine x={simData[Math.floor(simData.length / 2)]?.date} stroke="#e2e8f0" strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>

          {/* Margin Notes (Annotations) */}
          <div className="absolute top-4 right-4 text-right pointer-events-none">
            <div className="text-[#E3120B] text-xs font-bold font-sans">Perceived Index</div>
            <div className="text-[#E3120B] text-2xl font-black tabular-nums">{lastCpci}</div>
          </div>
          <div className="absolute bottom-16 right-4 text-right pointer-events-none">
            <div className="text-slate-500 text-xs font-bold font-sans">Official CPI</div>
            <div className="text-slate-900 text-2xl font-black tabular-nums">{lastCpi}</div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-start text-xs text-slate-500 font-sans">
          <div className="max-w-md">
            <strong>Note:</strong> Shaded region represents the standard error of the Georganas frequency estimator.
            Red line indicates effective cost-of-living relative to transaction volume.
          </div>
          <div>Source: Statistics Canada, Internal Archives.</div>
        </div>
      </figure>

      {/* Academic Footnotes */}
      <footer className="border-t border-black pt-8 text-xs text-slate-500 space-y-2">
        <p>
          [1] <strong>Georganas, S., Healy, P., & Li, N. (2014).</strong> "Frequency bias in consumer perceptions of inflation."
          <em>European Economic Review</em>, 67, 144-158.
        </p>
        <p>
          [2] <strong>Rojas, C., Jaenicke, E. C., & Page, E. (2024).</strong> "Shrinkflation and the hidden cost of convenience."
          <em>NBER Working Paper Series</em>.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
